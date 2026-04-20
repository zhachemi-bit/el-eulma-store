import { motion } from 'framer-motion';
import { ShieldCheck, Tag, Truck, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  Tag,
  Truck,
  Banknote,
};

export function Features() {
  const { t } = useTranslation();

  const featuresList = [
    {
      id: '1',
      icon: 'ShieldCheck',
      title: t('features.feat1_title', 'Verified Vendors'),
      description: t('features.feat1_desc'),
    },
    {
      id: '2',
      icon: 'Tag',
      title: t('features.feat2_title', 'Wholesale Prices'),
      description: t('features.feat2_desc'),
    },
    {
      id: '3',
      icon: 'Truck',
      title: t('features.feat3_title', '58 Wilayas Covered'),
      description: t('features.feat3_desc'),
    },
    {
      id: '4',
      icon: 'Banknote',
      title: t('features.feat4_title', 'Cash on Delivery'),
      description: t('features.feat4_desc'),
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
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
            {t('features.title')}
          </h2>
          <p className="text-lg text-[#5d6d7e] max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1 + 0.2,
                      ease: [0.68, -0.55, 0.265, 1.55]
                    }}
                    className="w-16 h-16 bg-[#27ae60]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#27ae60]/20 transition-colors"
                  >
                    <Icon className="w-8 h-8 text-[#27ae60]" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[#2c3e50] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#5d6d7e] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
