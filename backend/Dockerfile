# ===================================================================
# UNIVERSAL MEDIA STUDIO - BACKEND PRODUCTION DOCKERFILE FOR COOLIFY / DOCKER COMPOSE
# Includes Node.js, Python 3, FFmpeg, yt-dlp, and POT Plugin
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

# Install yt-dlp via pip and ensure executable in PATH
RUN pip install --no-cache-dir --break-system-packages -U yt-dlp bgutil-ytdlp-pot-provider

# Ensure /usr/local/bin/yt-dlp is present
RUN which yt-dlp || ln -s $(which yt-dlp) /usr/local/bin/yt-dlp || true

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
