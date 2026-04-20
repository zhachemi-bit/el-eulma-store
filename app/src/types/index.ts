export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory: string;
  vendorId: string;
  vendor: Vendor;
  stock: number;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string | Date;
  user: {
    name: string;
  };
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo?: string;
  location: string;
  wilaya: string;
  address: string;
  rating: number;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  productCount: number;
  registrationNumber?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  user?: {
    avatar?: string;
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: Date;
}

export interface VendorApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  wilaya: string;
  city: string;
  address: string;
  registrationNumber: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorName: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar?: string;
  userId?: string;
  createdAt?: Date;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  wilaya: string;
  city: string;
  address: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddressId: string;
  deliveryAddress: Address;
  paymentMethod: 'dahabia';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  estimatedDelivery?: Date;
}

export interface DahabiaPayment {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'user';
  vendorId?: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}
