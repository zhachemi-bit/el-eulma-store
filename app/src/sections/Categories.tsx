import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/data/categories';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';

export function Categories() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      const data = await api.getCategoryStats();
      setCounts(data);
    };
    fetchCounts();
  }, []);

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2c3e50] mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-lg text-[#5d6d7e] max-w-2xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link to={`/products?category=${category.id}`}>
                <div className="group relative overflow-hidden rounded-xl aspect-[4/5]">
                  {/* Image */}
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-colors duration-300" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <motion.div
                      initial={{ y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.description}
                      </p>
                      <p className="text-[#27ae60] text-xs mt-2 font-medium">
                        {counts[category.id] || 0} products
                      </p>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
