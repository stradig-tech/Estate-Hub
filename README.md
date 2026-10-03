# Estate Hub — Real Estate SaaS Platform

<div align="center">

![Estate Hub Banner](backend/media/site/estate_hub_logo_trimmed.png)

**A Modern, Scalable Multi-Vendor Real Estate SaaS Platform**

[![Built with Django](https://img.shields.io/badge/Backend-Django_6.x-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Built with DRF](https://img.shields.io/badge/API-Django_REST_Framework-red?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![Built with React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Built with Vite](https://img.shields.io/badge/Bundler-Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Project Overview

**Estate Hub** is an enterprise-grade Real Estate Software-as-a-Service (SaaS) platform engineered by **Stradigtech** and developed by **Mansib Ahsan** ([mansibahsan.netlify.app](https://mansibahsan.netlify.app)).

Estate Hub delivers an all-in-one property marketplace connecting property seekers, certified real estate agents, and brokerages. It pairs a high-performance **Django REST Framework** backend with a dynamic, accessible **React (Vite)** single-page application. The platform features role-based access control, an interactive property search engine, automated agent verification, an in-app customer-agent messaging inbox, and a full-featured administrative Content Management System (CMS).

- **Product:** Real Estate SaaS (Estate Hub)
- **Company:** Stradigtech
- **Lead Developer:** Mansib Ahsan ([Portfolio](https://mansibahsan.netlify.app))
- **Architecture:** Decoupled RESTful Architecture (DRF Backend + React SPA Frontend)

---

## 🌟 Key Features

### 🏢 1. Multi-Tenant Role Architecture
- **Property Seekers / Customers:**
  - Search and filter properties by listing type (Sale / Rent), price range, bedrooms, bathrooms, and location.
  - Interactive property inquiry and tour scheduling forms.
  - Save properties to a personal **Favorites / Wishlist**.
  - Submit ratings and detailed reviews on property listings.
  - Direct in-app messaging with listing agents.
- **Real Estate Agents & Agencies:**
  - Dedicated agent onboarding workflow with license, agency name, contact info, and bio.
  - Gated approval system (**Pending** vs. **Approved** status monitored via admin approval banner).
  - Agent property dashboard: Add, edit, toggle availability (`Active`, `Pending`, `Sold`, `Rented`), and manage property photo galleries.
  - Dedicated client communication inbox for inbound listing inquiries.
- **Platform Administrators:**
  - Modern administrative panel powered by **Django Jazzmin**.
  - Approve or decline agent applications.
  - Manage global site configuration, CMS hero sliders, logos, favicons, social media links, and menus.
  - Full property listing and user account moderation.

### 🔍 2. Property Discovery & Inventory System
- **Advanced Filtering:** Filter by keyword, buy/rent status, price boundaries, bedroom/bathroom count, property type (House, Apartment, Condo, Villa, Land, Commercial), and location.
- **Rich Listing Details:** High-resolution multi-photo carousels, detailed amenity checklists (Pool, Gym, Air Conditioning, Garage, Garden, Security), property specs (square footage, year built), and embedded agent cards.
- **Responsive Media:** Pillow-powered automated image processing, thumbnailing, and transparent edge-trimming.

### 🎨 3. Dynamic CMS & Site Customization
- **Hero Section Management:**
  - Customizable title and description directly from the admin dashboard.
  - Dynamic background image slider with configurable transition intervals and autoplay controls.
- **Global Branding & Assets:**
  - Upload custom site logo with automatic zero-margin trimming so logos render prominently in the navigation bar.
  - Custom favicon and Open Graph (OG) social preview images with automatic cache-busting (`?v={mtime}`).
  - Dynamic mega menus and top-level navigation links.
- **Corporate & Leadership Credentials:**
  - Customizable CEO/Founder name, role, signature image, office open hours, and physical address.
  - Configurable developer credit attributions in the footer.
- **Blog Engine:** Full blog publishing workflow with authors, categories, tags, excerpts, and rich content.

### 📱 4. Mobile-First Responsive Experience
- Responsive navbar with adaptive mobile dropdown navigation for public routes.
- Dedicated **mobile slide-over drawer** for dashboard accounts with backdrop blur, closing animations, and one-touch link routing.
- Optimized touch targets, accessible Radix UI dialogs, dropdowns, and modals.

---

## 🛠️ Technology Stack

### Backend
| Technology | Description |
| :--- | :--- |
| **Python 3.13** | Core backend language |
| **Django 6.0+** | Enterprise Python web framework |
| **Django REST Framework** | Robust REST API endpoints and serializers |
| **SimpleJWT** | JSON Web Token (JWT) stateless user authentication |
| **Pillow (PIL)** | Image manipulation, thumbnailing, and auto-trimming |
| **Django Jazzmin** | Modernized, clean Django Admin UI theme |
| **Django CORS Headers** | Secure cross-origin resource sharing for frontend API consumption |
| **SQLite / MySQL** | SQLite for rapid local development; production-ready for MySQL |

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 18** | Declarative component-driven user interface |
| **Vite 6** | Ultra-fast build tool and development server |
| **Tailwind CSS** | Utility-first responsive CSS design system |
| **Radix UI** | Unstyled, accessible UI primitives (Dialogs, Dropdowns, Tabs, Tooltips) |
| **Lucide React** | Clean, consistent vector icon set |
| **Axios** | HTTP client with automatic JWT bearer token interceptors |
| **React Router v6** | Client-side routing with protected route guards |
| **Framer Motion** | Micro-interactions and smooth UI transitions |

---

## 📂 Project Directory Structure

```text
Estate-Hub/
├── backend/                           # Django REST Framework Backend
│   ├── accounts/                      # Custom User, Agent profiles, Roles & Auth
│   ├── properties/                    # Property listings, Amenities, Images, Reviews
│   ├── cms/                           # SiteSettings, HeroSlides, Menus, Blogs, Pages
│   ├── support/                       # In-app chat, Contact inquiries & Tour requests
│   ├── billing/                       # SaaS Subscriptions, Invoices & Plans
│   ├── api/                           # Centralized API URL routers
│   ├── estate_flow_backend/           # Django settings, WSGI/ASGI configuration
│   ├── media/                         # Uploaded property images, logos, slides
│   ├── static/                        # Collected static assets
│   ├── requirements.txt               # Python package dependencies
│   ├── manage.py                      # Django CLI management script
│   └── seed*.py                       # Data seeders (CMS, menus, properties, blogs)
│
├── frontend/                          # React + Vite Frontend
│   ├── src/
│   │   ├── api/                       # Axios client & modular API service layers
│   │   ├── components/                # Reusable UI & Layout components
│   │   │   ├── Layout/                # Navbar, Footer, DashboardLayout, Mobile Drawer
│   │   │   └── ui/                    # Radix + Tailwind UI component library
│   │   ├── pages/                     # Routed view pages (Home, Listings, Dashboard, etc.)
│   │   ├── lib/                       # AuthContext, utils, and global helpers
│   │   ├── App.jsx                    # Root router and layout orchestrator
│   │   └── main.jsx                   # React application entry point
│   ├── index.html                     # HTML root template with dynamic OG/favicon
│   ├── tailwind.config.js             # Tailwind CSS tokens and themes
│   ├── vite.config.js                 # Vite build & proxy configuration
│   └── package.json                   # Node.js dependencies and scripts
│
└── README.md                          # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Python:** 3.11+ (Python 3.13 recommended)
- **Node.js:** 18.x or 20.x LTS
- **Package Managers:** `pip` and `npm`

---

### Step 1: Backend Setup (Django)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Seed initial demo data (Optional but recommended):**
   ```bash
   python seed.py
   python seed_cms.py
   python seed_menus.py
   python seed_blogs.py
   ```

6. **Start the Django development server:**
   ```bash
   python manage.py runserver 8000
   ```
   *The backend REST API will be live at `http://localhost:8000/api/` and the Admin panel at `http://localhost:8000/admin/`.*

---

### Step 2: Frontend Setup (React + Vite)

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (if needed):**
   Create a `.env` file inside `frontend/` (defaults to local backend):
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   *The web application will open at `http://localhost:5173`.*

---

## 🔑 Default Demo Credentials

All test accounts are configured with the default password: **`123456`**

| Role | Email | Password | Access / Notes |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@estatehub.com` | `123456` | Full Django Admin & CMS control |
| **Licensed Agent** | `chris.patt@estatehub.com` | `123456` | Agency: Estate Hub, Active Listing |
| **Licensed Agent** | `esther.howard@estatehub.com` | `123456` | Agency: Estate Hub, Active Listing |
| **Licensed Agent** | `darrell.steward@estatehub.com` | `123456` | Agency: Estate Hub, Active Listing |
| **Licensed Agent** | `robert.fox@estatehub.com` | `123456` | Agency: Estate Hub, Active Listing |
| **Customer** | `customer@estatehub.com` | `123456` | Wishlist, Reviews & Messaging |

---

## 📡 Core API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login/` | `POST` | Authenticate user & issue JWT access/refresh tokens |
| `/api/auth/register/` | `POST` | Register a new customer or agent account |
| `/api/auth/me/` | `GET/PATCH` | Retrieve or update current user profile & avatar |
| `/api/properties/` | `GET/POST` | List filtered properties or submit a new property |
| `/api/properties/<id>/` | `GET/PUT/DELETE` | Retrieve, update, or remove a specific property |
| `/api/properties/<id>/reviews/` | `GET/POST` | Fetch or submit customer reviews for a property |
| `/api/properties/favorites/` | `GET/POST` | Manage user favorite listings wishlist |
| `/api/cms/settings/` | `GET` | Retrieve site settings, branding, and hero slides |
| `/api/cms/menus/` | `GET` | Fetch dynamic navigation menus & mega menu items |
| `/api/cms/blogs/` | `GET` | Retrieve published real estate blog articles |
| `/api/support/messages/` | `GET/POST` | Send and retrieve customer-to-agent messages |

---

## 🧪 Testing & Verification

Run the comprehensive automated Django backend test suite:

```bash
cd backend
python manage.py test
```

Build and validate the React production bundle:

```bash
cd frontend
npm run build
```

---

## 👨‍💻 Developer & Company Credits

- **Product:** Estate Hub Real Estate SaaS
- **Developed by:** [Mansib Ahsan](https://mansibahsan.netlify.app)
- **Company:** [Stradigtech](https://stradigtech.com)
- **Portfolio:** [mansibahsan.netlify.app](https://mansibahsan.netlify.app)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
