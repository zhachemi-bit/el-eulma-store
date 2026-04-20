import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Store, Phone, MapPin, Building2, Loader2, CheckCircle, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { wilayas } from '@/data/wilayas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export function SignUp() {
  const { role } = useParams<{ role: 'user' | 'vendor' }>();
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  
  // Vendor-specific fields
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsDetectingLocation(false);
        toast.success('Location detected successfully!');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsDetectingLocation(false);
        toast.error('Could not detect location. Please enter your address manually.');
      }
    );
  };

  const isVendor = role === 'vendor';
  const title = isVendor ? 'Create Vendor Account' : 'Create Customer Account';
  const description = isVendor 
    ? 'Start selling your products on El Eulma Store'
    : 'Shop for the best products at wholesale prices';
  const loginLink = isVendor ? '/login/vendor' : '/login/user';

  const validateStep1 = () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!businessName || !businessAddress || !wilaya) {
      toast.error('Please fill in Store Name, Wilaya, and Address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isVendor && !validateStep2()) return;
    if (!isVendor && !validateStep1()) return;

    setIsLoading(true);
    
    try {
      await signup({
        name,
        email,
        password,
        phone,
        role: role!,
        avatar: avatar || undefined,
        ...(isVendor && {
          businessName,
          businessAddress,
          wilaya,
          registrationNumber,
          latitude: latitude || undefined,
          longitude: longitude || undefined,
        }),
      });

      toast.success('Account created successfully!', {
        description: isVendor 
          ? 'Your vendor account is pending verification. You will be notified once approved.'
          : 'Welcome to El Eulma Store!',
      });
      
      if (isVendor) {
        navigate('/login/vendor');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      if (isVendor) {
        setStep(2);
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8f5e9] pt-20 pb-20">
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isVendor ? 'max-w-2xl' : 'max-w-md'}`}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {step === 1 ? (
            <Link 
              to="/login" 
              className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login options
            </Link>
          ) : (
            <button 
              onClick={() => setStep(1)}
              className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to personal info
            </button>
          )}
        </motion.div>

        {/* Sign Up Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className={`w-16 h-16 ${isVendor ? 'bg-green-100' : 'bg-blue-100'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {isVendor ? (
                  <Store className="w-8 h-8 text-[#27ae60]" />
                ) : (
                  <User className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
              
              {/* Step Indicator for Vendor */}
              {isVendor && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 1 ? 'bg-[#27ae60] text-white' : 'bg-green-100 text-[#27ae60]'
                  }`}>
                    {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                  </div>
                  <div className={`w-16 h-1 rounded ${step > 1 ? 'bg-[#27ae60]' : 'bg-gray-200'}`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 2 ? 'bg-[#27ae60] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {step === 1 ? (
                /* Step 1: Personal Information */
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center space-y-2 mb-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center relative group border-2 border-dashed border-gray-300">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                      <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 text-white mb-1" />
                        <span className="text-[10px] text-white">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setAvatar(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">Profile Picture (Optional)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="+213 555 123 456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleNext}
                    className={`w-full h-12 mt-2 ${isVendor ? 'bg-[#27ae60] hover:bg-[#229954]' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : isVendor ? (
                      'Continue to Business Info'
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              ) : (
                /* Step 2: Business Information (Vendor Only) */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Store Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="businessName"
                        placeholder="Your Store name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wilaya">Vendor Location (Wilaya)</Label>
                      <Select value={wilaya} onValueChange={setWilaya}>
                        <SelectTrigger className="h-12 border-2 border-green-100 hover:border-green-300 transition-colors">
                          <SelectValue placeholder="Which Wilaya are you from?" />
                        </SelectTrigger>
                        <SelectContent>
                          {wilayas.map((w) => (
                            <SelectItem key={w.id} value={w.id}>
                              {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gps">Precise Location (GPS)</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={detectLocation}
                        disabled={isDetectingLocation}
                        className={`flex-1 h-12 border-2 ${latitude ? 'border-green-500 text-green-700 bg-green-50' : 'border-dashed border-gray-300'}`}
                      >
                        {isDetectingLocation ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : latitude ? (
                          <CheckCircle className="w-5 h-5 mr-2" />
                        ) : (
                          <MapPin className="w-5 h-5 mr-2" />
                        )}
                        {latitude ? 'Location Detected' : 'Detect My Location'}
                      </Button>
                      
                      {latitude && (
                         <Badge variant="outline" className="h-12 px-4 flex items-center justify-center bg-white border-2 border-green-200">
                           {latitude.toFixed(4)}, {longitude?.toFixed(4)}
                         </Badge>
                      )}
                    </div>
                    {!latitude && <p className="text-[10px] text-[#5d6d7e]">This helps customers find your store more easily.</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Store Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="businessAddress"
                        placeholder="Street details, Shop Number..."
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number (Optional)</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="registrationNumber"
                        placeholder="RC-XXXXXX"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    className="w-full h-12 bg-[#27ae60] hover:bg-[#229954]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating vendor account...
                      </>
                    ) : (
                      'Create Vendor Account'
                    )}
                  </Button>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#5d6d7e]">Already have an account?</span>
                </div>
              </div>

              {/* Login Link */}
              <Button 
                asChild
                variant="outline" 
                className="w-full h-12 bg-transparent hover:bg-green-50 text-[#27ae60] border-[#27ae60]"
              >
                <Link to={loginLink}>
                  Sign In
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
