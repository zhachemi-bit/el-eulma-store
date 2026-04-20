import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { api } from '@/lib/api';

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  );
}

export function Statistics() {
  const { t } = useTranslation();
  
  const [liveStats, setLiveStats] = useState({
    vendors: 4,
    products: 24,
    wilayas: 58,
    delivery: 48
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getPublicStats();
        setLiveStats({
          ...liveStats,
          vendors: data.vendors,
          products: data.products,
          wilayas: data.wilayas || 58
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    fetchStats();
    
    // Refresh every 30 seconds to keep it "live" as requested
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: liveStats.vendors, suffix: '+', label: t('stats.vendors') },
    { value: liveStats.products, suffix: '+', label: t('stats.products') },
    { value: liveStats.wilayas, suffix: '', label: t('stats.wilayas') },
    { value: liveStats.delivery, suffix: 'h', label: t('stats.delivery') },
  ];

  return (
    <section className="py-16 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl sm:text-5xl font-bold text-[#27ae60] mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-[#5d6d7e]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
