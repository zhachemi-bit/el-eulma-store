import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Quote, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function Testimonials() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formParams, setFormParams] = useState({
    location: '',
    quote: '',
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await api.getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formParams.location || !formParams.quote) {
      return toast.error("Please fill in logic fields.");
    }
    
    setIsSubmitting(true);
    try {
      const newT = await api.addTestimonial({
        name: user?.name || 'Anonymous',
        location: formParams.location,
        quote: formParams.quote,
        rating: formParams.rating
      });
      // Prepend cleanly to state
      setTestimonials([newT, ...testimonials].slice(0, 6)); 
      setIsModalOpen(false);
      toast.success("Thank you for your feedback!");
      setFormParams({ location: '', quote: '', rating: 5 });
    } catch(err: any) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2c3e50] mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-[#5d6d7e] max-w-2xl mx-auto mb-6">
            {t('testimonials.subtitle')}
          </p>
          <Link to="/reviews">
            <Button className="bg-[#27ae60] hover:bg-[#229954] text-white">
              <Plus className="w-4 h-4 mr-2" /> {t('testimonials.leave_feedback')}
            </Button>
          </Link>
        </motion.div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 text-[#27ae60] animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#5d6d7e]">No feedback yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-[#f8f9fa] rounded-2xl p-8 h-full">
                {/* Quote Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1 + 0.2,
                    ease: [0.68, -0.55, 0.265, 1.55]
                  }}
                  className="w-12 h-12 bg-[#27ae60]/10 rounded-full flex items-center justify-center mb-6"
                >
                  <Quote className="w-6 h-6 text-[#27ae60]" />
                </motion.div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#5d6d7e] leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#27ae60] rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2c3e50]">{testimonial.name}</p>
                    <p className="text-sm text-[#5d6d7e]">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <Link to="/reviews">
            <Button variant="outline" className="border-[#27ae60] text-[#27ae60] hover:bg-[#27ae60] hover:text-white px-8">
              {t('products.view_all', 'View All Reviews')}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2c3e50] mb-4">Leave Feedback</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Location (City/Wilaya)</label>
                    <input 
                      required
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:border-[#27ae60]"
                      placeholder="e.g. Algiers"
                      value={formParams.location}
                      onChange={e => setFormParams({...formParams, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <button
                           key={star}
                           type="button"
                           onClick={() => setFormParams({ ...formParams, rating: star })}
                           className="focus:outline-none"
                         >
                           <Star className={`w-6 h-6 ${star <= formParams.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                         </button>
                       ))}
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:border-[#27ae60]"
                      placeholder="Share your experience..."
                      value={formParams.quote}
                      onChange={e => setFormParams({...formParams, quote: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-[#27ae60] hover:bg-[#229954] text-white h-12 mt-4">
                    {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                    Submit Feedback
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
