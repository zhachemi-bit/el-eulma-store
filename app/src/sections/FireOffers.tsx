import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowRight, Loader2, Zap } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { useTranslation } from 'react-i18next';
import { FireCanvas } from '@/components/FireCanvas';

export function FireOffers() {
  const { t } = useTranslation();
  const [allOffers, setAllOffers] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchFireOffers = async () => {
      try {
        const allProducts = await api.getProducts({ limit: 100 });
        const offers = allProducts
          .filter(p => p.originalPrice && p.originalPrice > p.price)
          .sort((a, b) => {
            const discA = (a.originalPrice! - a.price) / a.originalPrice!;
            const discB = (b.originalPrice! - b.price) / b.originalPrice!;
            return discB - discA;
          });
        setAllOffers(offers);
        setProducts(offers.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch fire offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFireOffers();
  }, []);

  // Professional rotation logic - every 15s
  useEffect(() => {
    if (allOffers.length <= 4) return;

    const interval = setInterval(() => {
      setStartIndex(prev => (prev + 4 >= allOffers.length ? 0 : prev + 1));
    }, 25000);

    return () => clearInterval(interval);
  }, [allOffers]);

  useEffect(() => {
    if (allOffers.length > 0) {
      setProducts(allOffers.slice(startIndex, startIndex + 4));
    }
  }, [startIndex, allOffers]);

  // We removed the "return null" here so the section NEVER disappears from the code or UI.

  return (
    <section className="py-20 relative overflow-hidden bg-black text-white">
      {/* Intense Section Fire Background */}
      <FireCanvas opacity={0.8} transparent={false} />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse shadow-lg backdrop-blur-sm">
              <Flame className="w-10 h-10 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-bounce" />
                <span className="text-yellow-200 uppercase tracking-widest font-black text-sm">
                  {t('home.flash_liquidation', 'Flash Liquidation')}
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-orange-400">
                {t('home.fire_offers', 'Fire Offers 🔥')}
              </h2>
            </div>
          </div>

          <div className="hidden lg:block text-right">
            <p className="text-xl font-black text-orange-100 max-w-md italic uppercase">
              {t('home.fire_desc', "Limited inventory left! High-velocity wholesale items being liquidated right now.")}
            </p>
          </div>

          <Link to="/products">
            <Button className="bg-white text-red-600 hover:bg-yellow-50 font-bold px-8 h-14 text-lg rounded-full shadow-xl group">
              {t('home.view_hot_deals', 'View All Hot Deals')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group h-full"
                >
                  {/* Distinct Fire Frame for Products */}
                  <div className="absolute -inset-1 z-0 rounded-2xl bg-gradient-to-br from-yellow-400 via-red-600 to-orange-500 animate-pulse blur-[1px]" />
                  
                  <div className="absolute -top-3 -left-3 z-30">
                    <Badge className="bg-yellow-400 text-red-700 font-black px-3 py-1 text-sm rounded-lg shadow-lg rotate-[-5deg] animate-bounce">
                      FIRE DEAL
                    </Badge>
                  </div>
                  
                  {/* Wrap ProductCard but override some styles if needed */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative z-10 transition-all hover:shadow-orange-500/20 duration-500">
                    <ProductCard product={product} index={index} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
            <Flame className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold mb-2">Cooling Down...</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Our previous fire deals just sold out! The next batch of massive wholesale liquidations is being prepared. Check back in a few minutes!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </div>
  );
}
