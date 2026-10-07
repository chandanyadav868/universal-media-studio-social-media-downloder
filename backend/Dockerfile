# ===================================================================
# UNIVERSAL MEDIA STUDIO - BACKEND PRODUCTION DOCKERFILE
# Node.js 20 + Python 3 + FFmpeg + yt-dlp[default] (EJS challenge solver) + bgutil PO-token plugin
# ===================================================================

FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp[default] pulls in yt-dlp-ejs (needed to solve YouTube JS challenges).
# bgutil-ytdlp-pot-provider is the plugin that fetches PO tokens from the pot-provider container.
# Both must be installed with pip into the same Python so the plugin is discovered.
RUN pip install --no-cache-dir --break-system-packages -U "yt-dlp[default]" bgutil-ytdlp-pot-provider \
    && yt-dlp --version

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
