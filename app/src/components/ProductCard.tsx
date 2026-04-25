import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Check, Share2, MapPin, Store, ExternalLink } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { wilayas } from '@/data/wilayas';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, setIsOpen } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const isWishlisted = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.minOrderQuantity || 1,
      image: product.image,
      vendorName: product.vendor.name,
      minOrderQuantity: product.minOrderQuantity || 1,
    });

    toast.success(`${product.name} added to cart!`, {
      description: 'Click to view your cart',
      action: {
        label: 'View Cart',
        onClick: () => setIsOpen(true),
      },
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to save favorites');
      return;
    }

    toggleFavorite(product);
    if (isWishlisted) {
      toast.success(`Removed from favorites`);
    } else {
      toast.success(`${product.name} added to favorites!`, {
        icon: '❤️',
      });
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-red-600 text-white font-black border-0 animate-pulse">
                  {t('products.liquidation_badge')} -{discount}%
                </Badge>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0">
                  Low Stock
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {/* Wishlist Button */}
              <button
                onClick={handleToggleFavorite}
                className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${
                  isWishlisted 
                    ? 'bg-red-50 hover:bg-red-100' 
                    : 'bg-white/90 hover:bg-white'
                }`}
              >
                <Heart 
                  className={`w-4 h-4 transition-all duration-200 ${
                    isWishlisted 
                      ? 'fill-red-500 text-red-500 scale-110' 
                      : 'text-gray-600 hover:text-red-400'
                  }`}
                />
              </button>

              {/* Vendor Share/Info Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4 text-[#27ae60] hover:text-[#229954]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-72 p-0 overflow-hidden border-none shadow-2xl rounded-xl"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <div className="bg-[#27ae60] p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Store className="w-5 h-5" />
                      <h4 className="font-bold">{product.vendor.name}</h4>
                    </div>
                    <p className="text-xs text-white/80">{t('vendor.verified_wholesaler', 'Verified Wholesaler')}</p>
                  </div>
                  <div className="p-4 bg-white space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#27ae60] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#2c3e50]">
                          {wilayas.find(w => w.id === product.vendor.wilaya)?.name || product.vendor.wilaya}
                        </p>
                        <p className="text-xs text-[#5d6d7e]">{product.vendor.location}</p>
                      </div>
                    </div>
                    
                    {product.vendor.latitude && product.vendor.longitude && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-3">
                          <span className="text-[10px] font-mono text-[#5d6d7e]">
                            {product.vendor.latitude.toFixed(5)}, {product.vendor.longitude.toFixed(5)}
                          </span>
                          <span className="text-[10px] font-bold text-[#27ae60] uppercase tracking-tighter">GPS Active</span>
                        </div>
                        <Button 
                          asChild
                          className="w-full bg-[#27ae60] hover:bg-[#229954] text-white h-9 text-xs"
                        >
                          <a 
                            href={`https://www.google.com/maps?q=${product.vendor.latitude},${product.vendor.longitude}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-2" />
                            {t('vendor.open_in_maps', 'Open in Google Maps')}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Quick Add Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-3 right-3"
            >
              <Button
                onClick={handleAddToCart}
                variant={isHovered ? "default" : "outline"}
                className={`w-full transition-all duration-300 ${isHovered ? 'bg-[#27ae60] hover:bg-[#229954] text-white shadow-lg shadow-[#27ae60]/30' : 'border-[#27ae60]/50 text-[#27ae60] bg-white/90'}`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('products.add_to_cart', 'Add to Cart')}
              </Button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Vendor */}
            <div className="flex items-center gap-1 mb-2">
              <Check className="w-3 h-3 text-[#27ae60]" />
              <span className="text-xs text-[#5d6d7e]">{product.vendor.name}</span>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-[#2c3e50] line-clamp-2 mb-2 group-hover:text-[#27ae60] transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                      }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-[#5d6d7e]">
                {product.rating > 0 ? (
                  <>
                    <span className="font-semibold text-gray-700 mr-1">{Number(product.rating).toFixed(1)}</span>
                    ({product.reviewCount})
                  </>
                ) : (
                  <span>New</span>
                )}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#27ae60]">
                {formatPrice(product.price)} DZD
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#5d6d7e] line-through">
                  {formatPrice(product.originalPrice)} DZD
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
              {product.stock > 0 ? (
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] text-[#27ae60] border-[#27ae60]/30 bg-[#27ae60]/5 px-2 py-0">
                    In Stock ({product.stock})
                  </Badge>
                  {product.minOrderQuantity > 1 && (
                    <span className="text-[10px] font-bold text-[#e67e22]">
                      Min: {product.minOrderQuantity}
                    </span>
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="text-[10px] text-red-500 border-red-200 bg-red-50 px-2 py-0">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
