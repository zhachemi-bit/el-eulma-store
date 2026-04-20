import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Product } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

interface VendorContextType {
  vendorProducts: Product[];
  vendorStats: any;
  isLoading: boolean;
  addProduct: (productData: any) => Promise<void>;
  updateProduct: (id: string, updates: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [vendorStats, setVendorStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const refreshProducts = useCallback(async () => {
    if (!user?.vendorId) {
      setVendorProducts([]);
      setVendorStats(null);
      return;
    }
    setIsLoading(true);
    try {
      const [products, stats] = await Promise.all([
        api.getProducts({ vendorId: user.vendorId, limit: 100 }),
        api.getVendorStats()
      ]);
      setVendorProducts(products);
      setVendorStats(stats);
    } catch (error) {
      console.error('Failed to fetch vendor data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addProduct = useCallback(async (productData: any) => {
    try {
      await api.createProduct(productData);
      await refreshProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  }, [refreshProducts]);

  const updateProduct = useCallback(async (id: string, updates: any) => {
    try {
      await api.updateProduct(id, updates);
      await refreshProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await api.deleteProduct(id);
      await refreshProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }, [refreshProducts]);

  return (
    <VendorContext.Provider
      value={{
        vendorProducts,
        vendorStats,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
}
