import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Plus, X, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function ReviewsPage() {
  const { isAuthenticated, user } = useAuth();
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

  const location = useLocation();

  useEffect(() => {
    fetchTestimonials();
    
    // Auto-open modal if requested via query param
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      if (isAuthenticated) {
        setIsModalOpen(true);
      } else {
        toast.error(t('auth.login_required', 'Please login to leave a review'));
      }
    }
  }, [location.search, isAuthenticated]);

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
      return toast.error(t('testimonials.error_fields', 'Please fill in all fields.'));
    }
    
    setIsSubmitting(true);
    try {
      const newT = await api.addTestimonial({
        name: user?.name || 'Anonymous',
        location: formParams.location,
        quote: formParams.quote,
        rating: formParams.rating
      });
      setTestimonials([newT, ...testimonials]); 
      setIsModalOpen(false);
      toast.success(t('testimonials.success_msg', 'Thank you for your feedback!'));
      setFormParams({ location: '', quote: '', rating: 5 });
    } catch(err: any) {
      toast.error(err.message || t('testimonials.error_msg', 'Failed to submit feedback.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('nav.home', 'Back to Home')}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2c3e50] mb-2">
              {t('testimonials.title', 'Customer Reviews')}
            </h1>
            <p className="text-lg text-[#5d6d7e]">
              {t('testimonials.subtitle', 'What our community thinks about El Eulma Store')}
            </p>
          </div>
          
          <Button 
            onClick={() => isAuthenticated ? setIsModalOpen(true) : toast.error(t('auth.login_required', 'Please login to leave a review'))} 
            className="bg-[#27ae60] hover:bg-[#229954] text-white h-12 px-8 text-base shadow-lg shadow-[#27ae60]/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('testimonials.leave_feedback', 'New Feedback')}
          </Button>
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-8 h-64 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Quote className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-[#5d6d7e] text-lg">{t('testimonials.no_reviews', 'No feedback yet.')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[#5d6d7e] leading-relaxed mb-8 flex-grow">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#27ae60] to-[#229954] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2c3e50]">{testimonial.name}</p>
                    <p className="text-sm text-[#5d6d7e]">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#2c3e50] mb-2">{t('testimonials.leave_feedback')}</h3>
                <p className="text-[#5d6d7e] mb-8">{t('testimonials.modal_subtitle', 'We value your opinion and experience.')}</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('testimonials.field_location', 'Your Location')}</label>
                    <input 
                      required
                      className="w-full border-gray-200 border rounded-xl px-4 py-3 outline-none focus:border-[#27ae60] focus:ring-1 focus:ring-[#27ae60] transition-all"
                      placeholder="e.g. Algiers"
                      value={formParams.location}
                      onChange={e => setFormParams({...formParams, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('testimonials.rating')}</label>
                    <div className="flex gap-3">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <button
                           key={star}
                           type="button"
                           onClick={() => setFormParams({ ...formParams, rating: star })}
                           className="focus:outline-none transition-transform hover:scale-110"
                         >
                           <Star className={`w-8 h-8 ${star <= formParams.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                         </button>
                       ))}
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('testimonials.field_review', 'Your Review')}</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full border-gray-200 border rounded-xl px-4 py-3 outline-none focus:border-[#27ae60] focus:ring-1 focus:ring-[#27ae60] transition-all resize-none"
                      placeholder="Tell us about your experience..."
                      value={formParams.quote}
                      onChange={e => setFormParams({...formParams, quote: e.target.value})}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-[#27ae60] hover:bg-[#229954] text-white h-14 text-lg font-bold rounded-xl mt-4">
                    {isSubmitting ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : null}
                    {t('testimonials.submit', 'Submit Feedback')}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
