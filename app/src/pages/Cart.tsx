import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price);
  };

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#2c3e50] mb-4">
              Your cart is empty
            </h1>
            <p className="text-[#5d6d7e] mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our products and find something you like!
            </p>
            <Link to="/products">
              <Button className="bg-[#27ae60] hover:bg-[#229954] text-white px-8 h-12">
                Browse Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/products" 
            className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2c3e50]">
            Shopping Cart ({totalItems} items)
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl overflow-hidden"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border-b last:border-b-0"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2c3e50] mb-1">{item.name}</h3>
                      <p className="text-sm text-[#5d6d7e] mb-2">{item.vendorName}</p>
                      <p className="text-lg font-bold text-[#27ae60]">
                        {formatPrice(item.price)} DZD
                      </p>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (item.quantity > (item.minOrderQuantity || 1)) {
                                  updateQuantity(item.id, item.quantity - 1);
                                } else {
                                  toast.error(`Minimum order is ${item.minOrderQuantity} for this item`);
                                }
                              }}
                              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {item.minOrderQuantity > 1 && (
                            <p className="text-[10px] text-[#e67e22] font-medium">
                              Min pieces: {item.minOrderQuantity}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success('Item removed from cart');
                          }}
                          className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-[#2c3e50]">
                        {formatPrice(item.price * item.quantity)} DZD
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <button
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
              className="mt-4 text-red-500 hover:text-red-600 text-sm"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#2c3e50] mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5d6d7e]">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5d6d7e]">Shipping</span>
                  <span className="text-[#27ae60]">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5d6d7e]">Tax</span>
                  <span className="text-[#5d6d7e]">Included</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-6">
                <span className="text-lg font-semibold text-[#2c3e50]">Total</span>
                <span className="text-2xl font-bold text-[#27ae60]">
                  {formatPrice(totalPrice)} DZD
                </span>
              </div>

              <Link to="/checkout">
                <Button className="w-full bg-[#27ae60] hover:bg-[#229954] text-white h-14 mb-3">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="text-center">
                <p className="text-xs text-[#5d6d7e]">
                  Shipping & taxes calculated at checkout
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-4 text-xs text-[#5d6d7e]">
                  <span>🔒 Secure Checkout</span>
                  <span>✓ Cash on Delivery</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
