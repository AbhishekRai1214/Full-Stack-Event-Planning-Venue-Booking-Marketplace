# VenueAura – Production Deployment Guide

This guide covers running VenueAura in production via **Docker Compose**, cloud container hosts (**Railway**, **Render**), and dedicated **VPS (Ubuntu, Nginx, Let's Encrypt SSL)**.

---

## 1. Environment Variables Configuration

### Backend Environment Matrix (`backend/.env`)

```ini
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database (MongoDB Atlas or Replica Set)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/venueaura?retryWrites=true&w=majority

# JWT Authentication (generate 64-char hex: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ACCESS_TOKEN_SECRET=your_super_secret_64_char_access_token_key_here
REFRESH_TOKEN_SECRET=your_super_secret_64_char_refresh_token_key_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# CORS & Client
CLIENT_URL=https://venueaura.com
ALLOWED_ORIGINS=https://venueaura.com,https://www.venueaura.com

# Cloudinary (Image Pipeline)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Razorpay Payments
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_razorpay_secret

# SMTP Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
EMAIL_FROM=VenueAura <support@venueaura.com>

# Logging
LOG_LEVEL=info
```

### Frontend Environment Matrix (`frontend/.env`)

```ini
VITE_API_URL=https://venueaura.com/api/v1
VITE_SOCKET_URL=https://venueaura.com
```

---

## 2. Docker Compose Deployment (Self-Hosted)

Run the entire full-stack application (MongoDB, Backend, and Frontend Nginx) with a single command:

```bash
# 1. Clone repository
git clone https://github.com/AbhishekRai1214/Full-Stack-Event-Planning-Venue-Booking-Marketplace.git
cd Full-Stack-Event-Planning-Venue-Booking-Marketplace

# 2. Build and run containers
docker-compose up --build -d

# 3. Verify container health status
docker-compose ps

# 4. View real-time logs
docker-compose logs -f backend
```

- **Frontend:** `http://localhost` (Port 80)
- **Backend API:** `http://localhost:5000/api/v1`
- **Health Probe:** `http://localhost:5000/health`

---

## 3. Ubuntu VPS Deployment (Nginx + Systemd + Let's Encrypt)

### Step 1: Install Node.js, PM2, and Nginx
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### Step 2: Build & Start Backend with PM2
```bash
cd /var/www/venueaura/backend
npm ci --only=production
pm2 start src/server.js --name "venueaura-backend" -i max
pm2 save
pm2 startup
```

### Step 3: Build Frontend
```bash
cd /var/www/venueaura/frontend
npm ci
npm run build
# Files output to /var/www/venueaura/frontend/dist
```

### Step 4: Configure Nginx & SSL
Create `/etc/nginx/sites-available/venueaura`:

```nginx
server {
    server_name venueaura.com www.venueaura.com;

    root /var/www/venueaura/frontend/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    # Frontend SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket Proxy for Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable site & provision Let's Encrypt SSL:
```bash
sudo ln -s /etc/nginx/sites-available/venueaura /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d venueaura.com -d www.venueaura.com
```

---

## 4. Cloud Platform Deployment (Railway / Render)

### Deploying Backend:
- **Build Command:** `npm ci --prefix backend`
- **Start Command:** `npm run start --prefix backend`
- **Healthcheck Path:** `/health`
- Set all environment variables from Section 1.

### Deploying Frontend:
- **Build Command:** `npm run build --prefix frontend`
- **Publish Directory:** `frontend/dist`
- **Rewrite Rule:** `/*` → `/index.html` (200 status for SPA routing).
