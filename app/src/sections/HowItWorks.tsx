import { motion } from 'framer-motion';
import { Search, ShoppingCart, ClipboardList, PackageCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function HowItWorks() {
  const { t } = useTranslation();
  
  const steps = [
    {
      number: '01',
      icon: Search,
      title: t('how_it_works.step1_title', 'Browse & Compare'),
      description: t('how_it_works.step1_desc'),
    },
    {
      number: '02',
      icon: ShoppingCart,
      title: t('how_it_works.step2_title', 'Add to Cart'),
      description: t('how_it_works.step2_desc'),
    },
    {
      number: '03',
      icon: ClipboardList,
      title: t('how_it_works.step3_title', 'Place Order'),
      description: t('how_it_works.step3_desc'),
    },
    {
      number: '04',
      icon: PackageCheck,
      title: t('how_it_works.step4_title', 'Receive & Pay'),
      description: t('how_it_works.step4_desc'),
    },
  ];
  return (
    <section id="how-it-works" className="py-20 animated-workflow-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('how_it_works.title')}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t('how_it_works.subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-white/20"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step Number & Icon */}
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <step.icon className="w-8 h-8 text-[#27ae60]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#e67e22] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
