import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  Building2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export function VendorApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'vendor') {
      navigate('/vendor');
    }
  }, [user, navigate]);

  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    api.getPublicStats().then(data => {
      setVendorCount(data.vendors);
    }).catch(console.error);
  }, []);

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    return new Intl.NumberFormat().format(num);
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    latitude: null as number | null,
    longitude: null as number | null,
    address: '',
    registrationNumber: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.businessName || !formData.ownerName || !formData.email || 
        !formData.phone || !formData.latitude || !formData.longitude || 
        !formData.address || !formData.registrationNumber) {
      toast.error('Please fill in all required fields, including your GPS location');
      return;
    }

    // Submit application
    api.applyVendor({
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      wilaya: '19', // Hardcoded as requested
      city: 'El Eulma', // Hardcoded as requested
      latitude: formData.latitude,
      longitude: formData.longitude,
      address: formData.address,
      registrationNumber: formData.registrationNumber,
      description: formData.description,
    }).then(() => {
      setIsSubmitted(true);
      toast.success('Application submitted successfully!');
    }).catch((err) => {
      console.error('Failed to submit application:', err);
      toast.error('Failed to submit application. Please try again.');
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast.success('Location obtained successfully!');
      },
      () => {
        toast.error('Unable to retrieve your location. Please allow location access.');
      }
    );
  };

  if (isSubmitted) {
    return (
      <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-[#27ae60]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-[#27ae60]" />
            </div>
            <h1 className="text-3xl font-bold text-[#2c3e50] mb-4">
              Application Submitted!
            </h1>
            <p className="text-[#5d6d7e] mb-8">
              Thank you for applying to become a vendor on El Eulma Store. 
              Our team will review your application and get back to you within 2-3 business days.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button className="bg-[#27ae60] hover:bg-[#229954]">
                  Return to Home
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline">
                  Browse Products
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
            Become a Vendor
          </h1>
          <p className="text-[#5d6d7e]">
            Join {formatNumber(vendorCount)} verified vendors selling on El Eulma Store
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-[#27ae60]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Store className="w-6 h-6 text-[#27ae60]" />
              </div>
              <h3 className="font-semibold text-[#2c3e50]">Reach Nationwide</h3>
              <p className="text-sm text-[#5d6d7e]">Sell to all 58 wilayas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-[#e67e22]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-[#e67e22]" />
              </div>
              <h3 className="font-semibold text-[#2c3e50]">Zero Setup Fees</h3>
              <p className="text-sm text-[#5d6d7e]">Start selling for free</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#2c3e50]">Easy Management</h3>
              <p className="text-sm text-[#5d6d7e]">Simple product dashboard</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Application Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <h2 className="text-xl font-semibold text-[#2c3e50] mb-6">
            Business Information
          </h2>

          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <div className="relative mt-2">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="businessName"
                  placeholder="Your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Owner Name */}
            <div>
              <Label htmlFor="ownerName">Owner/Manager Name *</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="ownerName"
                  placeholder="Full name"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="+213 555 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid gap-4">
              <div>
                <Label>GPS Location *</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Button
                    type="button"
                    onClick={handleGetLocation}
                    variant={formData.latitude ? "outline" : "default"}
                    className={formData.latitude ? "text-[#27ae60] border-[#27ae60]" : "bg-[#27ae60] hover:bg-[#229954] text-white"}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {formData.latitude ? "Location Acquired" : "Get My GPS Location"}
                  </Button>
                  {formData.latitude && (
                    <span className="text-sm text-[#5d6d7e]">
                      Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude?.toFixed(4)}
                    </span>
                  )}
                </div>
                {!formData.latitude && (
                  <p className="text-xs text-[#5d6d7e] mt-2">
                    Required. We need your exact location since all vendors must be in El Eulma.
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Business Address *</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Textarea
                  id="address"
                  placeholder="Street address, building, shop number..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <Label htmlFor="registrationNumber">Business Registration Number *</Label>
              <div className="relative mt-2">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="registrationNumber"
                  placeholder="RC-XXXXXX"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-[#5d6d7e] mt-1">
                Your commercial registration number from the Chamber of Commerce
              </p>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your business, products you sell, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-[#27ae60] hover:bg-[#229954] h-12"
              >
                Submit Application
              </Button>
              <p className="text-center text-sm text-[#5d6d7e] mt-4">
                By submitting, you agree to our{' '}
                <Link to="/terms" className="text-[#27ae60] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#27ae60] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
