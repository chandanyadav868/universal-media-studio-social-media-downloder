# ===================================================================
# UNIVERSAL MEDIA STUDIO - BACKEND PRODUCTION DOCKERFILE FOR COOLIFY / DOCKER COMPOSE
# Includes Node.js, Python 3, FFmpeg, yt-dlp binary, and POT Plugin
# ===================================================================

FROM node:20-bookworm-slim

# Install system dependencies: Python3, FFmpeg, curl, ca-certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install latest yt-dlp binary
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Install PO-Token Provider companion plugin for yt-dlp to bypass bot detection on datacenter VPS
RUN pip install --no-cache-dir --break-system-packages -U bgutil-ytdlp-pot-provider || true

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci || npm install

# Copy application source code
COPY . .

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
