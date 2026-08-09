# Wholesale Hub

A B2B wholesale ecommerce platform for **mobile**, **computer**, and **camera** electronics
and accessories. Guests can browse the catalog, but wholesale pricing and ordering stay
hidden until a business account is reviewed and approved by an admin.

**Company:** Al Mizhar First, Aswaaq Mall, Dubai, UAE · +971 58 927 3218
(edit `client/src/config/company.js` to update — it feeds the footer, the Contact page,
and the WhatsApp links). Prices are displayed in AED.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Frontend:** React (Vite), Tailwind CSS, React Router

## How access control works

1. Anyone can browse `/catalog` and product pages — names, specs, MOQ are visible.
2. Prices and the "Request quote" button are hidden until the visitor is logged in
   **and** their account has `approvalStatus: approved`.
3. New signups go to `POST /api/auth/register` and start as `pending`.
4. An admin reviews them at `/admin` and approves or rejects. Approval also assigns a
   pricing tier (`standard`, `silver`, `gold`, `platinum` — you can wire tier-specific
   pricing into the Product model later if you want per-buyer pricing instead of
   quantity-only tiers).
5. Once approved, the buyer can see bulk pricing tables and submit quote requests,
   which respect each product's MOQ (minimum order quantity).

## Project structure

```
wholesale-hub/
  server/          Express API
    models/        User, Category, Product, QuoteRequest
    routes/        auth, products, categories, quotes, admin
    middleware/     auth.js — requireAuth / requireAdmin / requireApprovedBuyer
    seed.js         Sample data across all 3 verticals + admin account
  client/          React app (Vite)
    src/pages/      Home, Catalog, ProductDetail, Login, Register, Admin
    src/components/ Navbar, ProductCard, RequireAdmin
    src/context/    AuthContext (login/register/logout, approval state)
```

## Setup

### 1. Prerequisites

- Node.js 18+
- A MongoDB database — easiest is a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.
  Create one, add a database user, and copy the connection string.

### 2. Install dependencies

```bash
cd wholesale-hub
npm run install:all
```

(This installs root, `server/`, and `client/` dependencies. If it fails, just run
`npm install` inside each of the three folders individually.)

### 3. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — mongodb+srv://sandidtradingdxb_db_user:<db_password>@cluster0.gxnpmuc.mongodb.net/?appName=Cluster0
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for your first admin login

### 4. Seed sample data

```bash
cd server
npm run seed
```

This creates the 6 categories (Smartphones, Phone Accessories, Laptops & Desktops,
Computer Accessories, Cameras, Camera Accessories), a handful of sample products with
tiered pricing and MOQ, and your admin account.

### 5. Run it

In two terminals:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Visit `http://localhost:5173`. Log in with your `ADMIN_EMAIL` / `ADMIN_PASSWORD` and
go to `/admin` to approve test buyer accounts you register.

## Deploying

- **Backend:** Render, Railway, or Fly.io all work well for a small Express + MongoDB app.
  Point `CLIENT_URL` in `.env` at your deployed frontend domain for CORS.
- **Frontend:** Vercel or Netlify — run `npm run build` in `client/`, deploy the `dist/` folder.
  Update the `vite.config.js` proxy or set an `VITE_API_URL` env var once you have a live
  backend URL (currently the client calls relative `/api/...`, which works out of the box
  in dev via the Vite proxy — for production you'll want to either serve both from the same
  domain or add a small `axios` baseURL config pointing at your API's real URL).
- Point your domain's DNS at whichever platform hosts the frontend.

## Extending this

Natural next steps, roughly in order of value:

1. **Product images** — wire up S3/Cloudinary uploads in the admin product form (currently
   `images` is just a string array you can populate via the API).
2. **Admin product management UI** — right now creating/editing products goes through the
   API directly (Postman/Insomnia) or the seed script. A simple admin CRUD screen for
   products would close the loop.
3. **Email notifications** — notify buyers when approved/rejected, and notify admins on
   new applications and quote requests (Resend, SendGrid, or Postmark are easy to add).
4. **Real checkout/payments** — right now buyers submit a quote request that an admin
   confirms manually (typical for wholesale, where pricing/shipping often gets negotiated).
   If you want self-serve checkout instead, Stripe is the natural addition.
5. **Per-buyer pricing tiers** — the `pricingTier` field exists on the User model but isn't
   wired into product pricing yet; add a tier-based price map on Product if different
   approved buyers should see different prices.
