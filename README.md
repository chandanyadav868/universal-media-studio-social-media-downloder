# Universal Media Studio (Next.js + Node.js Zero-Disk Architecture)

A production-ready, high-speed Universal Media Downloader built with **Next.js (App Router, Server-Side SEO, Google AdSense)** and **Node.js (In-Memory Zero-Disk `yt-dlp` + FFmpeg streaming)**.

---

## 📁 Project Architecture

```
universal-media-studio/
├── frontend/                     # Next.js 15+ App Router
│   ├── app/
│   │   ├── layout.jsx            # AdSense Script & JSON-LD WebApplication Schema
│   │   ├── page.jsx              # Server-Side Rendered SEO Metadata & FAQ Content
│   │   └── globals.css           # Glassmorphism Design System & Clean Dark Theme
│   ├── components/
│   │   ├── MediaStudio.jsx       # Core Interactive Search & Format Controller
│   │   ├── FormatCard.jsx        # Dynamic Format Card (1080p, 720p, 4K, MP3)
│   │   ├── DownloadModal.jsx     # 5-Second AdSense Countdown Gate
│   │   └── AdBanner.jsx          # Reusable Google AdSense Component
│   ├── next.config.mjs           # Next.js API Proxy Rewrites (/api/media/* -> :5000)
│   └── package.json
│
└── backend/                      # Node.js Zero-Disk Streaming Microservice
    ├── src/
    │   ├── services/
    │   │   └── zeroDiskStreamService.js  # yt-dlp + FFmpeg stdout in-memory pipe
    │   └── server.js             # Express API (:5000)
    └── package.json
```

---

## ⚡ Key Highlights

1. **Zero-Disk In-Memory Streaming**: 
   - No `.temp.mp4` or fragment files touch the server hard drive.
   - Streams directly from remote CDNs -> RAM buffers (64KB chunks) -> User browser attachment.
   - Protects your 50GB VPS SSD from filling up.
2. **Top-Tier Google SEO Ranking**:
   - Next.js Server Components with `generateMetadata`, OpenGraph tags, canonical URLs, and JSON-LD schema.
   - Googlebot crawls fully rendered HTML.
3. **High-CTR AdSense Monetization**:
   - Header leaderboard ad slot.
   - Native in-feed ad slot between video preview and download cards.
   - 5-second countdown download gate modal with high-CPM ad unit.
   - Bottom anchor ad slot.
4. **Lightweight on 1-Core / 4GB RAM VPS**:
   - Next.js standalone: ~130MB RAM.
   - Node.js backend: ~80MB RAM.
   - Total idle footprint: **~210MB RAM**, leaving over **3.5GB of RAM free**!

---

## 🚀 How to Run Locally

### 1. Start the Backend (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Next.js Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 VPS Production Deployment Commands (Ubuntu / Debian)

### 1. Configure Linux Swap (Mandatory for 1 Core / 4GB RAM)
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Install Python 3, Pip & Latest `yt-dlp`
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv ffmpeg

# Install yt-dlp binary system-wide
sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Verify
yt-dlp --version
ffmpeg -version
```

### 3. Install Node.js 20 & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 4. Start Services with PM2
```bash
# Backend (Port 5000)
cd /var/www/universal-media-studio/backend
npm install --production
pm2 start src/server.js --name "media-backend" --max-memory-restart 300M

# Frontend (Port 3000)
cd /var/www/universal-media-studio/frontend
npm install
npm run build
pm2 start npm --name "media-frontend" --max-memory-restart 400M -- start

pm2 save
pm2 startup
```

### 5. Nginx Reverse Proxy Configuration
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    # Media stream and info routes to Node.js
    location /api/media/ {
        proxy_pass http://127.0.0.1:5000/api/media/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering off; # Crucial for real-time zero-disk stream chunks
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
    }

    # All UI routes to Next.js SSR
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
