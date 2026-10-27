
# 🛒 Electronics Store

An online electronics store: an Angular Single Page Application with a NestJS + PostgreSQL backend. Users sign up or log in, browse and filter products, and add items to a shopping cart; admins can delete products.

## 🚀 Features

- 🔐 **Authentication:** Sign up / log in with JWT. The whole shop is behind the login page; the session is restored on page reload.
- 🔍 **Product Filtering:** Search and filter products by name, category, and price (done on the server).
- 📄 **Pagination:** Server-side pagination through a large number of products.
- 🛒 **Shopping Cart:** Add products to the cart with persistent state across sessions.
- 👮 **Roles:** Admins can delete products.
- ⚡ **State Management:** Reactive state management using NGRX.
- 🎨 **UI Components:** Built with Ant Design (ng-zorro-antd) for a modern user interface.

## 🛠️ Technologies Used

**Frontend**
- **Angular 22** (standalone components, signals, Signal Forms, `@if` / `@for`)
- **NGRX** for state management
- **Ant Design (ng-zorro-antd)** for UI components

**Backend** (`server/`)
- **NestJS** REST API with **Swagger** docs
- **PostgreSQL** (in Docker) via **TypeORM**
- **JWT** authentication

## 📦 Installation & Setup

You need **Node.js** and **Docker** installed.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/electronics-store.git
   cd electronics-store
   ```

2. **Install dependencies** (frontend and backend):

   ```bash
   npm install
   npm --prefix server install
   ```

3. **Configure the backend:** copy `server/.env.example` to `server/.env` and set `JWT_SECRET` (the file explains how to generate one). The other defaults work as they are.

4. **Start the database** (PostgreSQL in Docker):

   ```bash
   npm --prefix server run db:up
   ```

5. **Fill the database with products** (once; loads them from `mock-data/db.json`):

   ```bash
   npm --prefix server run seed
   ```

6. **Start the backend** — API at [http://localhost:3000/api](http://localhost:3000/api), Swagger docs at [http://localhost:3000/api/docs](http://localhost:3000/api/docs):

   ```bash
   npm run start:server
   ```

7. **Start the frontend** in another terminal:

   ```bash
   ng serve
   ```

   Open your browser at [http://localhost:4200/](http://localhost:4200/) and sign up.

## 🚩 Development Commands

**Frontend** (from the project root)
- **Run the development server:** `ng serve`
- **Build for production:** `ng build`
- **Run unit tests:** `ng test`

**Backend** (from the project root)
- **Start the API in watch mode:** `npm run start:server`
- **Start / stop the database:** `npm --prefix server run db:up` / `npm --prefix server run db:down`
- **Load products into the database:** `npm --prefix server run seed`
- **Hash a password** (to add a user by hand in the database): `npm --prefix server run hash-password -- <password>`
- **Run backend tests:** `npm --prefix server test`

## 📁 Project Structure

```
src/app/                    # Angular frontend
├── components/             # UI components (login, header, product list/card, filters, cart)
├── guards/                 # Route guards (login required)
├── interceptors/           # Adds the JWT to API requests
├── services/               # API services (AuthService, ProductService)
├── store/                  # NGRX Store (products, cart)
├── models/                 # TypeScript interfaces
└── app.config.ts           # Providers: NGRX, routing, HTTP

server/                     # NestJS backend
├── src/                    # Modules: auth, users, products, database (seed)
├── docker-compose.yml      # PostgreSQL container
└── .env.example            # Backend settings

mock-data/                  # db.json with products (source for the seed) and its generator
```

## 💡 Key Features

- Utilizes the new Angular syntax for structural directives (`@if`, `@for`, `track`).
- Shopping cart state is persisted in `localStorage` to retain data between sessions.
- Filtering and pagination run on the server, so only one page of products is loaded at a time.

## 📄 License

This project is for educational purposes and can be used for personal projects.
