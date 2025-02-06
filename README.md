
# 🛒 Electronics Store

This project is a Single Page Application (SPA) for an online electronics store built with Angular 19. The application allows users to browse products, filter them by categories and price, add items to a shopping cart, and view selected items.

## 🚀 Features

- 🔍 **Product Filtering:** Search and filter products by name, category, and price.
- 🛒 **Shopping Cart:** Add products to the cart with persistent state across sessions.
- 📄 **Pagination:** Navigate through a large number of products using pagination.
- ⚡ **State Management:** Reactive state management using NGRX.
- 🎨 **UI Components:** Built with Angular Material for a modern user interface.

## 🛠️ Technologies Used

- **Angular 19** (using the new syntax `@if`, `@for`, `track`)
- **NGRX** for state management
- **Angular Material** for UI components
- **json-server** for mock backend
- **TypeScript** for strong typing

## 📦 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/electronics-store.git
   cd electronics-store
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the JSON server for mock data:**

   ```bash
   npm run start:api
   ```

4. **Run the development server:**

   ```bash
   ng serve
   ```

   Open your browser at [http://localhost:4200/](http://localhost:4200/).

## 🚩 Development Commands

- **Run the development server:** `ng serve`
- **Start JSON Server:** `npm run server`
- **Build for production:** `ng build`
- **Run unit tests:** `ng test`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/        # UI components (ProductCard, Filters, CartSummary)
│   ├── services/          # API services (ProductService, CartService)
│   ├── store/             # NGRX Store (actions, reducers, selectors)
│   ├── models/            # TypeScript interfaces (Product, CartItem)
│   └── app.config.ts      # Configuration for NGRX and routing
└── assets/                # Static files (images)
```

## 💡 Key Features

- Utilizes the new Angular 19 syntax for structural directives (`@if`, `@for`, `track`).
- Shopping cart state is persisted in `localStorage` to retain data between sessions.

## 📄 License

This project is for educational purposes and can be used for personal projects.
