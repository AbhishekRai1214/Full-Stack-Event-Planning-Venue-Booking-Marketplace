# VenueAura

> **A premium event planning and venue booking marketplace built with the MERN stack.**

VenueAura connects event planners with wedding venues, birthday spaces, banquet halls, and professional event service vendors across India.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏛️ Venue Discovery | Search, filter, and compare venues by location, event type, capacity, and price |
| 🎭 Vendor Marketplace | Browse photographers, caterers, decorators, DJs, makeup artists, and more |
| 📅 Event Booking | Book venues and vendors with date availability validation |
| 💰 Budget Planner | Plan and track your complete event budget with expense categories |
| ⚖️ Compare | Side-by-side comparison of venues and vendors |
| 🔐 Secure Auth | JWT-based auth with role-based access control (Customer / Vendor / Admin) |
| 💳 Payments | Razorpay integration for secure online payments |
| 📊 Dashboards | Personalized dashboards for customers, vendors, and admins |
| ⭐ Reviews | Verified reviews from customers who have completed bookings |

---

## 🛠️ Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- React Hook Form + Zod
- Axios

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Pino (logging)
- Zod (validation)

**Integrations:**
- Cloudinary (image uploads)
- Razorpay (payments)
- Nodemailer (emails)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB >= 7.x (with replica set for transactions — see [docs/deployment.md](docs/deployment.md))
- npm >= 9.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/venueaura.git
cd venueaura

# 2. Install root-level dependencies
npm install

# 3. Install all project dependencies
npm run install:all

# 4. Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your values

cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values

# 5. Start development servers
npm run dev
```

The backend will be available at `http://localhost:5000`  
The frontend will be available at `http://localhost:5173`  
API docs (Swagger): `http://localhost:5000/api-docs`  
Health check: `http://localhost:5000/health`

---

## 📁 Project Structure

```
venueaura/
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express API
├── docs/              # Architecture and design documentation
├── PHASES.md          # Development phase tracker
└── README.md
```

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | System design, tech choices, module structure |
| [Database Design](docs/database-design.md) | MongoDB schemas and relationships |
| [Authentication Flow](docs/authentication-flow.md) | JWT auth sequences and security |
| [API Design](docs/api-design.md) | All REST endpoints and conventions |
| [Security](docs/security.md) | OWASP mitigations and security implementation |
| [Booking Workflow](docs/booking-workflow.md) | Booking state machine and availability logic |
| [Payment Workflow](docs/payment-workflow.md) | Razorpay integration and verification |
| [Testing Strategy](docs/testing-strategy.md) | Test scenarios and coverage |
| [Deployment](docs/deployment.md) | Environment setup and production guide |

---

## 🔒 Roles

| Role | Capabilities |
|---|---|
| **Customer** | Browse, book, review, plan budget, manage events |
| **Vendor** | List venues/services, manage bookings, respond to reviews |
| **Admin** | Approve listings, verify vendors, manage platform |

---

## 🧪 Testing

```bash
cd backend
npm run test              # All tests
npm run test:unit         # Unit tests
npm run test:integration  # Integration tests
npm run test:coverage     # With coverage report
```

---

## 📸 Screenshots

> *Screenshots will be added as the UI is built in later phases.*

---

## 🤝 Contributing

This is a learning and portfolio project. The development is intentionally incremental with meaningful commits showing the full journey from architecture to production-ready application.

---

## 📜 License

MIT License – see [LICENSE](LICENSE) for details.
