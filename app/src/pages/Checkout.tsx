import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, User, CreditCard, Lock, Shield, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { wilayas } from '@/data/wilayas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'processing'>('shipping');
  
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    city: '',
    address: '',
    postalCode: '',
  });

  useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || (user as any).phone || '',
      }));
    }
  }, [user]);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData({ ...paymentData, cardNumber: formatted });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setPaymentData({ ...paymentData, expiryDate: value });
  };

  const validateShipping = () => {
    if (!shippingData.fullName || !shippingData.phone || !shippingData.wilaya || 
        !shippingData.city || !shippingData.address) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (!paymentData.cardNumber || !paymentData.cardHolder || !paymentData.expiryDate || !paymentData.cvv) {
      toast.error('Please fill in all card details');
      return false;
    }
    if (paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Please enter a valid card number');
      return false;
    }
    if (paymentData.cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    if (!user) {
      toast.error('You must be logged in to place an order');
      return;
    }

    setIsSubmitting(true);
    setStep('processing');

    try {
      // 1. Create or ensure shipping address
      const address = await api.createAddress({
        userId: user.id,
        ...shippingData
      });

      // 2. Create order
      await api.createOrder({
        userId: user.id,
        total: totalPrice,
        shippingAddressId: address.id,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })) as any,
      });

      toast.success('Order placed successfully!', {
        description: 'Thank you for shopping with El Eulma Store.',
      });

      clearCart();
      navigate('/');
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
      setStep('payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <LogIn className="w-12 h-12 text-[#27ae60] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#2c3e50] mb-2">Please Login to Continue</h1>
              <p className="text-[#5d6d7e] mb-6">You need to have an account to place an order at El Eulma Store.</p>
              <div className="flex flex-col gap-3">
                <Link to="/login" state={{ from: '/checkout' }}>
                  <Button className="w-full bg-[#27ae60] hover:bg-[#229954]">Log In</Button>
                </Link>
                <Link to="/signup" state={{ from: '/checkout' }}>
                  <Button variant="outline" className="w-full">Create Account</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-[#2c3e50] mb-4">Your cart is empty</h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
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
            to="/cart" 
            className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2c3e50]">
            Checkout
          </h1>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-[#27ae60]' : 'text-[#5d6d7e]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-[#27ae60] text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200">
            <div className={`h-full bg-[#27ae60] transition-all ${step === 'payment' || step === 'processing' ? 'w-full' : 'w-0'}`} />
          </div>
          <div className={`flex items-center gap-2 ${step === 'payment' || step === 'processing' ? 'text-[#27ae60]' : 'text-[#5d6d7e]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' || step === 'processing' ? 'bg-[#27ae60] text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>

        {step === 'processing' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 border-4 border-[#27ae60] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">Processing Payment...</h2>
            <p className="text-[#5d6d7e]">Please do not close this window</p>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {step === 'shipping' ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Shipping Information */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#27ae60]/10 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-[#27ae60]" />
                        </div>
                        <h2 className="text-lg font-semibold text-[#2c3e50]">Contact Information</h2>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            placeholder="Enter your full name"
                            value={shippingData.fullName}
                            onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            placeholder="+213 555 123 456"
                            value={shippingData.phone}
                            onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                            className="h-12"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#27ae60]/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-[#27ae60]" />
                        </div>
                        <h2 className="text-lg font-semibold text-[#2c3e50]">Delivery Address</h2>
                      </div>

                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="wilaya">Wilaya *</Label>
                            <Select
                              value={shippingData.wilaya}
                              onValueChange={(value) => setShippingData({ ...shippingData, wilaya: value })}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select wilaya" />
                              </SelectTrigger>
                              <SelectContent>
                                {wilayas.map((wilaya) => (
                                  <SelectItem key={wilaya.id} value={wilaya.id}>
                                    {wilaya.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              placeholder="Enter your city"
                              value={shippingData.city}
                              onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                              className="h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            placeholder="Street address, building, apartment..."
                            value={shippingData.address}
                            onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                            className="h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code (Optional)</Label>
                          <Input
                            id="postalCode"
                            placeholder="16000"
                            value={shippingData.postalCode}
                            onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                            className="h-12"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button 
                    onClick={handleContinueToPayment}
                    className="w-full bg-[#27ae60] hover:bg-[#229954] h-14"
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Carte Dahabia Payment */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#27ae60]/10 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-[#27ae60]" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-[#2c3e50]">Carte Dahabia</h2>
                          <p className="text-sm text-[#5d6d7e]">Secure payment with your Algerian bank card</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[#27ae60] to-[#229954] rounded-xl p-6 mb-6 text-white">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-12 h-8 bg-yellow-400/30 rounded" />
                          <div className="text-right">
                            <p className="text-xs opacity-80">Dahabia</p>
                          </div>
                        </div>
                        <p className="text-2xl font-mono tracking-wider mb-4">
                          {paymentData.cardNumber || '#### #### #### ####'}
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs opacity-70">Card Holder</p>
                            <p className="font-medium">{paymentData.cardHolder || 'YOUR NAME'}</p>
                          </div>
                          <div>
                            <p className="text-xs opacity-70">Expires</p>
                            <p className="font-medium">{paymentData.expiryDate || 'MM/YY'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={paymentData.cardNumber}
                              onChange={handleCardNumberChange}
                              maxLength={19}
                              className="pl-10 h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardHolder">Card Holder Name *</Label>
                          <Input
                            id="cardHolder"
                            placeholder="Name as shown on card"
                            value={paymentData.cardHolder}
                            onChange={(e) => setPaymentData({ ...paymentData, cardHolder: e.target.value })}
                            className="h-12"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={paymentData.expiryDate}
                              onChange={handleExpiryDateChange}
                              maxLength={5}
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                id="cvv"
                                type="password"
                                placeholder="123"
                                value={paymentData.cvv}
                                onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })}
                                maxLength={4}
                                className="pl-10 h-12"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-6 text-sm text-[#5d6d7e]">
                        <Shield className="w-4 h-4 text-[#27ae60]" />
                        <span>Your payment information is secure and encrypted</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => setStep('shipping')}
                      className="flex-1 h-14"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="flex-1 bg-[#27ae60] hover:bg-[#229954] h-14"
                    >
                      {isSubmitting ? 'Processing...' : `Pay ${formatPrice(totalPrice)} DZD`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-[#2c3e50] mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2c3e50] line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#5d6d7e]">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-[#27ae60]">
                          {formatPrice(item.price * item.quantity)} DZD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5d6d7e]">Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice)} DZD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5d6d7e]">Shipping</span>
                    <span className="text-[#27ae60]">Free</span>
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

                <div className="flex items-center gap-2 text-sm text-[#5d6d7e]">
                  <Lock className="w-4 h-4" />
                  <span>Secure checkout powered by Carte Dahabia</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
