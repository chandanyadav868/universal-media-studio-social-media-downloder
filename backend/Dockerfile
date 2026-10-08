# ===================================================================
# UNIVERSAL MEDIA STUDIO - BACKEND PRODUCTION DOCKERFILE
# Node.js 20 + Python 3 + FFmpeg + Deno (EJS challenges) + yt-dlp + cookies.txt
# ===================================================================

FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    ca-certificates \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Deno as the official, high-performance JS runtime for yt-dlp EJS challenges
RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

# Install latest yt-dlp
RUN pip install --no-cache-dir --break-system-packages -U "yt-dlp[default]" \
    && yt-dlp --version \
    && deno --version

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .

# Protect cookies.txt from being truncated by yt-dlp during runtime
RUN chmod 444 /app/cookies.txt

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
