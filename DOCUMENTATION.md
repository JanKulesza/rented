# Rentify - Property Rental Platform Documentation

**Project Status:** In Development  
**Last Updated:** June 2026

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start Guide](#quick-start-guide)
3. [Project Structure](#project-structure)
4. [Architecture Overview](#architecture-overview)
5. [Frontend Development](#frontend-development)
6. [Backend Development](#backend-development)
7. [Database Schema](#database-schema)
8. [API Reference](#api-reference)
9. [Authentication & Authorization](#authentication--authorization)
10. [Common Workflows](#common-workflows)
11. [Development Guidelines](#development-guidelines)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is Rentify?

Rentify is a full-stack web application for **long-term property rentals**. It's similar to Airbnb but specifically designed for residential rentals rather than short-term stays.

**Key Features:**
- User authentication (email/password + Google OAuth)
- Property listing management
- Real estate agency management
- Agent-based property management
- Geolocation support
- Image hosting via Cloudinary
- Role-based access control
- Analytics dashboard

### User Roles

1. **User (Tenant)**
   - Browse properties
   - View property details
   - Search by location/amenities
   - Join agencies

2. **Agent**
   - Create and manage properties
   - Upload property images
   - Assign properties to listing types (Sale, Rent, Pending)
   - Manage multiple properties
   - View analytics

3. **Owner (Agency Owner)**
   - Manage entire agency
   - Add/remove agents
   - View all agency properties
   - Generate invitation tokens for agents
   - Update agency details

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JWT, bcrypt, Google OAuth2 |
| **File Storage** | Cloudinary |
| **Validation** | Zod schemas |
| **Maps** | Leaflet, React-Leaflet |
| **Charts** | Recharts |

---

## Quick Start Guide

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or cloud)
- Cloudinary account
- Google OAuth credentials (optional)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install
# or
yarn install

# Create .env file from template
cp .env.template .env

# Fill in environment variables:
# - MONGODB_URI: Your MongoDB connection string
# - ACCESS_SECRET: Random string for JWT signing (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - REFRESH_SECRET: Another random string
# - CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET: From Cloudinary dashboard
# - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET: From Google Cloud Console

# Run in development
npm run dev

# Server runs on http://localhost:8080
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
EOF

# Run in development
npm run dev

# App runs on http://localhost:3000
```

### Running Both Servers

Terminal 1:
```bash
cd backend && npm run dev
```

Terminal 2:
```bash
cd frontend && npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Project Structure

```
rented/
├── backend/                    # Express API server
│   ├── controllers/            # Business logic
│   │   ├── auth.ts            # Authentication handlers
│   │   ├── user.ts            # User CRUD operations
│   │   ├── property.ts        # Property CRUD operations
│   │   ├── agency.ts          # Agency CRUD operations
│   │   └── geocode.ts         # Geolocation features
│   │
│   ├── models/                # Mongoose schemas
│   │   ├── user.ts
│   │   ├── property.ts
│   │   └── agency.ts
│   │
│   ├── routes/                # Express route definitions
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── property.ts
│   │   ├── agency.ts
│   │   └── index.ts          # Route setup
│   │
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.ts           # JWT verification
│   │   ├── role.ts           # Role-based access
│   │   └── error.ts          # Error handling
│   │
│   ├── utils/                # Utility functions
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── db.ts             # MongoDB connection
│   │   ├── config.ts         # Environment config
│   │   ├── cloudinary.ts     # Image upload/delete
│   │   └── multer.ts         # File upload middleware
│   │
│   ├── types/                # TypeScript type definitions
│   └── index.ts              # Server entry point
│
├── frontend/                  # Next.js React app
│   ├── app/                  # App Router pages
│   │   ├── layout.tsx        # Root layout (providers)
│   │   ├── page.tsx          # Home page
│   │   ├── signin/           # Sign in page
│   │   ├── signup/           # Sign up page
│   │   ├── app/[agencyId]/   # Agency dashboard
│   │   ├── join-agency/      # Join agency page
│   │   └── start-renting/    # Agent registration
│   │
│   ├── components/
│   │   ├── app/              # Feature components
│   │   │   ├── agents/       # Agent features
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── details/      # Property details
│   │   │   └── listings/     # Property listings
│   │   │
│   │   ├── auth/             # Authentication components
│   │   │   ├── signin.tsx
│   │   │   ├── signup.tsx
│   │   │   ├── create-agency.tsx
│   │   │   └── google-oauth-btn.tsx
│   │   │
│   │   ├── elements/         # Reusable UI elements
│   │   │   ├── back-btn.tsx
│   │   │   ├── property-carousel.tsx
│   │   │   ├── tile.tsx
│   │   │   ├── charts/       # Chart components
│   │   │   └── map/          # Map components
│   │   │
│   │   ├── inputs/           # Form input components
│   │   │   ├── form-input.tsx
│   │   │   ├── form-textarea.tsx
│   │   │   └── search-select.tsx
│   │   │
│   │   ├── layout/           # Layout components
│   │   │   ├── navbar.tsx
│   │   │   └── sidebar.tsx
│   │   │
│   │   ├── providers/        # React Context providers
│   │   │   ├── auth-provider.tsx
│   │   │   └── agency-provider.tsx
│   │   │
│   │   └── ui/               # shadcn/ui components
│   │
│   ├── entities/             # Enums and constants
│   │   ├── amenities.ts
│   │   ├── listing-types.ts
│   │   └── living-area.ts
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── use-mobile.ts
│   │
│   ├── lib/                  # Utility functions
│   │   └── utils.ts
│   │
│   └── schemas/              # Zod validation schemas
│
└── DOCUMENTATION.md          # This file
```

---

## Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS FRONTEND (Port 3000)             │
├─────────────────────────────────────────────────────────────┤
│  Pages (signin, signup, app) → Components → Context Providers│
│  AuthProvider | AgencyProvider                               │
│  React Hook Form + Zod Validation                            │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API
                     │ (JWT tokens in headers)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS.JS BACKEND (Port 8080)                  │
├─────────────────────────────────────────────────────────────┤
│  Routes → Middlewares (Auth, Role, Error) → Controllers      │
│  Zod Validation → Business Logic → Database Queries          │
└────────────────────┬────────────────────────────────────────┘
                     │ Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                          │
├─────────────────────────────────────────────────────────────┤
│  Collections: users, agencies, properties                    │
│  With relationships and validation                           │
└─────────────────────────────────────────────────────────────┘
```

### Request/Response Flow

1. **User Action** → Frontend component
2. **Frontend** → Validates with Zod schema
3. **Frontend** → Makes API call via `fetchWithAuth()` (adds JWT)
4. **Backend** → Auth middleware verifies JWT
5. **Backend** → Role middleware checks permissions
6. **Backend** → Controller validates again with Zod
7. **Backend** → Business logic executes
8. **Backend** → Database operation via Mongoose
9. **Backend** → Returns JSON response
10. **Frontend** → Updates state and UI

---

## Frontend Development

### Key Concepts

#### 1. Next.js App Router

The project uses **Next.js App Router** (not Pages Router). This means:
- Routes are file-based in the `app/` directory
- `layout.tsx` wraps all child routes
- Dynamic routes use `[param]` syntax
- `(grouping)` folders don't create URL segments

**Example Route Structure:**
```
app/
├── layout.tsx               → / (Root layout wraps all pages)
├── page.tsx                 → / (Home page)
├── signin/page.tsx          → /signin
├── app/
│   └── [agencyId]/
│       └── page.tsx         → /app/[agencyId]
```

#### 2. React Context Providers

Two context providers manage application state:

**AuthProvider** (`components/providers/auth-provider.tsx`)
```typescript
interface AuthContext {
  user: User | null;                    // Current logged-in user
  accessToken: string | null;           // JWT token
  fetchWithAuth: <T>(...) => Promise;  // Authenticated HTTP calls
  signin: (values) => Promise<Response>;
  signout: () => Promise<void>;
  setAuth: (token: string) => void;
}
```

**AgencyProvider** (`components/providers/agency-provider.tsx`)
```typescript
interface AgencyContext {
  agency: Agency;
  setAgency: (agency: Agency) => void;
}
```

#### 3. Component Pattern

All interactive components use `"use client"` directive:

```typescript
"use client";
import { useContext } from "react";
import { authContext } from "@/components/providers/auth-provider";

export default function MyComponent() {
  const { user, fetchWithAuth } = useContext(authContext);
  
  // Component logic
  return <div>...</div>;
}
```

#### 4. Form Handling

Forms use **React Hook Form** + **Zod** validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "./signin-schema";

function SignInForm() {
  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" }
  });
  
  const onSubmit = async (values) => {
    // Handle form submission
  };
  
  return <Form {...form}>{/* Form inputs */}</Form>;
}
```

### Common Frontend Patterns

#### Pattern 1: Access Current User

```typescript
"use client";
import { useContext } from "react";
import { authContext } from "@/components/providers/auth-provider";

export default function Profile() {
  const { user } = useContext(authContext);
  
  if (!user) return <p>Please sign in</p>;
  return <h1>Welcome, {user.firstName}!</h1>;
}
```

#### Pattern 2: Make Authenticated API Calls

```typescript
"use client";
import { useContext, useEffect, useState } from "react";
import { authContext } from "@/components/providers/auth-provider";

export default function PropertyList() {
  const { fetchWithAuth } = useContext(authContext);
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    (async () => {
      const { res, data } = await fetchWithAuth(
        "http://localhost:8080/api/properties"
      );
      if (res.ok) setProperties(data);
    })();
  }, []);
  
  return <ul>{properties.map(p => <li key={p._id}>{p.name}</li>)}</ul>;
}
```

#### Pattern 3: Protect Routes

```typescript
"use client";
import { useContext } from "react";
import { redirect } from "next/navigation";
import { authContext } from "@/components/providers/auth-provider";

export default function ProtectedPage() {
  const { user } = useContext(authContext);
  
  if (!user) {
    redirect("/signin?redirectUrl=/dashboard");
  }
  
  return <div>Protected content</div>;
}
```

### Styling

- **Tailwind CSS** for styling
- **shadcn/ui** for pre-built components (Button, Card, Dialog, etc.)
- **Dark mode** support via `ThemeProvider`

Example component:
```typescript
export default function Card() {
  return (
    <div className="p-4 rounded-lg bg-card border border-card-border">
      <h2 className="text-lg font-bold text-primary">Title</h2>
      <p className="text-secondary-foreground">Description</p>
    </div>
  );
}
```

---

## Backend Development

### Express Server Structure

**Entry Point:** `backend/index.ts`

```typescript
import express from "express";
import setupRoutes from "./routes/index.ts";

const app = express();

// Middlewares run in order
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(upload.single("image")); // File upload

// Routes
setupRoutes(app);

// Error handler (LAST)
app.use(handleError);

app.listen(8080, () => {
  connectDB(process.env.MONGODB_URI);
});
```

### Middleware Pipeline

Every request goes through this pipeline:

```
Request
  ↓
Express.json (parse JSON)
  ↓
CORS (check origin)
  ↓
Multer (extract files)
  ↓
Route Matching
  ↓
Auth Middleware (optional - verify JWT)
  ↓
Role Middleware (optional - check permissions)
  ↓
Controller Handler
  ↓
Response | Error
```

### Key Middlewares

#### Auth Middleware (`middlewares/auth.ts`)

**Purpose:** Verify JWT token and attach user to request

```typescript
export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) return res.status(401).json({ error: "No token" });
  
  try {
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = payload; // { _id, email, role }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

**Usage:**
```typescript
router.get("/me", auth, getMe);  // Only authenticated users
```

#### Role Middleware (`middlewares/role.ts`)

**Purpose:** Check user role for authorization

```typescript
export const agent = (req, res, next) => {
  if (![UserRoles.AGENT, UserRoles.OWNER].includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
```

**Usage:**
```typescript
router.post("/", auth, agent, createProperty);  // Only agents
```

#### Error Middleware (`middlewares/error.ts`)

**Purpose:** Catch all errors and send consistent responses

```typescript
export const handleError = (err, req, res, next) => {
  res.status(500).json({ error: "An unexpected error occurred" });
  
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }
};
```

### Controller Pattern

Controllers handle business logic. Pattern:

1. Validate input with Zod
2. Check business rules
3. Perform database operations
4. Handle errors
5. Return response

Example:

```typescript
export const createProperty = async (req, res, next) => {
  // 1. Validate
  const { success, data, error } = await propertySchema
    .safeParseAsync(req.body);
  if (!success) return res.status(400).json(error);
  
  // 2. Check rules
  const agency = await Agency.findById(data.agency);
  if (!agency) return res.status(404).json({ error: "Agency not found" });
  
  // 3. Upload file
  const { id, url } = await uploadImage(req.file.path);
  
  // 4. Create database transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const property = new Property({ ...data, image: { id, url } });
    const saved = await property.save({ session });
    
    // Update related documents
    await agency.updateOne(
      { $push: { properties: saved._id } },
      { session }
    );
    
    await session.commitTransaction();
    res.status(201).json(saved);
  } catch (error) {
    await session.abortTransaction();
    await deleteImage(id); // Cleanup
    next(error);
  } finally {
    await session.endSession();
  }
};
```

### Authentication Flow

#### Sign Up

1. User submits email, password, name, phone, address
2. Backend validates with Zod schema
3. Check if email already exists
4. Hash password with bcrypt (10 rounds)
5. Create User document in MongoDB
6. Return user object (without password)

#### Sign In

1. User submits email and password
2. Find user by email
3. Compare submitted password with hashed password using bcrypt
4. Generate two JWT tokens:
   - **accessToken** (15 min expiry) - sent in response body
   - **refreshToken** (30 days expiry) - set as HTTP-only cookie
5. Return accessToken to frontend

#### Protected Requests

1. Frontend sends request with header: `Authorization: Bearer {accessToken}`
2. Backend auth middleware extracts and verifies token
3. If valid, attaches `req.user` and calls `next()`
4. If expired, frontend gets 401 and calls `/api/auth/refresh`
5. Backend generates new accessToken using refreshToken cookie
6. Frontend retries original request with new token

---

## Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  firstName: String,                    // Required
  lastName: String,                     // Required
  email: String,                        // Required, unique
  phone: String,                        // Required
  password: String,                     // Hashed with bcrypt
  oauthProvider: String,                // "google" or null
  oauthId: String,                      // For OAuth2
  image: {
    id: String,                        // Cloudinary ID
    url: String                        // Cloudinary URL
  },
  address: {
    city: String,
    state: String,
    country: String,
    zip: String
  },
  sold: Number,                         // Count of sold properties
  role: Enum[OWNER, AGENT, USER],      // User role
  agency: ObjectId,                     // Reference to Agency
  properties: [ObjectId],               // Array of Property references
  createdAt: Date,
  updatedAt: Date
}

// Methods:
- comparePasswords(password) → boolean
- generateAccessToken() → JWT string
- generateRefreshToken() → Serialized cookie
- toJSON() → Excludes password
```

**Relationships:**
- User `has` 0 or 1 Agency (agents/owners)
- User `manages` 0 or many Properties

### Property Model

```javascript
{
  _id: ObjectId,
  image: {
    id: String,                       // Cloudinary ID
    url: String
  },
  name: String,                        // 4-32 chars
  description: String,                 // 5-500 chars
  price: Number,                       // Monthly rent price
  buyerPrice: Number,                  // price * 1.1 (auto-calculated)
  listingType: Enum[SALE, RENT, PENDING],
  isSold: Boolean,
  rating: Number,                      // 0-100
  squareFootage: Number,
  address: {
    city: String,
    state: String,
    country: String,
    zip: String,
    address: String,
    lat: Number,                      // Latitude: -90 to 90
    lon: Number,                      // Longitude: -180 to 180
    suite: String                     // Apartment number, etc
  },
  livingArea: {
    beds: Number,
    bedrooms: Number,
    kitchens: Number,
    bathrooms: Number
  },
  amenities: [String],                 // Pool, WiFi, etc
  agency: ObjectId,                    // Reference to Agency (required)
  agent: ObjectId,                     // Reference to User/Agent
  propertyType: Enum[APARTMENT, STUDIO, HOUSE, VILLA, ...],
  createdAt: Date,
  updatedAt: Date
}

// Pre-save hooks:
- Calculate buyerPrice on save
- Delete image from Cloudinary on delete
```

**Relationships:**
- Property `belongs to` 1 Agency
- Property `managed by` 0 or 1 User (Agent)

### Agency Model

```javascript
{
  _id: ObjectId,
  name: String,                        // 4-32 chars, unique
  image: {
    id: String,
    url: String
  },
  owner: ObjectId,                     // Reference to User (required)
  address: {
    city: String,
    state: String,
    country: String,
    zip: String,
    address: String,
    lat: Number,
    lon: Number,
    suite: String
  },
  agents: [ObjectId],                  // Array of User references
  properties: [ObjectId],              // Array of Property references
  createdAt: Date,
  updatedAt: Date
}

// Pre-delete hooks:
- Delete image from Cloudinary on delete
```

**Relationships:**
- Agency `owned by` 1 User (Owner)
- Agency `has` 0 or many Users (Agents)
- Agency `has` 0 or many Properties

### Database Relationships Diagram

```
User (Owner)
  ↓ (1:1)
Agency
  ↑ (1:many)
User (Agents) ← → (manages) → Properties ← (1:many) → Agency
```

---

## API Reference

### Authentication Endpoints

#### POST `/api/auth/signin`

Sign in with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Sets Cookie:**
```
refreshToken={token}; httpOnly; secure; path=/; sameSite=none
```

**Errors:**
- `400` - Invalid request format
- `401` - Invalid credentials

---

#### POST `/api/auth/signup`

Create a new user account.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "address": {
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zip": "10001"
  }
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "user",
  "agency": null,
  "properties": [],
  "createdAt": "2026-06-13T10:00:00Z"
}
```

---

#### GET `/api/auth/me`

Get current authenticated user.

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "email": "john@example.com",
  "role": "agent",
  "agency": "507f1f77bcf86cd799439012",
  "properties": ["507f1f77bcf86cd799439013"],
  "createdAt": "2026-06-13T10:00:00Z"
}
```

---

#### GET `/api/auth/refresh`

Get a new access token using refresh token.

**Cookies Required:**
```
refreshToken={token}
```

**Response (200):**
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### POST `/api/auth/signout`

Sign out and clear refresh token.

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{}
```

---

### Property Endpoints

#### GET `/api/properties`

List all properties (public).

**Query Parameters:**
- `skip` (optional) - Number of properties to skip
- `limit` (optional) - Max properties to return

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Modern Apartment",
    "price": 2500,
    "address": { "city": "NYC", ... },
    "amenities": ["WiFi", "Pool"],
    "propertyType": "Apartment",
    "createdAt": "2026-06-13T10:00:00Z"
  }
]
```

---

#### GET `/api/properties/:id`

Get single property details.

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Modern Apartment",
  "description": "Beautiful 2-bedroom apartment...",
  "price": 2500,
  "agency": { "_id": "...", "name": "Royal Estates", ... },
  "agent": { "_id": "...", "firstName": "John", ... },
  "address": { "city": "NYC", "lat": 40.7128, "lon": -74.0060 },
  "livingArea": { "beds": 2, "bedrooms": 2, "bathrooms": 1 },
  "amenities": ["WiFi", "Pool", "Parking"]
}
```

---

#### POST `/api/properties`

Create a new property (requires agent role).

**Headers Required:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request:**
```
{
  "name": "Modern Apartment",
  "description": "Beautiful 2-bedroom apartment",
  "price": 2500,
  "agency": "507f1f77bcf86cd799439012",
  "agent": "507f1f77bcf86cd799439011",
  "listingType": "RENT",
  "propertyType": "Apartment",
  "address": {
    "city": "NYC",
    "state": "NY",
    "country": "USA",
    "zip": "10001",
    "address": "123 Main St",
    "lat": 40.7128,
    "lon": -74.0060
  },
  "livingArea": {
    "beds": 2,
    "bedrooms": 2,
    "kitchens": 1,
    "bathrooms": 1
  },
  "amenities": ["WiFi", "Pool"],
  "image": {file}
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Modern Apartment",
  "image": {
    "id": "property_abc123",
    "url": "https://res.cloudinary.com/..."
  },
  "price": 2500,
  "buyerPrice": 2750
}
```

**Errors:**
- `400` - Invalid data or agent not in agency
- `401` - Not authenticated
- `403` - Not an agent

---

#### PUT `/api/properties/:id`

Update property (requires agent role).

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Luxury Apartment",
  "price": 3000,
  "amenities": ["WiFi", "Pool", "Gym"]
}
```

**Response (200):**
```json
{ "message": "Property updated successfully" }
```

---

#### DELETE `/api/properties/:id`

Delete property (requires agent role).

**Response (200):**
```json
{ "message": "Property deleted successfully" }
```

---

### Agency Endpoints

#### GET `/api/agencies`

List all agencies.

**Query Parameters:**
- `populate` (optional) - Comma-separated fields to populate: `owner,agents,properties`

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Royal Estates",
    "owner": "507f1f77bcf86cd799439011",
    "agents": [],
    "properties": []
  }
]
```

---

#### GET `/api/agencies/:id`

Get agency details.

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Royal Estates",
  "owner": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com"
  },
  "agents": [ { "_id": "...", "firstName": "Jane", ... } ],
  "properties": [ { "_id": "...", "name": "Modern Apartment", ... } ],
  "address": { "city": "NYC", ... }
}
```

---

#### POST `/api/agencies`

Create new agency (creates owner account too).

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": { ... },
  "agency": {
    "name": "Royal Estates",
    "address": { ... }
  }
}
```

**Response (201):**
```json
{
  "user": { "_id": "...", "firstName": "John", ... },
  "agency": { "_id": "...", "name": "Royal Estates", ... },
  "tokens": { "accessToken": "...", "refreshToken": "..." }
}
```

---

#### POST `/api/agencies/join`

Join an existing agency (requires valid invitation token).

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{ "message": "Successfully joined agency" }
```

---

#### PUT `/api/agencies/:id`

Update agency (requires owner role).

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Premium Estates",
  "address": { ... }
}
```

**Response (200):**
```json
{ "message": "Agency updated successfully" }
```

---

#### DELETE `/api/agencies/:id`

Delete agency (requires owner role).

**Response (200):**
```json
{ "message": "Agency deleted successfully" }
```

---

#### GET `/api/agencies/:id/invitation-token`

Generate invitation token for agents (requires agent role).

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2026-06-13T12:00:00Z"
}
```

---

### User Endpoints

#### GET `/api/users`

List all users (requires authentication).

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com",
    "role": "agent"
  }
]
```

---

#### GET `/api/users/:id`

Get user profile (public).

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "sold": 5,
  "role": "agent",
  "agency": "507f1f77bcf86cd799439012",
  "properties": ["507f1f77bcf86cd799439013", ...],
  "createdAt": "2026-06-13T10:00:00Z"
}
```

---

#### PUT `/api/users/:id`

Update user profile (requires authentication).

**Headers Required:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "firstName": "Jonathan",
  "phone": "9876543210",
  "address": { ... }
}
```

**Response (200):**
```json
{ "message": "User updated successfully" }
```

---

#### DELETE `/api/users/:id`

Delete user account (requires authentication).

**Response (200):**
```json
{ "message": "User deleted successfully" }
```

---

## Authentication & Authorization

### JWT Tokens

**Access Token:**
- **Expiry:** 15 minutes
- **Storage:** Memory (state) on frontend
- **Usage:** `Authorization: Bearer {token}` header
- **Purpose:** Authenticate API requests

**Refresh Token:**
- **Expiry:** 30 days
- **Storage:** HTTP-only cookie
- **Usage:** Automatic in browser requests
- **Purpose:** Get new access token when expired

### Token Generation

Backend generates tokens on sign in:

```typescript
// Access token (short-lived)
const accessToken = jwt.sign(
  { _id, email, role },
  process.env.ACCESS_SECRET,
  { expiresIn: "15m" }
);

// Refresh token (long-lived)
const refreshToken = jwt.sign(
  { _id, email, role },
  process.env.REFRESH_SECRET,
  { expiresIn: "30d" }
);

// Serialize as HTTP-only cookie
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000
});
```

### Token Refresh Flow

```
1. Frontend makes request with expired accessToken
2. Backend returns 401
3. Frontend calls GET /api/auth/refresh
4. Backend verifies refreshToken cookie
5. Backend generates new accessToken
6. Frontend updates token in state
7. Frontend retries original request
```

Frontend handles this automatically in `AuthProvider.fetchWithAuth()`.

### Role-Based Access Control

**Roles:**
- `USER` - Regular user, can view properties
- `AGENT` - Can manage properties, requires agency
- `OWNER` - Can manage agencies and agents

**Permission Matrix:**

| Action | USER | AGENT | OWNER |
|--------|------|-------|-------|
| View properties | ✅ | ✅ | ✅ |
| Create property | ❌ | ✅ | ✅ |
| Update property | ❌ | ✅ | ✅ |
| Delete property | ❌ | ✅ | ✅ |
| View users | ✅ | ✅ | ✅ |
| Create agency | ❌ | ❌ | ✅ |
| Update agency | ❌ | ❌ | ✅ |
| Delete agency | ❌ | ❌ | ✅ |

---

## Common Workflows

### Workflow 1: User Sign Up and Browse Properties

**Frontend Steps:**
1. User visits `/signup`
2. Fills form (name, email, password, address)
3. Form validates with Zod schema
4. On submit, calls `POST /api/auth/signup`
5. Backend creates user with role `USER`
6. Frontend stores accessToken
7. User redirected to home page
8. Navbar shows user name

**Backend Steps:**
1. Validate input with `userSchema`
2. Check if email exists
3. Hash password with bcrypt
4. Create User document
5. Return user object

**Frontend then:**
6. User clicks search properties
7. Component calls `GET /api/properties`
8. Uses `fetchWithAuth()` to include JWT
9. Properties displayed in list

---

### Workflow 2: Agent Creates Property

**Prerequisites:**
- User must be an AGENT
- Must belong to an AGENCY
- Have valid JWT token

**Frontend Steps:**
1. Agent visits `/start-renting` (or agency dashboard)
2. Clicks "Create Property"
3. Fills form with property details and image
4. Form validates with Zod schema
5. Creates FormData (for file upload)
6. Calls `POST /api/properties` via `fetchWithAuth()`
7. Shows success toast
8. Navigates to property details page

**Backend Steps:**
1. `upload.single("image")` middleware extracts file
2. `auth` middleware verifies JWT
3. `agent` middleware checks user is AGENT/OWNER
4. `createProperty` controller:
   - Validates data with `propertySchema`
   - Checks agency exists
   - Checks agent belongs to agency
   - Uploads image to Cloudinary
   - Creates Property document
   - Updates Agency.properties array
   - Uses transaction for consistency
5. Returns 201 + property data

---

### Workflow 3: Agent Joins Agency

**Prerequisites:**
- Agency owner generates invitation token
- Valid token not expired
- User must be logged in

**Frontend Steps:**
1. Agent visits `/join-agency`
2. Enters invitation token
3. Clicks "Join"
4. Calls `POST /api/agencies/join` with token
5. Shows confirmation
6. Navigates to agency dashboard

**Backend Steps:**
1. Verify JWT in Authorization header
2. Extract and verify token
3. Add user to Agency.agents array
4. Update user.agency field
5. Return success response

---

### Workflow 4: Property Management

**List Properties:**
```
GET /api/properties
→ Returns all properties with basic info
```

**View Property Details:**
```
GET /api/properties/:id
→ Returns full property data with populated agency/agent
```

**Update Property:**
```
PUT /api/properties/:id (with auth + agent role)
→ Validates and updates property
→ Cannot change agency
```

**Delete Property:**
```
DELETE /api/properties/:id (with auth + agent role)
→ Deletes image from Cloudinary
→ Removes from Agency.properties
→ Deletes from database
```

---

## Development Guidelines

### Frontend Development

#### Component Organization

1. **Page Components** (`app/*/page.tsx`)
   - Use server components when possible
   - Fetch data on server
   - Pass data to client components

2. **Container Components** (`components/app/*`)
   - Manage state and logic
   - Use `"use client"` directive
   - Handle user interactions

3. **Presentational Components** (`components/elements/*`, `components/inputs/*`)
   - Pure components
   - No state management
   - Props-based
   - Reusable across app

#### Writing Components

```typescript
"use client"; // If using hooks/context

import { useContext } from "react";
import { authContext } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

/**
 * MyComponent - Brief description
 * 
 * @example
 * <MyComponent title="Hello" onAction={() => {}} />
 */
export default function MyComponent({ 
  title, 
  onAction 
}: { 
  title: string;
  onAction: () => void;
}) {
  const { user } = useContext(authContext);
  
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">{title}</h1>
      <Button onClick={onAction}>Action</Button>
    </div>
  );
}
```

#### Naming Conventions

- **Components:** PascalCase (`UserProfile.tsx`)
- **Utility functions:** camelCase (`formatDate.ts`)
- **CSS classes:** kebab-case with Tailwind (`flex`, `gap-4`)
- **Variables:** camelCase (`const userName = ""`)
- **Constants:** UPPER_SNAKE_CASE (`const MAX_USERS = 100`)

#### Form Handling

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur" // Validate on blur
  });
  
  const onSubmit = async (data) => {
    // Handle submission
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Backend Development

#### Creating New Endpoints

1. **Create Schema** (`utils/schemas/model.ts`)
```typescript
import { z } from "zod";

export const modelSchema = z.object({
  name: z.string().min(4).max(32),
  email: z.string().email(),
  // ... other fields
});

export type ModelSchemaType = z.infer<typeof modelSchema>;
```

2. **Create Route** (`routes/model.ts`)
```typescript
import { Router } from "express";
import { 
  getModel, 
  createModel, 
  updateModel, 
  deleteModel 
} from "../controllers/model.ts";
import { auth } from "../middlewares/auth.ts";
import { agent } from "../middlewares/role.ts";

const router = Router();

router.get("/", getModel);
router.post("/", auth, agent, createModel);
router.put("/:id", auth, agent, updateModel);
router.delete("/:id", auth, agent, deleteModel);

export { router as modelRouter };
```

3. **Add Route to Index** (`routes/index.ts`)
```typescript
import { modelRouter } from "./model.ts";

const setupRoutes = (app) => {
  // ... existing routes
  app.use("/api/models", modelRouter);
};
```

4. **Create Controller** (`controllers/model.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import Model from "../models/model.ts";

export const getModel = async (req: Request, res: Response) => {
  try {
    const models = await Model.find();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
};

export const createModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success, data, error } = await modelSchema
    .safeParseAsync(req.body);
  
  if (!success) {
    return res.status(400).json(error);
  }
  
  try {
    const model = new Model(data);
    const saved = await model.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};
```

#### Error Handling Best Practices

```typescript
// ❌ Avoid
export const createItem = async (req, res) => {
  const item = new Item(req.body);
  await item.save(); // No error handling!
  res.json(item);
};

// ✅ Better
export const createItem = async (req, res, next) => {
  // 1. Validate
  const { success, data, error } = await schema.safeParseAsync(req.body);
  if (!success) {
    return res.status(400).json(error);
  }
  
  // 2. Check business rules
  const existing = await Item.findOne({ unique_field: data.unique_field });
  if (existing) {
    return res.status(400).json({ error: "Already exists" });
  }
  
  // 3. Try database operation
  try {
    const item = new Item(data);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    // Let error middleware handle
    next(err);
  }
};
```

#### Using Transactions

For operations affecting multiple documents:

```typescript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All operations must use { session }
  const doc1 = await Model1.findByIdAndUpdate(id, data, { session });
  const doc2 = await Model2.findByIdAndUpdate(id, data, { session });
  
  await session.commitTransaction();
  res.json({ success: true });
} catch (error) {
  await session.abortTransaction();
  next(error);
} finally {
  await session.endSession();
}
```

### Environment Variables

**Backend** (`.env`):
```
PORT=8080
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rented

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ACCESS_SECRET=your_random_secret_here
REFRESH_SECRET=your_random_secret_here

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Sentry
SENTRY_DSN=your_sentry_dsn
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

---

## Troubleshooting

### Common Issues

#### "CORS Error: Access-Control-Allow-Origin"

**Problem:** Frontend request blocked by CORS policy

**Solution:**
1. Check CORS config in `backend/index.ts`
2. Ensure frontend origin is in whitelist:
   ```typescript
   app.use(cors({
     origin: "http://localhost:3000", // Match your frontend URL
     credentials: true
   }));
   ```
3. Frontend must use `credentials: "include"` in requests

---

#### "401 Unauthorized - No access token"

**Problem:** Request sent without JWT token

**Solution:**
1. Check if user is logged in: `if (!user) redirect("/signin")`
2. Ensure token is stored in `AuthProvider`
3. Use `fetchWithAuth()` instead of regular `fetch()`

---

#### "Password Hashing Failed"

**Problem:** Error during bcrypt hashing

**Solution:**
1. Check `bcrypt` is installed: `npm list bcrypt`
2. Verify password exists before saving
3. Check Node.js version (bcrypt needs 12+)

---

#### "MongoDB Connection Timeout"

**Problem:** Can't connect to MongoDB

**Solution:**
1. Check MongoDB URI in `.env`
2. Verify MongoDB service is running
3. Check firewall/network access
4. For MongoDB Atlas: whitelist IP in connection settings
5. Test with MongoDB Compass

---

#### "Image Upload to Cloudinary Fails"

**Problem:** Image not uploading

**Solution:**
1. Check Cloudinary credentials in `.env`
2. Verify `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`
3. Check file size limits
4. Ensure file upload middleware is in place
5. Check folder permissions in Cloudinary

---

#### "Cannot find module '@/components/...'"

**Problem:** TypeScript path alias not working

**Solution:**
1. Check `tsconfig.json` has path mapping:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```
2. Restart dev server
3. Rebuild TypeScript cache

---

#### "useContext Hook Error in Server Component"

**Problem:** `"use client"` directive missing

**Solution:**
```typescript
"use client"; // Add this at top of file

import { useContext } from "react";
import { authContext } from "@/components/providers/auth-provider";

export default function MyComponent() {
  const { user } = useContext(authContext);
  // ...
}
```

---

### Debugging Tips

#### Enable Debug Logging

**Backend:**
```typescript
// In controllers
console.log("Received data:", req.body);
console.log("User:", req.user);
console.log("Query result:", result);

// Or use DEBUG env var
DEBUG=* npm run dev
```

**Frontend:**
```typescript
// In components
console.log("User:", user);
console.log("Response:", data);
console.log("Error:", error);

// Check browser console (F12)
// Check Network tab for API responses
```

#### Using VS Code Debugger

**Backend** (`launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

---

## Tips for Junior Developers

1. **Start Small**: Begin with understanding one feature completely before moving to another
2. **Read Existing Code**: Look at similar features for patterns
3. **Use TypeScript**: Leverage type checking to catch errors early
4. **Validate Everything**: Always validate user input on both frontend and backend
5. **Test Manually**: Use Postman/Thunder Client to test API endpoints
6. **Read Error Messages**: Error messages usually tell you exactly what's wrong
7. **Ask Questions**: Don't hesitate to ask senior devs or check documentation
8. **Commit Often**: Make small, focused git commits with clear messages
9. **Write Comments**: Explain the "why", not the "what"
10. **Follow Patterns**: Stick to existing code patterns in the project

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | June 2026 | Dev Team | Initial documentation |

---

**Last Updated:** June 13, 2026

For questions or updates to this documentation, please contact the development team.
