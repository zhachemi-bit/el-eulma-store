import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="w-5 h-5 text-[#27ae60]" />
            Shopping Cart
            {totalItems > 0 && (
              <span className="text-sm font-normal text-[#5d6d7e]">
                ({totalItems} items)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">
              Your cart is empty
            </h3>
            <p className="text-[#5d6d7e] mb-6 max-w-xs">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button 
              onClick={() => setIsOpen(false)}
              className="bg-[#27ae60] hover:bg-[#229954] text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="py-4"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#2c3e50] line-clamp-2 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#5d6d7e] mt-1">
                          {item.vendorName}
                        </p>
                        <p className="text-sm font-semibold text-[#27ae60] mt-1">
                          {formatPrice(item.price)} DZD
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t pt-4 mt-auto space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5d6d7e]">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)} DZD</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5d6d7e]">Shipping</span>
                <span className="text-[#27ae60]">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#2c3e50]">Total</span>
                <span className="text-xl font-bold text-[#27ae60]">
                  {formatPrice(totalPrice)} DZD
                </span>
              </div>

              <div className="space-y-2">
                <Link to="/checkout" onClick={handleCheckout}>
                  <Button className="w-full bg-[#27ae60] hover:bg-[#229954] text-white h-12">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12"
                >
                  Continue Shopping
                </Button>
              </div>

              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 text-center w-full"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
