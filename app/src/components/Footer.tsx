import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Instagram,
  MessageCircle
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { StarBackground } from './StarBackground';

export function Footer({ embedded = false }: { embedded?: boolean }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const quickLinks = [
    { name: t('nav.about', 'About Us'), href: '/#about' },
    { name: t('nav.how_it_works', 'How It Works'), href: '/#how-it-works' },
    { name: t('vendor.apply', 'Become a Vendor'), href: '/#vendors' },
    { name: t('footer.reviews', 'Customer Reviews'), href: '/reviews' },
    { name: t('footer.shipping', 'Shipping Info'), href: '/shipping' },
    { name: t('footer.returns', 'Returns Policy'), href: '/returns' },
    { name: 'FAQ', href: '/faq' },
  ];

  const categoriesList = [
    { name: t('footer.electronics', 'Electronics'), href: '/products?category=electronics' },
    { name: t('footer.appliances', 'Home Appliances'), href: '/products?category=appliances' },
    { name: t('footer.kitchen', 'Kitchen'), href: '/products?category=kitchen' },
    { name: t('footer.phones', 'Phones & Tablets'), href: '/products?category=phones' },
    { name: t('footer.computing', 'Computing'), href: '/products?category=computing' },
    { name: t('footer.home_decor', 'Home Decor'), href: '/products?category=home-decor' },
  ];
  
  const activeLinks = user?.role === 'vendor' 
    ? quickLinks.filter(link => link.name !== t('vendor.apply'))
    : quickLinks;

  return (
    <footer className={`relative overflow-hidden text-white ${embedded ? 'bg-transparent pt-0' : 'bg-[#2c3e50]'}`}>
      {!embedded && <StarBackground />}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 ${embedded ? 'pt-0' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#27ae60] rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{t('site_name', 'El Eulma Store')}</h3>
                <p className="text-xs text-gray-400">Algeria's Digital Wholesale Marketplace</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {t('footer.desc', "Connecting El Eulma's wholesalers to customers across all 58 Algerian wilayas. Shop electronics, appliances, and home goods at wholesale prices.")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#27ae60] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#27ae60] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            <Link
              to="/reviews?new=true"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#27ae60] transition-colors"
              title={t('footer.reviews', 'Customer Reviews')}
            >
              <MessageCircle className="w-4 h-4" />
            </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">{t('footer.quick_links', 'Quick Links')}</h4>
            <ul className="space-y-3">
              {activeLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#27ae60] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">{t('nav.categories', 'Categories')}</h4>
            <ul className="space-y-3">
              {categoriesList.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.href}
                    className="text-gray-400 hover:text-[#27ae60] transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact', 'Contact Us')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#27ae60] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">contact@eleulmastore.dz</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#27ae60] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">+213 555 123 456</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#27ae60] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Dubai Street, El Eulma, Sétif, Algeria
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#27ae60] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  {t('footer.hours', 'Sun-Thu: 9AM - 6PM')}
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {t('site_name', 'El Eulma Store')}. {t('footer.rights', 'All rights reserved.')}
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-[#27ae60] text-sm transition-colors">
                {t('footer.privacy', 'Data Protection')}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-[#27ae60] text-sm transition-colors">
                {t('footer.terms', 'Operational Terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
