import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Product } from '@/types';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Load favorites from localStorage on mount or user change
  useEffect(() => {
    if (isAuthenticated && user) {
      const stored = localStorage.getItem(`eleulma_favorites_${user.id}`);
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user, isAuthenticated]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`eleulma_favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user, isAuthenticated]);

  const addFavorite = useCallback((product: Product) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId));
  }, []);

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.some(p => p.id === productId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    if (user) {
      localStorage.removeItem(`eleulma_favorites_${user.id}`);
    }
  }, [user]);

  const totalFavorites = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        totalFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
