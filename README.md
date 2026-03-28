# 🎓 CampusShare — Smart College Resource Sharing System

A full-stack web application where college students can **rent, sell, or share** books, lab equipment, calculators, and hostel appliances with their fellow students.

---

## ✨ Features

### For Students
- 🔐 JWT-based signup & login
- 📋 Browse listings with search, filter by category/type, sort
- ➕ Add new listings (images, price, condition, tags)
- ✏️ Edit / delete your own listings
- 💬 Message listing owners directly
- ❤️ Like listings
- 🔖 Bookmark listings for later
- 📊 Personal dashboard with listing status tracking
- 📬 Inbox & sent messages

### For Admins
- 👑 Admin dashboard with platform stats
- ✅ Approve / reject submitted listings
- 🗑️ Delete inappropriate content
- 👥 View & activate/deactivate user accounts
- 📊 Category breakdown charts

### Platform
- 📱 Fully responsive (mobile + desktop)
- 🌙 Dark mode UI
- ⚡ Paginated listing grid
- 🔍 Full-text search
- 🖼️ Multi-image upload (local storage, Cloudinary-ready)

---

## 🗂️ Project Structure

```
smart-college-share/
├── package.json              # Root — runs both client & server
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── Pagination.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ListingDetail.jsx
│   │   │   ├── AddListing.jsx
│   │   │   ├── EditListing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Messages.jsx
│   │   │   └── Bookmarks.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── server/                   # Node.js + Express backend
    ├── index.js              # Entry point
    ├── seed.js               # Database seeder
    ├── models/
    │   ├── User.js
    │   ├── Listing.js
    │   └── Message.js
    ├── routes/
    │   ├── auth.js
    │   ├── listings.js
    │   ├── users.js
    │   ├── admin.js
    │   └── messages.js
    ├── controllers/
    │   ├── authController.js
    │   ├── listingController.js
    │   ├── adminController.js
    │   ├── userController.js
    │   └── messageController.js
    ├── middleware/
    │   └── auth.js
    ├── config/
    │   └── upload.js
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** v9+

---

## 🚀 Setup Instructions

### 1. Clone / Download the project

```bash
cd smart-college-share
```

### 2. Install all dependencies

```bash
npm run install:all
```

This installs root, server, and client dependencies in one command.

### 3. Configure environment variables

**Server** (`server/.env`):
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-college-share
JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

# Optional — Cloudinary for image hosting
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

**Client** (`client/.env`):
```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Seed the database (recommended)

```bash
npm run seed
```

This creates:
- 👑 **Admin**: `admin@college.edu` / `admin123`
- 🎓 **Student 1**: `student@college.edu` / `student123`
- 🎓 **Student 2**: `priya@college.edu` / `priya1234`
- 9 sample listings (8 approved + 1 pending)

### 5. Start the development servers

```bash
npm run dev
```

This runs both frontend and backend concurrently:
- 🖥️ **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:5000

---

## 📡 API Routes Reference

### Auth
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Listings
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/listings` | Get all approved listings | ❌ |
| GET | `/api/listings/my` | Get own listings | ✅ |
| GET | `/api/listings/:id` | Get single listing | ❌ |
| POST | `/api/listings` | Create listing | ✅ |
| PUT | `/api/listings/:id` | Update listing | ✅ |
| DELETE | `/api/listings/:id` | Delete listing | ✅ |
| POST | `/api/listings/:id/like` | Toggle like | ✅ |

**Query params for GET /listings:**
- `category` — Books / Lab Equipment / Appliances / Electronics / Stationery / Others
- `type` — Rent / Sell / Share
- `search` — full-text search
- `sort` — `-createdAt` / `price` / `-price` / `-views`
- `page` — page number (default: 1)
- `limit` — items per page (default: 12)

### Users
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/users/bookmark/:listingId` | Toggle bookmark | ✅ |
| GET | `/api/users/bookmarks` | Get bookmarked listings | ✅ |

### Messages
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/messages` | Send message | ✅ |
| GET | `/api/messages/inbox` | Get inbox | ✅ |
| GET | `/api/messages/sent` | Get sent messages | ✅ |
| PATCH | `/api/messages/:id/read` | Mark as read | ✅ |

### Admin (Admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/listings` | All listings (filterable) |
| PATCH | `/api/admin/listings/:id/status` | Approve/reject listing |
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/:id/toggle` | Activate/deactivate user |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| State | React Context API |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer (local) |
| Notifications | react-hot-toast |
| Icons | react-icons (Remix Icons) |

---

## 🖼️ Image Upload

By default, images are stored locally in `server/uploads/`.

To use **Cloudinary** instead:
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Add credentials to `server/.env`
3. Update `server/config/upload.js` to use `multer-storage-cloudinary`

---

## 🔐 Security Notes

- Passwords hashed with **bcrypt** (12 rounds)
- **JWT** tokens expire in 7 days
- Protected routes check token on every request
- Admin routes double-check role
- Input validation via **express-validator**
- File upload restricted to images ≤ 5MB

---

## 🧩 Listing Approval Flow

```
Student submits listing
        ↓
  Status: "pending"
        ↓
Admin reviews in Admin Panel
        ↓
  ┌─────────────┐
  │  Approved   │  → Listing goes public
  │  Rejected   │  → Student notified via status
  └─────────────┘
```

Admins' own listings are auto-approved.

---

## 💡 Tips

- To make yourself an admin: update role in MongoDB — `db.users.updateOne({email: "you@example.com"}, {$set: {role: "admin"}})`
- Upload folder is at `server/uploads/` — you can delete files manually during development
- The seed script is safe to re-run; it clears all data first
