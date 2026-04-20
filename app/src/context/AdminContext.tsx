import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { VendorApplication, Vendor } from '@/types';
import { api } from '@/lib/api';

interface AdminContextType {
  applications: VendorApplication[];
  vendors: Vendor[];
  stats: {
    totalVendors: number;
    pendingApplications: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
  isLoading: boolean;
  approveApplication: (id: string, notes?: string) => Promise<void>;
  rejectApplication: (id: string, notes?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingApplications: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [adminStats, allVendors, pendingApps] = await Promise.all([
        api.getAdminStats(),
        api.getAdminVendors({ status: 'approved' }),
        api.getAdminVendors({ status: 'pending' })
      ]);

      setStats({
        totalVendors: adminStats.totalVendors,
        pendingApplications: adminStats.pendingVendors,
        totalProducts: adminStats.totalProducts,
        totalOrders: adminStats.totalOrders,
        totalRevenue: adminStats.totalRevenue,
      });

      setVendors(allVendors);
      // Map vendor objects to application-like objects if necessary, 
      // or just use the vendors with 'pending' status as applications
      setApplications(pendingApps.map((v: any) => ({
        id: v.id,
        businessName: v.name,
        ownerName: v.name, // The backend doesn't have ownerName separate currently
        email: v.email,
        phone: v.phone,
        wilaya: v.wilaya || '19',
        city: v.location || 'El Eulma',
        address: v.address || v.location,
        registrationNumber: v.registrationNumber || '',
        description: v.description || '',
        status: v.status,
        createdAt: new Date(v.createdAt),
      })));
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const approveApplication = useCallback(async (id: string) => {
    try {
      await api.approveVendor(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to approve vendor:', error);
      throw error;
    }
  }, [refreshData]);

  const rejectApplication = useCallback(async (id: string) => {
    try {
      await api.rejectVendor(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to reject vendor:', error);
      throw error;
    }
  }, [refreshData]);

  return (
    <AdminContext.Provider
      value={{
        applications,
        vendors,
        stats,
        isLoading,
        approveApplication,
        rejectApplication,
        refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
