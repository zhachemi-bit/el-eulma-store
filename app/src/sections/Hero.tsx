import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShoppingBag, Store, MapPin, Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShaderBackground } from '@/components/ShaderBackground';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export function Hero() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [realStats, setRealStats] = useState({ products: 0, vendors: 0, wilayas: 58 });

  useEffect(() => {
    api.getPublicStats().then(data => {
      setRealStats(data);
    }).catch(console.error);
  }, []);

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    return new Intl.NumberFormat().format(num);
  };

  const stats = [
    { icon: Store, value: formatNumber(realStats.vendors), label: t('stats.vendors') },
    { icon: ShoppingBag, value: formatNumber(realStats.products), label: t('stats.products') },
    { icon: MapPin, value: realStats.wilayas.toString(), label: t('stats.wilayas') },
    { icon: Truck, value: '48h', label: t('stats.delivery') }
  ];

  return (
    <section id="home" className="relative min-h-screen pt-20 lg:pt-0 overflow-hidden">
      {/* Interactive Circles Background */}
      <ShaderBackground overlayOpacity={0.35} />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-[1] pointer-events-none" />

      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full py-12 lg:py-0">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6"
              >
                <span className="w-2 h-2 bg-[#2ecc71] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#2ecc71]">
                  {t('hero.badge')}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg"
              >
                {t('hero.title')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <Link to="/products">
                  <Button 
                    size="lg" 
                    className="bg-[#27ae60] hover:bg-[#229954] text-white px-8 h-14 text-base group shadow-lg shadow-[#27ae60]/30"
                  >
                    {t('hero.cta')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/signup/vendor">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-2 border-white/40 text-white bg-transparent hover:bg-white/10 backdrop-blur-sm px-8 h-14 text-base"
                    >
                      {t('hero.become_vendor')}
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-10"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                      <stat.icon className="w-5 h-5 text-[#2ecc71]" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/60">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                  <img
                    src="/images/hero/hero-main.jpg"
                    alt="El Eulma Wholesale Warehouse - Massive Storage Facility"
                    className="w-full h-auto object-cover"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Floating Cards - Glassmorphism */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl p-4 hidden lg:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#27ae60]/20 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#2ecc71]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Fast Delivery</p>
                      <p className="text-xs text-white/60">24-48h to major cities</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl p-4 hidden lg:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#e67e22]/20 rounded-full flex items-center justify-center">
                      <Store className="w-6 h-6 text-[#f39c12]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Verified Vendors</p>
                      <p className="text-xs text-white/60">{formatNumber(realStats.vendors)} trusted sellers</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
