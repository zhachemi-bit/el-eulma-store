import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  Star,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Loader2,
  MapPin,
  Store,
  ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { wilayas } from '@/data/wilayas';
import type { Product } from '@/types';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, setIsOpen } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await api.getProductById(id);
        setProduct(data);
        // Set initial quantity to minOrderQuantity
        setQuantity(data.minOrderQuantity || 1);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#27ae60] mx-auto mb-4" />
          <p className="text-[#5d6d7e]">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-[#2c3e50] mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      vendorName: product.vendor.name,
      minOrderQuantity: product.minOrderQuantity,
    });
    
    toast.success(t('products.added_to_cart', { name: product.name }), {
      action: {
        label: t('products.view_cart'),
        onClick: () => setIsOpen(true),
      },
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmittingReview(true);
    try {
      const newReview = await api.addReview(product.id, reviewForm);
      setProduct({
        ...product,
        reviews: [newReview, ...(product.reviews || [])],
        reviewCount: product.reviewCount + 1,
        rating: ((product.rating * product.reviewCount) + newReview.rating) / (product.reviewCount + 1)
      });
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price);
  };

  return (
    <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link 
            to="/products" 
            className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-square relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-[#e67e22] text-white">
                    -{discount}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Vendor */}
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-4 h-4 text-[#27ae60]" />
              <span className="text-sm text-[#5d6d7e]">{product.vendor.name}</span>
              {product.vendor.verified && (
                <Badge variant="secondary" className="text-xs bg-[#27ae60]/10 text-[#27ae60]">
                  Verified
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2c3e50] mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#5d6d7e]">
                {product.rating > 0 ? (
                  <>
                    <span className="font-semibold text-gray-700 mr-1">{Number(product.rating).toFixed(1)}</span>
                    ({product.reviewCount} reviews)
                  </>
                ) : (
                  <span>No reviews yet</span>
                )}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-[#27ae60]">
                {formatPrice(product.price)} DZD
              </span>
              {product.originalPrice && (
                <span className="text-xl text-[#5d6d7e] line-through">
                  {formatPrice(product.originalPrice)} DZD
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#5d6d7e] mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <Badge className="bg-[#27ae60]/10 text-[#27ae60] border-[#27ae60]/30">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#2c3e50]">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrderQuantity || 1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {product.minOrderQuantity > 1 && (
                <p className="text-xs text-[#e67e22] font-medium">
                  {t('products.min_order', { count: product.minOrderQuantity })}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-[#27ae60] hover:bg-[#229954] text-white h-14 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                {t('products.add_to_cart', 'Add to Cart')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error(t('products.signin_favorites'));
                    return;
                  }
                  if (product) {
                    toggleFavorite(product);
                    if (isFavorite(product.id)) {
                      toast.success('Removed from favorites');
                    } else {
                      toast.success(`${product.name} added to favorites!`, { icon: '❤️' });
                    }
                  }
                }}
                className={`w-14 h-14 ${
                  product && isFavorite(product.id)
                    ? 'border-red-200 bg-red-50 hover:bg-red-100'
                    : ''
                }`}
              >
                <Heart className={`w-5 h-5 ${product && isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-14 h-14">
                    <Share2 className="w-5 h-5 text-[#27ae60]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-80 p-0 overflow-hidden border-none shadow-2xl rounded-2xl"
                  align="end"
                >
                  <div className="bg-[#27ae60] p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Store className="w-20 h-20" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Store className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-tight">{product.vendor.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Check className="w-3 h-3 text-white fill-white/20" />
                            <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Verified Wholesaler</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-[#27ae60]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2c3e50]">
                            {wilayas.find(w => w.id === product.vendor.wilaya)?.name || product.vendor.wilaya}
                          </p>
                          <p className="text-xs text-[#5d6d7e] mt-0.5">{product.vendor.location}</p>
                        </div>
                      </div>
                    </div>

                    {product.vendor.latitude && product.vendor.longitude && (
                      <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-[#5d6d7e] uppercase tracking-wider">GPS Coordinates</span>
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          </div>
                          <p className="text-sm font-mono text-[#27ae60] font-bold tracking-tight">
                            {product.vendor.latitude.toFixed(6)}, {product.vendor.longitude.toFixed(6)}
                          </p>
                        </div>
                        <Button 
                          asChild
                          className="w-full bg-[#27ae60] hover:bg-[#229954] text-white h-12 rounded-xl shadow-lg shadow-[#27ae60]/20"
                        >
                          <a 
                            href={`https://www.google.com/maps?q=${product.vendor.latitude},${product.vendor.longitude}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {t('vendor.open_in_maps', 'Navigate to Store')}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-white rounded-xl">
                <Truck className="w-6 h-6 text-[#27ae60] mx-auto mb-2" />
                <p className="text-xs text-[#5d6d7e]">Free Delivery</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl">
                <Shield className="w-6 h-6 text-[#27ae60] mx-auto mb-2" />
                <p className="text-xs text-[#5d6d7e]">Verified Vendor</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl">
                <RotateCcw className="w-6 h-6 text-[#27ae60] mx-auto mb-2" />
                <p className="text-xs text-[#5d6d7e]">7-Day Returns</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="specs" className="flex-1">Specifications</TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
                <TabsTrigger value="returns" className="flex-1">Returns</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="specs" className="mt-4">
                <div className="bg-white rounded-xl p-6">
                  {product.specifications ? (
                    <dl className="space-y-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-[#5d6d7e]">{key}</dt>
                          <dd className="font-medium text-[#2c3e50]">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-[#5d6d7e]">No specifications available.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4">
                <div className="bg-white rounded-xl p-6">
                  <p className="text-[#5d6d7e] leading-relaxed">
                    We deliver to all 58 Algerian wilayas. Delivery times vary by location:
                  </p>
                  <ul className="mt-4 space-y-2 text-[#5d6d7e]">
                    <li>• Major cities (Algiers, Oran, Constantine): 24-48 hours</li>
                    <li>• Other northern wilayas: 2-4 days</li>
                    <li>• Southern wilayas: 4-7 days</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="returns" className="mt-4">
                <div className="bg-white rounded-xl p-6">
                  <p className="text-[#5d6d7e] leading-relaxed">
                    We offer a 7-day return policy for all products. Items must be:
                  </p>
                  <ul className="mt-4 space-y-2 text-[#5d6d7e]">
                    <li>• In original condition</li>
                    <li>• With all accessories and packaging</li>
                    <li>• Accompanied by the original receipt</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="bg-white rounded-xl p-6">
                  {isAuthenticated ? (
                    <form onSubmit={handleReviewSubmit} className="mb-8">
                      <h3 className="font-semibold text-[#2c3e50] mb-4">Leave a Review</h3>
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="w-full border rounded-lg p-3 mb-3"
                        rows={3}
                        placeholder="Write your comment..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      />
                      <Button type="submit" disabled={isSubmittingReview} className="bg-[#27ae60] hover:bg-[#229954] text-white">
                        {isSubmittingReview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Submit Review
                      </Button>
                    </form>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center text-[#5d6d7e]">
                      Please <Link to="/login" className="text-[#27ae60] font-medium">login</Link> to leave a review.
                    </div>
                  )}

                  <div className="space-y-6">
                    <h3 className="font-semibold text-[#2c3e50] mb-4">Customer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review: any) => (
                        <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-[#2c3e50]">{review.user.name}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{Number(product.rating).toFixed(1)}</span>
                              <span className="text-sm text-[#5d6d7e]">({product.reviewCount} reviews)</span>
                            </div>
                            <span className="text-xs text-[#5d6d7e]">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          {review.comment && <p className="text-[#5d6d7e] text-sm mt-2">{review.comment}</p>}
                        </div>
                      ))
                    ) : (
                      <p className="text-[#5d6d7e] text-center mb-4">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
