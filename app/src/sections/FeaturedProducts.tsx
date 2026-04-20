import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { useTranslation } from 'react-i18next';

export function FeaturedProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts({ limit: 40 });
        setAllProducts(data);
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length <= 4) return;
    const interval = setInterval(() => {
      setStartIndex(prev => (prev + 4 >= allProducts.length ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [allProducts]);

  useEffect(() => {
    if (allProducts.length > 0) {
      setProducts(allProducts.slice(startIndex, startIndex + 4));
    }
  }, [startIndex, allProducts]);

  return (
    <section className="py-20 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2c3e50] mb-2">
              {t('products.featured_title', 'Featured Products')}
            </h2>
            <p className="text-lg text-[#5d6d7e]">
              {t('products.featured_subtitle', "Best deals from El Eulma's top wholesalers")}
            </p>
          </div>
          <Link to="/products">
            <Button 
              variant="ghost" 
              className="text-[#27ae60] hover:text-[#229954] hover:bg-[#27ae60]/10 group"
            >
              {t('products.view_all', 'View All Products')}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#27ae60]" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
