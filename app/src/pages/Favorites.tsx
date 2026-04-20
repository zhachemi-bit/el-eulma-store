import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { addItem, setIsOpen } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price);
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      vendorName: product.vendor?.name || 'Vendor',
    });
    toast.success(`${product.name} added to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => setIsOpen(true),
      },
    });
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFavorite(productId);
    toast.success(`${productName} removed from favorites`);
  };

  if (!isAuthenticated) {
    return (
      <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-[#2c3e50] mb-4">Your Favorites</h1>
            <p className="text-[#5d6d7e] mb-8 text-lg">
              Sign in to save and view your favorite products
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-[#27ae60] hover:bg-[#229954] text-white px-8 h-12">
                Sign In to Continue
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[#5d6d7e] hover:text-[#27ae60] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Products</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2c3e50] mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                My Favorites
              </h1>
              <p className="text-[#5d6d7e]">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {favorites.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  clearFavorites();
                  toast.success('All favorites cleared');
                }}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-sm"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-red-300" />
            </div>
            <h2 className="text-xl font-bold text-[#2c3e50] mb-3">No favorites yet</h2>
            <p className="text-[#5d6d7e] mb-6 max-w-md mx-auto">
              Browse products and tap the heart icon to save your favorite items here.
            </p>
            <Link to="/products">
              <Button className="bg-[#27ae60] hover:bg-[#229954] text-white px-8 h-12">
                Browse Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {favorites.map((product, index) => {
                const discount = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Image */}
                      <Link to={`/products/${product.id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {discount > 0 && (
                            <Badge className="absolute top-3 left-3 bg-[#e67e22] text-white border-0">
                              -{discount}%
                            </Badge>
                          )}
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemove(product.id, product.name);
                            }}
                            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors group/btn"
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-xs text-[#5d6d7e]">{product.vendor?.name}</span>
                        </div>

                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-semibold text-[#2c3e50] line-clamp-2 mb-2 hover:text-[#27ae60] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-[#5d6d7e]">({product.reviewCount})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold text-[#27ae60]">
                            {formatPrice(product.price)} DZD
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-[#5d6d7e] line-through">
                              {formatPrice(product.originalPrice)} DZD
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-[#27ae60] hover:bg-[#229954] text-white h-10"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemove(product.id, product.name)}
                            className="h-10 w-10 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
