# VenueAura – Deployment Guide

## Environment Requirements

### Backend Environment Variables (.env)

```
# App
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/venueaura
# For transactions, use a replica set:
# MONGODB_URI=mongodb://localhost:27017/venueaura?replicaSet=rs0

# JWT
ACCESS_TOKEN_SECRET=<min 64 char random string>
REFRESH_TOKEN_SECRET=<min 64 char random string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Frontend URL (for CORS)
ALLOWED_ORIGINS=http://localhost:5173,https://venueaura.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay (use test keys in development)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=VenueAura <no-reply@venueaura.com>

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables (.env)

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=
VITE_GOOGLE_MAPS_KEY=
```

---

## MongoDB Transactions Note

> [!IMPORTANT]
> MongoDB transactions require a **Replica Set**. A standalone `mongod` instance does NOT support transactions.
>
> **For local development with transactions:**
> ```bash
> mongod --replSet rs0 --port 27017
> # Then in mongo shell:
> rs.initiate()
> ```
>
> **OR use Docker Compose (recommended):**
> See `docker-compose.yml` in the project root.
>
> **On MongoDB Atlas:** Transactions are always supported (Atlas always uses replica sets).

---

## Docker Compose (Local Development)

```yaml
# docker-compose.yml (created in a later phase)
services:
  mongodb:
    image: mongo:7
    command: ["--replSet", "rs0"]
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  mongo-init:
    image: mongo:7
    depends_on:
      - mongodb
    command: >
      mongosh --host mongodb:27017 --eval "rs.initiate()"
    
volumes:
  mongo_data:
```

---

## Deployment Platforms

### Option 1: Railway.app (Recommended for learning)
- Free tier available
- Automatic deploys from GitHub
- Built-in MongoDB service
- Environment variables via dashboard

### Option 2: Render.com
- Free tier with sleep mode
- Web Service for backend
- Static Site for frontend
- Use MongoDB Atlas for database

### Option 3: VPS (DigitalOcean / Hetzner)
- Full control
- PM2 for process management
- Nginx as reverse proxy
- Certbot for SSL

---

## Production Checklist

- [ ] NODE_ENV=production
- [ ] Strong JWT secrets (use `openssl rand -base64 64`)
- [ ] MONGODB_URI points to Atlas or secured replica set
- [ ] CORS allowlist contains only production domain
- [ ] Rate limiting configured for production traffic
- [ ] HTTPS enabled (Nginx + Certbot or platform SSL)
- [ ] Error logs monitored (not shown to users)
- [ ] .env file never committed to Git
- [ ] Cloudinary production account configured
- [ ] Razorpay live keys (not test keys)
- [ ] Email service configured and tested
- [ ] Health endpoints responding correctly
- [ ] Graceful shutdown implemented

