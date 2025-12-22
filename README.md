# 🛍️ Angular Micro-Frontend E-Commerce Platform

A modern e-commerce platform demonstrating **Angular 20** micro-frontend architecture with **Module Federation**, **NgRx Signals**, and **Tailwind CSS**.

## 🎯 Project Overview

This project showcases advanced Angular patterns including:

- ✅ **Angular Signals** - Reactive state management with signals
- ✅ **NgRx + Signals** - Signal-based stores for global state
- ✅ **Module Federation** - Micro-frontend architecture with Native Federation
- ✅ **Tailwind CSS + SCSS** - Modern styling with utility-first CSS
- ✅ **Jest** - Unit testing framework
- ✅ **Playwright** - End-to-end testing
- ✅ **Nx Monorepo** - Efficient workspace management

## 📁 Project Structure

```
ecommerce-platform/
├── apps/
│   ├── main/                    # Host application (port 4200)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/
│   │   │   │   │   ├── navigation.component.ts
│   │   │   │   │   └── product-list.component.ts
│   │   │   │   └── app.routes.ts
│   │   └── federation.config.js
│   └── main-e2e/               # E2E tests
│
├── cart-mfe/                    # Shopping cart micro-frontend (port 4201)
│   ├── src/
│   │   ├── app/
│   │   │   ├── cart/
│   │   │   │   └── cart.component.ts
│   │   │   └── remote-entry/
│   │   │       └── entry.routes.ts
│   └── federation.config.js
│
├── profile-mfe/                 # User profile micro-frontend (port 4202)
│   ├── src/
│   │   ├── app/
│   │   │   ├── profile/
│   │   │   │   └── profile.component.ts
│   │   │   └── remote-entry/
│   │   │       └── entry.routes.ts
│   └── federation.config.js
│
└── libs/
    └── shared/
        ├── data-access/         # NgRx Signal Stores
        │   └── src/lib/stores/
        │       ├── product.store.ts
        │       ├── cart.store.ts
        │       └── auth.store.ts
        └── models/              # TypeScript interfaces
            └── src/lib/models.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   cd ecommerce-platform
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

### Running the Application

You need to run all three applications simultaneously for the full micro-frontend experience.

#### Option 1: Run All Apps (Recommended)

```bash
# Terminal 1: Main application (host)
pnpm nx serve main

# Terminal 2: Cart micro-frontend
pnpm nx serve cart-mfe

# Terminal 3: Profile micro-frontend
pnpm nx serve profile-mfe
```

#### Option 2: Run in Parallel

```bash
pnpm nx run-many --target=serve --projects=main,cart-mfe,profile-mfe --parallel
```

### Access the Application

- **Main App**: http://localhost:4200
- **Cart MFE**: http://localhost:4201 (loaded dynamically by main app)
- **Profile MFE**: http://localhost:4202 (loaded dynamically by main app)

## 🏗️ Architecture

### Module Federation

The project uses **@angular-architects/native-federation** for micro-frontend architecture:

- **main** (Host): Loads and orchestrates remote micro-frontends
- **cart-mfe** (Remote): Exposes cart functionality
- **profile-mfe** (Remote): Exposes user profile functionality

### State Management with NgRx Signals

#### Product Store
```typescript
const ProductStore = signalStore(
  { providedIn: 'root' },
  withState({ products: [], loading: false, filter: '' }),
  withComputed((store) => ({
    filteredProducts: computed(() => /* filtering logic */),
    productCount: computed(() => store.products().length)
  })),
  withMethods((store) => ({
    loadProducts(products: Product[]) { /* ... */ },
    setFilter(filter: string) { /* ... */ }
  }))
);
```

#### Cart Store
```typescript
const CartStore = signalStore(
  { providedIn: 'root' },
  withState({ items: [] }),
  withComputed((store) => ({
    totalItems: computed(() => /* sum quantities */),
    totalPrice: computed(() => /* calculate total */),
    isEmpty: computed(() => store.items().length === 0)
  })),
  withMethods((store) => ({
    addItem(item: CartItem) { /* ... */ },
    removeItem(productId: string) { /* ... */ },
    updateQuantity(productId: string, quantity: number) { /* ... */ }
  }))
);
```

#### Auth Store
```typescript
const AuthStore = signalStore(
  { providedIn: 'root' },
  withState({ user: null, isAuthenticated: false }),
  withComputed((store) => ({
    userName: computed(() => store.user()?.name ?? 'Guest'),
    userEmail: computed(() => store.user()?.email ?? '')
  })),
  withMethods((store) => ({
    login(user: User) { /* ... */ },
    logout() { /* ... */ }
  }))
);
```

### Shared State Across Micro-Frontends

All micro-frontends share state through the centralized NgRx Signal stores:

1. **Main App** manages product catalog and adds items to cart
2. **Cart MFE** reads and modifies cart state
3. **Profile MFE** reads authentication state and displays user info

This demonstrates true state sharing across independently deployed micro-frontends!

## 🎨 Styling

### Tailwind CSS Configuration

The project uses Tailwind CSS v4 with custom color palettes:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './apps/main/src/**/*.{html,ts}',
    './cart-mfe/src/**/*.{html,ts}',
    './profile-mfe/src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* blue shades */ },
        secondary: { /* purple shades */ }
      }
    }
  }
};
```

### Custom SCSS Styles

Global styles in `apps/main/src/styles.scss`:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

.card {
  @apply rounded-lg shadow-md p-6 bg-white transition-all duration-300;
  
  &:hover {
    @apply shadow-xl;
    transform: translateY(-4px);
  }
}

.btn-primary {
  @apply px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold;
  
  &:hover {
    @apply bg-primary-600 shadow-lg;
    transform: translateY(-2px);
  }
}
```

## 🧪 Testing

### Unit Tests (Jest)

Run unit tests for all projects:

```bash
# Test all projects
pnpm nx run-many --target=test --all

# Test specific project
pnpm nx test main
pnpm nx test cart-mfe
pnpm nx test profile-mfe

# Test with coverage
pnpm nx test main --coverage
```

### E2E Tests (Playwright)

Run end-to-end tests:

```bash
# Run E2E tests
pnpm nx e2e main-e2e

# Run in UI mode
pnpm nx e2e main-e2e --ui

# Run specific test file
pnpm nx e2e main-e2e --spec=cart.spec.ts
```

## 📦 Building for Production

Build all applications:

```bash
# Build all apps
pnpm nx run-many --target=build --all --configuration=production

# Build specific app
pnpm nx build main --configuration=production
pnpm nx build cart-mfe --configuration=production
pnpm nx build profile-mfe --configuration=production
```

Build output will be in `dist/` directory.

## 🔑 Key Features Demonstrated

### 1. Angular Signals
- Signal-based components with `signal()` and `computed()`
- Reactive UI updates without manual change detection
- Used in navigation cart counter, product filtering, and more

### 2. NgRx Signal Store
- Centralized state management with signals
- Computed selectors for derived state
- Methods for state mutations
- Shared across micro-frontends

### 3. Module Federation
- Dynamic loading of remote micro-frontends
- Shared dependencies (Angular, NgRx, etc.)
- Independent deployment capability
- Route-based code splitting

### 4. Tailwind CSS + SCSS
- Utility-first styling with Tailwind
- Custom SCSS for complex components
- Responsive design with mobile-first approach
- Custom color palette and design system

### 5. Micro-Frontend Communication
- Shared state via NgRx stores
- Cross-application navigation
- Consistent styling across apps

## 📚 Learning Resources

### Angular Signals
- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [Signal-based Components](https://angular.dev/guide/components)

### NgRx Signals
- [@ngrx/signals Documentation](https://ngrx.io/guide/signals)
- [Signal Store Guide](https://ngrx.io/guide/signals/signal-store)

### Module Federation
- [Native Federation for Angular](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Micro-Frontend Architecture](https://micro-frontends.org/)

### Nx Monorepo
- [Nx Documentation](https://nx.dev)
- [Angular with Nx](https://nx.dev/recipes/angular)

## 🛠️ Development Tips

### Adding a New Micro-Frontend

1. Generate new Angular app:
   ```bash
   pnpm nx g @nx/angular:app my-mfe --style=scss --routing=true
   ```

2. Initialize Native Federation:
   ```bash
   pnpm nx g @angular-architects/native-federation:init --project=my-mfe --port=4203 --type=remote
   ```

3. Create remote entry routes and expose them in `federation.config.js`

4. Add route in main app to load the remote

### Creating a New Signal Store

1. Create store file in `libs/shared/data-access/src/lib/stores/`
2. Use `signalStore` with `withState`, `withComputed`, and `withMethods`
3. Export from `libs/shared/data-access/src/index.ts`
4. Inject and use in components

## 📝 Project Commands

```bash
# Development
pnpm nx serve main              # Serve main app
pnpm nx serve cart-mfe          # Serve cart micro-frontend
pnpm nx serve profile-mfe       # Serve profile micro-frontend

# Testing
pnpm nx test main               # Run unit tests
pnpm nx e2e main-e2e            # Run E2E tests
pnpm nx test main --coverage    # Test with coverage

# Building
pnpm nx build main              # Build main app
pnpm nx build cart-mfe          # Build cart MFE
pnpm nx build profile-mfe       # Build profile MFE

# Linting
pnpm nx lint main               # Lint main app
pnpm nx lint cart-mfe           # Lint cart MFE

# Code Generation
pnpm nx g @nx/angular:component my-component --project=main
pnpm nx g @nx/angular:library my-lib
```

## 🤝 Contributing

This is a learning project demonstrating Angular micro-frontend patterns. Feel free to:

- Experiment with the code
- Add new features
- Try different state management patterns
- Extend the micro-frontend architecture

## 📄 License

MIT

---

**Built with ❤️ using Angular 20, Nx, NgRx Signals, and Tailwind CSS**
