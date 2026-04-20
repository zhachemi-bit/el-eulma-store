import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, TrendingUp, Package, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { StarBackground } from '@/components/StarBackground';
import { api } from '@/lib/api';

const benefits = [
  { icon: TrendingUp, text: 'Reach customers nationwide' },
  { icon: Package, text: 'Zero setup fees' },
  { icon: Store, text: 'Simple product management' },
  { icon: Truck, text: 'Integrated logistics support' },
];

export function VendorCTA({ embedded = false }: { embedded?: boolean }) {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    api.getPublicStats().then(data => {
      setVendorCount(data.vendors);
    }).catch(console.error);
  }, []);

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    return new Intl.NumberFormat().format(num);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <section id="vendors" className={`relative overflow-hidden ${embedded ? 'py-0' : 'py-20'}`}>
      {!embedded && <StarBackground />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('vendor.title', 'Are You an El Eulma Wholesaler?')}
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              {t('vendor.desc', {
                defaultValue: 'Join {{count}} verified vendors reaching customers across all 58 Algerian wilayas. Expand your business beyond the physical market.',
                count: formatNumber(vendorCount)
              })}
            </p>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-[#27ae60]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-[#27ae60]" />
                  </div>
                  <span className="text-gray-300">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Link to="/become-vendor">
                  <Button
                    size="lg"
                    className="bg-[#27ae60] hover:bg-[#229954] text-white px-8 h-14 text-base group"
                  >
                    {t('vendor.apply', 'Become a Vendor')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              <Link to="/login/vendor">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 h-14 text-base"
                >
                  {t('auth.login', 'Vendor Login')}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#27ae60] rounded-xl flex items-center justify-center">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xl">Vendor Dashboard</h3>
                    <p className="text-gray-400">Manage your business</p>
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#27ae60]">1,234</p>
                    <p className="text-xs text-gray-400">Orders</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#e67e22]">89</p>
                    <p className="text-xs text-gray-400">Products</p>
                  </div>
                  <Link to="/reviews" className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors cursor-pointer block">
                    <p className="text-2xl font-bold text-[#27ae60]">4.9</p>
                    <p className="text-xs text-gray-400">Rating</p>
                  </Link>
                </div>

                {/* Recent Orders Preview */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">Recent Orders</p>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#27ae60]/20 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-[#27ae60]" />
                        </div>
                        <div>
                          <p className="text-white text-sm">Order #{2024000 + i}</p>
                          <p className="text-gray-400 text-xs">2 items • Algiers</p>
                        </div>
                      </div>
                      <span className="text-[#27ae60] text-sm font-medium">
                        {new Intl.NumberFormat('fr-DZ').format(45000 + i * 5000)} DZD
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#27ae60]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#e67e22]/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
