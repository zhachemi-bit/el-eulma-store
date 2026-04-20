# El Eulma Store - Technical Specification

## Project Overview

A comprehensive e-commerce marketplace connecting El Eulma wholesalers to customers across all 58 Algerian wilayas. Built with React, TypeScript, and Tailwind CSS.

---

## Component Inventory

### shadcn/ui Components (Built-in)

| Component | Purpose | Installation |
|-----------|---------|--------------|
| Button | CTAs, actions | `npx shadcn add button` |
| Card | Product cards, feature cards | `npx shadcn add card` |
| Input | Forms, search | `npx shadcn add input` |
| Label | Form labels | `npx shadcn add label` |
| Badge | Stock status, sale badges | `npx shadcn add badge` |
| Dialog | Modals, confirmations | `npx shadcn add dialog` |
| Sheet | Mobile navigation drawer | `npx shadcn add sheet` |
| Dropdown Menu | User menu, filters | `npx shadcn add dropdown-menu` |
| Select | Form dropdowns | `npx shadcn add select` |
| Tabs | Dashboard sections | `npx shadcn add tabs` |
| Table | Order history, product list | `npx shadcn add table` |
| Avatar | User profiles | `npx shadcn add avatar` |
| Separator | Visual dividers | `npx shadcn add separator` |
| Scroll Area | Scrollable containers | `npx shadcn add scroll-area` |
| Skeleton | Loading states | `npx shadcn add skeleton` |
| Toast | Notifications | `npx shadcn add toast` |
| Carousel | Product image gallery | `npx shadcn add carousel` |
| Accordion | FAQ section | `npx shadcn add accordion` |

### Third-Party Registry Components

| Component | Registry | Purpose | Installation |
|-----------|----------|---------|--------------|
| Animated Number | @magicui | Counter animations | `npx shadcn add @magicui/number-ticker` |

### Custom Components to Build

| Component | Purpose | Location |
|-----------|---------|----------|
| Header | Navigation with scroll effects | `src/components/Header.tsx` |
| Footer | Site footer | `src/components/Footer.tsx` |
| ProductCard | Product display card | `src/components/ProductCard.tsx` |
| CategoryCard | Category display card | `src/components/CategoryCard.tsx` |
| FeatureCard | Feature/benefit card | `src/components/FeatureCard.tsx` |
| TestimonialCard | Customer testimonial | `src/components/TestimonialCard.tsx` |
| CartDrawer | Shopping cart slide-out | `src/components/CartDrawer.tsx` |
| SearchBar | Product search with filters | `src/components/SearchBar.tsx` |
| PriceRange | Price range slider | `src/components/PriceRange.tsx` |
| StarRating | Product rating display | `src/components/StarRating.tsx` |
| StepCard | How it works step | `src/components/StepCard.tsx` |
| StatCounter | Animated statistics | `src/components/StatCounter.tsx` |

---

## Animation Implementation Plan

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero content fade-in + slide-up | Framer Motion | `motion.div` with initial/animate props | Medium |
| Hero image scale-in | Framer Motion | `motion.div` with scale animation | Low |
| Floating elements | CSS Keyframes | `@keyframes float` with infinite loop | Low |
| Scroll-triggered reveals | Framer Motion | `whileInView` with viewport options | Medium |
| Staggered card animations | Framer Motion | `staggerChildren` in parent variants | Medium |
| Button hover lift | Tailwind + CSS | `hover:translate-y-[-2px]` transition | Low |
| Card hover lift + shadow | Tailwind + CSS | `hover:translate-y-[-8px]` + shadow | Low |
| Image zoom on hover | Tailwind | `group-hover:scale-105` with overflow-hidden | Low |
| Counter number animation | @magicui/number-ticker | Built-in component | Low |
| Navigation scroll effect | React State + CSS | useScroll hook + conditional classes | Medium |
| Mobile menu slide-in | Framer Motion | AnimatePresence + motion.div | Medium |
| Page transitions | Framer Motion | AnimatePresence on route change | Medium |
| How It Works line draw | CSS/Framer Motion | Width animation from 0 to 100% | Medium |
| Pulse CTA button | CSS Keyframes | `@keyframes pulse` infinite | Low |

### Animation Library Choices

**Primary: Framer Motion**
- React-native integration
- Declarative API
- Built-in gesture support
- AnimatePresence for mount/unmount
- whileInView for scroll triggers

**Secondary: CSS/Tailwind**
- Simple hover effects
- Keyframe animations
- Performance-critical animations
- Reduced motion support

---

## Project Structure

```
/mnt/okcomputer/output/app/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── products/
│   │   ├── categories/
│   │   └── testimonials/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── StarRating.tsx
│   │   ├── StepCard.tsx
│   │   └── StatCounter.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Categories.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Statistics.tsx
│   │   ├── Testimonials.tsx
│   │   └── VendorCTA.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── UserDashboard.tsx
│   │   └── VendorDashboard.tsx
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useScrollPosition.ts
│   │   └── useLocalStorage.ts
│   ├── context/
│   │   └── CartContext.tsx
│   ├── data/
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── testimonials.ts
│   │   └── wilayas.ts
│   ├── types/
│   │   └── index.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── components.json
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Dependencies

### Core Dependencies (Auto-installed)
- React 18+
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

### Additional Dependencies to Install

```bash
# Animation
npm install framer-motion

# Icons
npm install lucide-react

# Routing
npm install react-router-dom

# Utilities
npm install clsx tailwind-merge
```

---

## State Management

### Cart State (Context API)
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContext {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
```

### User State (Local Storage)
- User profile
- Saved addresses
- Order history
- Wishlist

---

## Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  vendor: Vendor;
  stock: number;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  createdAt: Date;
}
```

### Vendor
```typescript
interface Vendor {
  id: string;
  name: string;
  logo: string;
  location: string;
  rating: number;
  verified: boolean;
  productCount: number;
}
```

### Order
```typescript
interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  paymentMethod: 'cod';
  createdAt: Date;
  estimatedDelivery: Date;
}
```

### Address
```typescript
interface Address {
  id: string;
  fullName: string;
  phone: string;
  wilaya: string;
  city: string;
  address: string;
  postalCode?: string;
}
```

---

## Routing Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with all sections |
| `/products` | Products | Product catalog with filters |
| `/products/:id` | ProductDetail | Single product page |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Order checkout |
| `/dashboard` | UserDashboard | User account dashboard |
| `/vendor` | VendorDashboard | Vendor management dashboard |

---

## Key Implementation Notes

### Responsive Design
- Mobile-first approach
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- Touch-friendly interactions (min 44px tap targets)
- Hamburger menu on mobile

### Performance Optimizations
- Lazy load images
- Code split routes
- Use React.memo for expensive components
- Intersection Observer for scroll animations
- will-change on animated elements

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast WCAG 2.1 AA
- prefers-reduced-motion support

### SEO
- Semantic HTML structure
- Meta tags for each page
- Alt text on images
- Structured data for products

---

## Build Commands

```bash
# Initialize project


# Install additional dependencies
cd /mnt/okcomputer/output/app
npm install framer-motion lucide-react react-router-dom

# Add shadcn components
npx shadcn add button card input label badge dialog sheet dropdown-menu select tabs table avatar separator scroll-area skeleton toast carousel accordion

# Add magicui components
npx shadcn add @magicui/number-ticker

# Development server
npm run dev

# Production build
npm run build
```

---

## Deployment

Build output: `/mnt/okcomputer/output/app/dist/`
Deploy target: Static hosting (Netlify, Vercel, or similar)
