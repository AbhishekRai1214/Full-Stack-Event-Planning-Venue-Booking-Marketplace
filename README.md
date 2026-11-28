# VenueAura 🏛️✨

> **Full-Stack Event Planning & Venue Booking Marketplace built with the MERN Stack.**

[![CI/CD](https://github.com/AbhishekRai1214/Full-Stack-Event-Planning-Venue-Booking-Marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/AbhishekRai1214/Full-Stack-Event-Planning-Venue-Booking-Marketplace/actions)
[![MERN Stack](https://img.shields.io/badge/Stack-MongoDB%20%7C%20Express%20%7C%20React%20%7C%20Node-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

VenueAura is an enterprise-grade digital marketplace connecting event hosts with heritage palaces, luxury banquet halls, lawns, and top-tier event service professionals (photographers, caterers, decorators, DJs, makeup artists) across India.

---

## 🌟 Key Capabilities & Features

| Domain | Key Capabilities |
|---|---|
| 🏛️ **Venue Discovery** | Multi-faceted search by city, event type, capacity, price per plate, and amenities with real-time filtering |
| 📸 **Vendor Marketplace** | Category discovery, service packages, portfolio galleries, and direct quotation requests |
| ⚖️ **Side-by-Side Comparison** | Real-time comparative matrix for venues and vendors with capacity, pricing, and feature highlights |
| 📅 **Booking State Machine** | Formal lifecycle transitions (`enquiry` → `confirmed` → `advance_paid` → `fully_paid` → `completed`) |
| 💳 **Razorpay Payments** | Advance deposits and balance settlements with cryptographic server-side HMAC-SHA256 verification |
| ☁️ **Cloudinary Media Pipeline**| High-performance streaming image uploader with format/quality auto-optimization |
| 💬 **Real-Time Direct Chat** | Instant messaging powered by Socket.io with rooms, typing indicators, read receipts, and listing deep linking |
| 💰 **Budget & Expense Planner** | Interactive categorized expense manager with live utilization bars and financial charts |
| 🔔 **Notification Center** | In-app real-time alerts for booking updates, payment captures, and inquiry replies |
| 🛡️ **Role-Based Access Control** | Dual-token authentication (short-lived JWT + HttpOnly refresh cookies) across Customer, Vendor, and Admin roles |
| 👑 **Admin & Vendor Portals** | Vendor listing manager and Admin verification center with platform analytics and KYC verification |

---

## 🏗️ Architecture & Tech Stack

```
Client (React 18 + Vite + Redux Toolkit + Tailwind CSS)
  │
  ├── REST API Requests (Axios with auto-refresh interceptors)
  └── WebSocket Connections (Socket.IO client for live chat)
        │
        ▼
Reverse Proxy (Nginx with Gzip & SSL)
        │
Express.js Modular Monolith Backend
  ├── Security: Helmet, CORS, Rate Limiting, MongoSanitize
  ├── Auth: Dual-Token JWT + HttpOnly Cookies (BCrypt 12 rounds)
  ├── Validation: Strict Zod schemas on every route
  ├── Messaging: Socket.io real-time engine with room routing
  ├── Database: MongoDB & Mongoose ORM
  └── External Services: Razorpay Gateway & Cloudinary CDN
```

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/AbhishekRai1214/Full-Stack-Event-Planning-Venue-Booking-Marketplace.git
cd Full-Stack-Event-Planning-Venue-Booking-Marketplace

# Build and start all containers (MongoDB, Backend API, Frontend Nginx)
docker-compose up --build -d

# Verify containers are healthy
docker-compose ps
```

- **Frontend Application:** `http://localhost` (Port 80)
- **Backend API Server:** `http://localhost:5000/api/v1`
- **Health Check Endpoint:** `http://localhost:5000/health`

### Option 2: Run Locally (Bare Metal)

```bash
# 1. Install root, backend, and frontend dependencies
npm run install:all

# 2. Configure environment variables
cp backend/.env.example backend/.env

# 3. Start both backend and frontend concurrently in development mode
npm run dev
```

- Frontend runs at: `http://localhost:5173`
- Backend runs at: `http://localhost:5000`

---

## 📚 API Reference Overview

All REST endpoints follow standard conventions under `/api/v1/*`:

- `POST /api/v1/auth/register` – Register new user
- `POST /api/v1/auth/login` – Login & receive tokens
- `GET  /api/v1/venues` – List venues with multi-filtering
- `GET  /api/v1/vendors` – List vendors by category
- `POST /api/v1/bookings` – Initiate venue/vendor booking
- `POST /api/v1/payments/create-order` – Create Razorpay payment order
- `POST /api/v1/payments/verify` – Verify HMAC-SHA256 payment signature
- `POST /api/v1/upload/single` – Upload media to Cloudinary
- `GET  /api/v1/chat/conversations` – List direct chat threads
- `GET  /api/v1/budgets/my-budget` – Get customer budget planner

---

## 📋 Comprehensive Phase Roadmap

All 16 phases from initial architecture to production readiness have been built, verified, and committed:

- **Phase 0:** System Architecture & Database Design
- **Phase 1:** Backend Skeleton & Health Probes
- **Phase 2:** Design System & Reusable UI Components
- **Phase 3:** Marketplace Homepage & Interactive Search
- **Phase 4:** Venue Discovery & Details Showcase
- **Phase 5:** Vendor Marketplace & Service Packages
- **Phase 6:** JWT Authentication & Role-Based Access Control
- **Phase 7:** Event Management & Milestone Planner
- **Phase 8:** Booking Workflow & State Machine
- **Phase 9:** Budget Planner & Expense Calculator
- **Phase 10:** Side-by-Side Comparison Tool
- **Phase 11:** Reviews, Real-time Notification Bell & Inquiries
- **Phase 12:** Admin Control Center & Vendor Partner Portal
- **Phase 13:** Payment Integration (Razorpay) & Cloudinary Upload Pipeline
- **Phase 14:** Real-Time Direct Messaging (Socket.io)
- **Phase 15:** Dockerization, Nginx Config, CI/CD GitHub Actions & Production Polish

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
