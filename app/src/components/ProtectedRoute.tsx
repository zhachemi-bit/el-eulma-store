import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, allowedRoles, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-[#27ae60] animate-spin mx-auto mb-4" />
          <p className="text-[#5d6d7e]">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated - redirect to role selection
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  const hasRequiredRole = hasRole(allowedRoles);

  if (!hasRequiredRole) {
    // User is authenticated but doesn't have the required role
    if (fallback) {
      return <>{fallback}</>;
    }

    // Show access denied page
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#2c3e50] mb-2">
            Access Denied
          </h1>
          <p className="text-[#5d6d7e] mb-6">
            You don't have permission to access this page. This area is restricted to{' '}
            {Array.isArray(allowedRoles) ? allowedRoles.join(' or ') : allowedRoles} users only.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => window.location.href = '/'} className="bg-[#27ae60] hover:bg-[#229954]">
              Go Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // User is authenticated and has the required role
  return <>{children}</>;
}

// Specific route guards
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles="admin">
      {children}
    </ProtectedRoute>
  );
}

export function VendorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles="vendor">
      {children}
    </ProtectedRoute>
  );
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-12 h-12 text-[#27ae60] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
