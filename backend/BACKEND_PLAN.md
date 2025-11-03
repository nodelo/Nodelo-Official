# Nodelo Backend Implementation Plan

## 📋 Overview

This is a **minimal backend** plan for Nodelo's website. The backend will handle contact form submissions and provide a foundation for future admin functionality.

## 🎯 Current Requirements

Based on the frontend analysis:
- **Contact Form**: Collects name, email, company (optional), projectType (optional), budget (optional), message
- **Admin Panel**: Not implemented yet, but needed for managing submissions

## 🏗️ Architecture Plan

### Phase 1: Core Functionality (Current Focus)
**Goal**: Store and retrieve contact form submissions

1. **Contact Form API**
   - `POST /api/contacts` - Store contact form submission
   - Validate and save to MongoDB
   - Return success/error response

2. **Database Schema**
   - Contact model: name, email, company, projectType, budget, message, createdAt, status (new/replied/archived)

### Phase 2: Admin Foundation (Next)
**Goal**: Prepare for admin panel (when you build the interface)

3. **Admin Authentication** (Foundation only)
   - User model: email, password (hashed), role
   - JWT-based auth middleware
   - `POST /api/auth/login` - Admin login
   - `GET /api/auth/me` - Get current admin user

4. **Admin Contact Management**
   - `GET /api/contacts` - List all submissions (protected)
   - `GET /api/contacts/:id` - Get single submission (protected)
   - `PATCH /api/contacts/:id` - Update status (protected)
   - `DELETE /api/contacts/:id` - Delete submission (protected)

### Phase 3: Future Enhancements (Optional)
- Email notifications on new submissions
- Analytics/statistics endpoints
- Project management (if needed)
- Testimonials management (currently static in frontend)

## 📁 Proposed File Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection (✅ done)
├── models/
│   ├── Contact.js           # Contact form submission model
│   └── User.js              # Admin user model (Phase 2)
├── routes/
│   ├── contacts.js          # Contact form routes
│   └── auth.js              # Authentication routes (Phase 2)
├── middleware/
│   ├── auth.js              # JWT authentication middleware (Phase 2)
│   └── errorHandler.js     # Centralized error handling
├── controllers/
│   ├── contactController.js # Contact form logic
│   └── authController.js    # Auth logic (Phase 2)
├── utils/
│   └── validators.js        # Input validation helpers
└── server.js                # Main server file (✅ done)
```

## 🔧 Implementation Steps

### Step 1: Contact Form Model & API (Immediate)
- [x] MongoDB connection setup
- [ ] Create Contact model
- [ ] Create POST /api/contacts endpoint
- [ ] Add validation
- [ ] Test with frontend

### Step 2: Update Frontend to Use Backend
- [ ] Update frontend ContactForm to call backend API instead of Next.js route
- [ ] Handle CORS (already configured)

### Step 3: Admin Authentication (When Admin UI is Ready)
- [ ] Create User model
- [ ] Install JWT dependencies (jsonwebtoken, bcrypt)
- [ ] Create auth routes (login, me)
- [ ] Create auth middleware
- [ ] Create seed script for initial admin user

### Step 4: Admin Contact Management (When Admin UI is Ready)
- [ ] Protected GET /api/contacts (list all)
- [ ] Protected GET /api/contacts/:id (single)
- [ ] Protected PATCH /api/contacts/:id (update status)
- [ ] Protected DELETE /api/contacts/:id

## 📦 Dependencies Needed

### Already Installed:
- ✅ express
- ✅ mongoose
- ✅ dotenv
- ✅ cors
- ✅ morgan

### Phase 1 (Current):
- ✅ All dependencies ready!

### Phase 2 (Admin):
- `jsonwebtoken` - JWT token generation
- `bcrypt` - Password hashing
- `express-validator` (optional) - Enhanced validation

## 🔐 Security Considerations

1. **Input Validation**: Validate all inputs server-side
2. **Rate Limiting**: Add rate limiting for contact form (prevent spam)
3. **CORS**: Already configured for frontend origin
4. **Password Security**: Use bcrypt for password hashing (Phase 2)
5. **JWT Security**: Secure token storage and expiration (Phase 2)

## 🚀 API Endpoints Summary

### Phase 1 - Public APIs:
```
POST   /api/contacts          Create contact submission
GET    /api/health            Health check (✅ exists)
GET    /                      Welcome message (✅ exists)
```

### Phase 2 - Admin APIs (Protected):
```
POST   /api/auth/login        Admin login
GET    /api/auth/me           Get current admin
GET    /api/contacts          List all submissions
GET    /api/contacts/:id      Get single submission
PATCH  /api/contacts/:id      Update submission
DELETE /api/contacts/:id      Delete submission
```

## 📝 Notes

- Keep it minimal: Only build what's needed now
- Admin foundation: Set up auth structure but don't over-engineer
- Easy to extend: Structure allows adding features later
- No email sending initially: Can add later if needed
- Frontend currently uses Next.js API route - will migrate to Express backend

