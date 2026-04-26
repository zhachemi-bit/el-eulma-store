import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Quote, Loader2, Pin, Trash2, MessageSquare, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Testimonials() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

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

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast.success('Testimonial deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const updated = await api.togglePinTestimonial(id);
      setTestimonials(prev => prev.map(t => t.id === id ? updated : t).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)));
      toast.success(updated.isPinned ? 'Testimonial pinned to top' : 'Testimonial unpinned');
    } catch (err) {
      toast.error('Failed to pin');
    }
  };

  return (
    <section className="py-24 bg-[#f8f9fa] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -ml-48 -mb-48 opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#27ae60] rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Badge variant="outline" className="text-[#27ae60] border-[#27ae60] bg-white text-[10px] font-bold uppercase tracking-widest px-3">
                Community Feedback
              </Badge>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2c3e50] mb-4">
              Wholesale Community <span className="text-[#27ae60]">Voice</span>
            </h2>
            <p className="text-xl text-[#5d6d7e] max-w-2xl leading-relaxed">
              Feedback from thousands of business partners across Algeria. We grow together by listening to our users.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
             <Link to="/reviews">
                <Button className="bg-[#27ae60] hover:bg-[#229954] text-white px-8 h-12 rounded-xl shadow-lg shadow-green-200">
                  <MessageSquare className="w-4 h-4 mr-2" /> 
                  Share Your Story
                </Button>
             </Link>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-[#27ae60] animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Quote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-[#5d6d7e]">No feedback yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className={`h-full bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border ${testimonial.isPinned ? 'border-[#27ae60] ring-1 ring-[#27ae60]/20' : 'border-gray-100'}`}>
                    {/* Admin Actions Overlay */}
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          onClick={() => handleTogglePin(testimonial.id)}
                          className={`p-2 rounded-full shadow-md transition-colors ${testimonial.isPinned ? 'bg-[#27ae60] text-white' : 'bg-white text-gray-400 hover:text-[#27ae60]'}`}
                          title="Pin/Unpin"
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Pin Badge */}
                    {testimonial.isPinned && (
                      <div className="absolute top-6 left-8 flex items-center gap-1.5 text-[#27ae60] font-bold text-[10px] uppercase tracking-widest bg-[#27ae60]/10 px-3 py-1 rounded-full">
                        <Pin className="w-3 h-3" /> Featured Voice
                      </div>
                    )}

                    <div className={`mt-${testimonial.isPinned ? '8' : '0'}`}>
                      {/* Quote Mark */}
                      <Quote className="w-10 h-10 text-[#27ae60]/10 mb-4" />

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-[#2c3e50] text-lg leading-relaxed mb-8 font-medium italic">
                        "{testimonial.quote}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4 mt-auto border-t pt-6 border-gray-50">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#27ae60] to-[#2ecc71] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner shadow-black/10">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-[#2c3e50]">{testimonial.name}</p>
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                          </div>
                          <p className="text-sm text-[#5d6d7e] flex items-center gap-1">
                             <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-medium text-[10px] h-5">
                               Partner
                             </Badge>
                             <span className="opacity-50">•</span>
                             {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-around gap-12"
        >
          <div className="text-center group">
            <p className="text-3xl font-black text-[#2c3e50] group-hover:text-[#27ae60] transition-colors">4.9/5</p>
            <p className="text-sm text-[#5d6d7e] font-medium uppercase tracking-widest">Average Satisfaction</p>
          </div>
          <div className="h-10 w-[1px] bg-gray-100 hidden md:block" />
          <div className="text-center group">
            <p className="text-3xl font-black text-[#2c3e50] group-hover:text-[#27ae60] transition-colors">15,000+</p>
            <p className="text-sm text-[#5d6d7e] font-medium uppercase tracking-widest">Active Partners</p>
          </div>
          <div className="h-10 w-[1px] bg-gray-100 hidden md:block" />
          <div className="text-center group">
             <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
             </div>
             <p className="text-sm text-[#5d6d7e] font-medium uppercase tracking-widest mt-1">Verified Trust</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
