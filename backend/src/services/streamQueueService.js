/**
 * Zero-Disk Stream Concurrency Manager & Queue Semaphore
 * Prevents 1-Core VPS crashes under high traffic by queuing simultaneous downloads.
 */

const rawLimit = String(process.env.MAX_CONCURRENT_STREAMS || "3").replace(/[^0-9]/g, "");
const MAX_CONCURRENT_STREAMS = Number.parseInt(rawLimit, 10) || 3;
let activeStreams = 0;
const waitingQueue = []; // FIFO queue of { ticketId, resolve, reject, createdAt }

export function getQueueStatus() {
  return {
    activeStreams,
    maxConcurrent: MAX_CONCURRENT_STREAMS,
    queuedCount: waitingQueue.length,
  };
}

/**
 * Acquire a stream slot ticket.
 * If slots available, immediately resolves slot token.
 * If slots full, queues user in FIFO order with ticket ID and estimated wait time.
 */
export async function acquireStreamSlot(timeoutMs = 120000) {
  if (activeStreams < MAX_CONCURRENT_STREAMS) {
    activeStreams++;
    console.log(`[StreamQueue] Slot granted immediately. Active: ${activeStreams}/${MAX_CONCURRENT_STREAMS}`);
    return {
      status: "READY",
      ticketId: `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      activeStreams,
      queuePosition: 0,
    };
  }

  // Slots are full! Add to FIFO queue
  const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const position = waitingQueue.length + 1;
  const estimatedWaitSeconds = position * 8; // Average stream duration ~8-15s

  console.log(`[StreamQueue] Slots busy (${activeStreams}/${MAX_CONCURRENT_STREAMS}). User queued at #${position}. Ticket: ${ticketId}`);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const idx = waitingQueue.findIndex((item) => item.ticketId === ticketId);
      if (idx !== -1) {
        waitingQueue.splice(idx, 1);
        reject(new Error("Queue wait timeout: High server load, please try again."));
      }
    }, timeoutMs);

    waitingQueue.push({
      ticketId,
      resolve: () => {
        clearTimeout(timeout);
        activeStreams++;
        resolve({
          status: "READY",
          ticketId,
          activeStreams,
          queuePosition: 0,
        });
      },
      reject: (err) => {
        clearTimeout(timeout);
        reject(err);
      },
      createdAt: Date.now(),
    });
  });
}

/**
 * Release a stream slot when streaming completes or client disconnects
 */
export function releaseStreamSlot(ticketId) {
  if (activeStreams > 0) {
    activeStreams--;
  }
  console.log(`[StreamQueue] Slot released (ticket: ${ticketId || "anon"}). Active: ${activeStreams}/${MAX_CONCURRENT_STREAMS}, Queued: ${waitingQueue.length}`);

  // Wake up the next waiting user in FIFO line
  if (waitingQueue.length > 0 && activeStreams < MAX_CONCURRENT_STREAMS) {
    const nextUser = waitingQueue.shift();
    if (nextUser && typeof nextUser.resolve === "function") {
      console.log(`[StreamQueue] Promoting queued user ${nextUser.ticketId} to active stream slot!`);
      nextUser.resolve();
    }
  }
}
