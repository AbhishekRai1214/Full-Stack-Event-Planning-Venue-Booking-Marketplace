# VenueAura – Database Design

## Design Philosophy

MongoDB is used with Mongoose. Schema design follows these principles:
- **Embed** data that is always read together and doesn't change independently (e.g., venue facilities array)
- **Reference** data that is shared, updated independently, or forms large sets (e.g., reviews, users)
- Avoid deeply nested documents to maintain queryability
- Use compound indexes on frequently queried field combinations
- Use transactions only where ACID guarantees are genuinely required

---

## Entity Relationship Overview

```
User ──────────────────────────── Booking
 │                                  │   │
 │── saves ──→ Venue ←── belongs ──┘   │── has ──→ Payment
 │── saves ──→ Vendor ←────────────────┘
 │── owns ──→ Vendor (vendor users)   
 │── creates ──→ Event               
 │── creates ──→ Budget ──→ BudgetExpense[]
 │── writes ──→ Review ──→ Venue/Vendor
 │── sends ──→ Contact
 │── receives ──→ Notification
```

---

## Collection Schemas

### 1. User

```
users {
  _id: ObjectId
  name: String (required, 2-50 chars)
  email: String (required, unique, lowercase)
  password: String (required, hashed, never returned)
  phone: String
  avatar: String (Cloudinary URL)
  role: Enum ['CUSTOMER', 'VENDOR', 'ADMIN'] (default: CUSTOMER)
  isEmailVerified: Boolean (default: false)
  emailVerificationToken: String
  emailVerificationExpiry: Date
  passwordResetToken: String
  passwordResetExpiry: Date
  refreshTokens: [{ token: String, createdAt: Date, expiresAt: Date }]
  savedVenues: [ObjectId → venues]
  savedVendors: [ObjectId → vendors]
  isActive: Boolean (default: true)
  lastLogin: Date
  createdAt: Date
  updatedAt: Date

  Indexes:
  - email: unique
  - role: 1
}
```

### 2. Venue

```
venues {
  _id: ObjectId
  name: String (required)
  slug: String (unique, auto-generated)
  description: String
  owner: ObjectId → users (required)
  
  location: {
    address: String
    city: String (required, indexed)
    state: String
    pincode: String
    coordinates: { lat: Number, lng: Number }
  }
  
  eventTypes: [Enum] (wedding, birthday, engagement, corporate, ...)
  
  capacity: {
    min: Number
    max: Number (required, indexed)
  }
  
  pricing: {
    startingPrice: Number (required, indexed)
    pricePerPlate: Number
    currency: String (default: 'INR')
  }
  
  venueType: Enum ['indoor', 'outdoor', 'rooftop', 'banquet', 'farmhouse']
  
  facilities: [String] (parking, AC, catering, decor, ...)
  
  images: [{
    url: String (Cloudinary)
    publicId: String
    isPrimary: Boolean
  }]
  
  status: Enum ['pending', 'approved', 'rejected', 'suspended']
  isVerified: Boolean
  isFeatured: Boolean
  
  ratings: {
    average: Number (default: 0)
    count: Number (default: 0)
  }
  
  availability: [{
    date: Date
    isBooked: Boolean
  }]
  
  createdAt, updatedAt

  Indexes:
  - slug: unique
  - 'location.city': 1
  - 'pricing.startingPrice': 1
  - 'capacity.max': 1
  - status: 1, isFeatured: -1
  - eventTypes: 1
  - Text index: name, description, 'location.city'
}
```

### 3. Vendor

```
vendors {
  _id: ObjectId
  user: ObjectId → users (required, unique)
  businessName: String (required)
  slug: String (unique)
  category: Enum ['photographer', 'caterer', 'decorator', 'dj', 'makeup', 
                   'transport', 'florist', 'band', 'mehndi', 'pandit', 'invitation', 'tent']
  description: String
  
  location: {
    city: String (required, indexed)
    state: String
    serviceAreas: [String]
  }
  
  experience: Number (years)
  
  packages: [{
    name: String
    description: String
    price: Number
    includes: [String]
  }]
  
  portfolio: [{
    url: String
    publicId: String
    caption: String
  }]
  
  contact: {
    phone: String
    email: String
    website: String
    instagram: String
  }
  
  status: Enum ['pending', 'approved', 'rejected']
  isVerified: Boolean
  isFeatured: Boolean
  
  ratings: {
    average: Number
    count: Number
  }
  
  createdAt, updatedAt

  Indexes:
  - user: unique
  - slug: unique
  - category: 1
  - 'location.city': 1
  - status: 1
}
```

### 4. Booking

```
bookings {
  _id: ObjectId
  bookingNumber: String (unique, auto-generated: VA-YYYYMMDD-XXXXX)
  customer: ObjectId → users (required)
  
  bookingType: Enum ['venue', 'vendor'] (required)
  venue: ObjectId → venues (conditional)
  vendor: ObjectId → vendors (conditional)
  
  event: {
    name: String
    type: Enum
    date: Date (required)
    guestCount: Number
  }
  
  pricing: {
    baseAmount: Number
    taxes: Number
    totalAmount: Number
    currency: String (default: 'INR')
    advanceRequired: Number
    advancePaid: Number
  }
  
  status: Enum ['enquiry', 'confirmed', 'advance_paid', 'fully_paid', 
                'completed', 'cancelled', 'rejected']
  
  payment: ObjectId → payments
  
  notes: String (customer)
  vendorNotes: String (vendor response)
  
  cancellation: {
    cancelledBy: ObjectId → users
    reason: String
    cancelledAt: Date
    refundAmount: Number
    refundStatus: Enum ['pending', 'processed', 'failed']
  }
  
  createdAt, updatedAt

  Indexes:
  - bookingNumber: unique
  - customer: 1, createdAt: -1
  - venue: 1, 'event.date': 1 (for availability check)
  - vendor: 1, 'event.date': 1
  - status: 1
}
```

### 5. Payment

```
payments {
  _id: ObjectId
  booking: ObjectId → bookings (required)
  customer: ObjectId → users (required)
  
  razorpayOrderId: String (unique)
  razorpayPaymentId: String
  razorpaySignature: String
  
  amount: Number (in paise)
  currency: String
  
  status: Enum ['created', 'authorized', 'captured', 'failed', 'refunded']
  
  idempotencyKey: String (unique, to prevent duplicates)
  
  method: String (card, upi, netbanking, etc.)
  
  webhookEvents: [{
    event: String
    payload: Mixed
    processedAt: Date
  }]
  
  createdAt, updatedAt

  Indexes:
  - razorpayOrderId: unique
  - idempotencyKey: unique
  - customer: 1
  - status: 1
}
```

### 6. Event

```
events {
  _id: ObjectId
  owner: ObjectId → users (required)
  name: String (required)
  eventType: Enum
  date: Date
  guestCount: Number
  
  venue: ObjectId → venues
  vendors: [ObjectId → vendors]
  
  budget: ObjectId → budgets
  
  notes: String
  status: Enum ['planning', 'confirmed', 'completed', 'cancelled']
  
  createdAt, updatedAt

  Indexes:
  - owner: 1, date: -1
}
```

### 7. Budget

```
budgets {
  _id: ObjectId
  owner: ObjectId → users (required)
  event: ObjectId → events
  
  name: String (required)
  totalBudget: Number (required)
  currency: String (default: 'INR')
  
  expenses: [{
    _id: ObjectId
    category: Enum ['venue', 'catering', 'decoration', 'photography', 
                     'dj', 'transport', 'makeup', 'mehndi', 'invitation', 
                     'clothing', 'gifts', 'other']
    name: String
    estimatedAmount: Number
    actualAmount: Number
    isPaid: Boolean
    notes: String
    createdAt: Date
  }]
  
  // Computed fields (server-side only, never trusted from client)
  totalEstimated: Number  
  totalActual: Number     
  remainingBudget: Number 
  utilizationPercent: Number
  
  createdAt, updatedAt

  Indexes:
  - owner: 1
  - event: 1 (unique sparse)
}
```

### 8. Review

```
reviews {
  _id: ObjectId
  author: ObjectId → users (required)
  
  targetType: Enum ['venue', 'vendor'] (required)
  venue: ObjectId → venues (conditional)
  vendor: ObjectId → vendors (conditional)
  
  booking: ObjectId → bookings (required - only verified bookers can review)
  
  rating: Number (1-5, required)
  title: String
  comment: String
  
  images: [{ url: String, publicId: String }]
  
  isVerified: Boolean (true if booking is completed)
  
  ownerResponse: {
    comment: String
    respondedAt: Date
  }
  
  isHidden: Boolean (admin moderation)
  
  createdAt, updatedAt

  Indexes:
  - venue: 1, createdAt: -1
  - vendor: 1, createdAt: -1
  - author: 1
  - booking: 1 (unique - one review per booking)
}
```

### 9. Contact

```
contacts {
  _id: ObjectId
  name: String (required)
  email: String (required)
  phone: String
  subject: String
  message: String (required)
  
  status: Enum ['new', 'read', 'replied', 'closed']
  adminNotes: String
  
  ipAddress: String (for spam prevention)
  
  createdAt, updatedAt

  Indexes:
  - status: 1, createdAt: -1
  - email: 1
}
```

### 10. Notification

```
notifications {
  _id: ObjectId
  recipient: ObjectId → users (required)
  
  type: Enum ['booking_created', 'booking_confirmed', 'booking_cancelled', 
              'payment_received', 'review_posted', 'vendor_approved', 
              'venue_approved', 'general']
  
  title: String
  message: String
  
  data: Mixed (additional context, e.g., bookingId)
  
  isRead: Boolean (default: false)
  readAt: Date
  
  createdAt, updatedAt

  Indexes:
  - recipient: 1, isRead: 1, createdAt: -1
}
```

---

## Relationships Summary

| From | To | Type | Note |
|---|---|---|---|
| User | Venue | 1:many | User owns venues (vendor role) |
| User | Vendor | 1:1 | Vendor profile per user |
| User | Booking | 1:many | Customer bookings |
| User | Budget | 1:many | Budgets per user |
| User | Review | 1:many | Reviews written |
| Venue | Booking | 1:many | Bookings for venue |
| Vendor | Booking | 1:many | Bookings for vendor |
| Booking | Payment | 1:1 | One payment per booking |
| Booking | Review | 1:1 | One review per booking |
| Event | Budget | 1:1 | Budget linked to event |
| Event | Venue | many:1 | Event uses one venue |

---

## Transaction Strategy

MongoDB transactions require a Replica Set. Transactions are used for:

1. **Booking creation** – Create booking + update venue availability atomically
2. **Payment verification** – Update payment status + update booking status atomically
3. **Budget expense operations** – Update expense array + recalculate totals atomically

For local development, use `mongod --replSet rs0` or MongoDB Atlas (always replica set).

Document in deployment guide that standalone `mongod` does not support transactions.
