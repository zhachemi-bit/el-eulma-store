// Authentication Types

export type UserRole = 'user' | 'vendor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Vendor-specific fields
  vendorId?: string;
  businessName?: string;
  businessAddress?: string;
  wilaya?: string;
  city?: string;
  registrationNumber?: string;
  isVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'vendor';
  avatar?: string;
  
  // Vendor-specific
  businessName?: string;
  businessAddress?: string;
  wilaya?: string;
  city?: string;
  registrationNumber?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  adminLogin: (password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  updateUser: (user: User) => void;
}

// Sample users database
export interface StoredUser extends User {
  passwordHash: string;
}
