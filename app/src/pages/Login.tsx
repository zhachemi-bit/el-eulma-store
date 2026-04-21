import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Store, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export function Login() {
  const { role } = useParams<{ role: 'user' | 'vendor' }>();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const isVendor = role === 'vendor';
  const title = isVendor ? 'Vendor Login' : 'Customer Login';
  const description = isVendor 
    ? 'Sign in to manage your store and products'
    : 'Sign in to shop and track your orders';
  const signupLink = isVendor ? '/signup/vendor' : '/signup/user';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      await login({
        email,
        password,
        role: role!,
      });

      toast.success('Welcome back!', {
        description: `Logged in as ${isVendor ? 'Vendor' : 'Customer'}`,
      });
      
      // Redirect based on role
      if (isVendor) {
        navigate('/vendor');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8f5e9] pt-20 pb-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link 
            to="/login" 
            className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to role selection
          </Link>
        </motion.div>

        {/* Login Card */}
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
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12"
                      disabled={isLoading}
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

                {/* Forgot Password */}
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-[#27ae60] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className={`w-full h-12 ${isVendor ? 'bg-[#27ae60] hover:bg-[#229954]' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#5d6d7e]">Don't have an account?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Button 
                asChild
                variant="outline" 
                className="w-full h-12 bg-transparent hover:bg-green-50 text-[#27ae60] border-[#27ae60]"
              >
                <Link to={signupLink}>
                  Create Account
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 text-amber-800 font-medium text-sm">
            <Lock className="w-4 h-4" />
            <span>Default Test Accounts:</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="p-2 bg-white/50 rounded border border-amber-100">
              <p className="text-[10px] uppercase tracking-wider text-amber-600 font-bold mb-0.5">Admin</p>
              <p className="text-xs text-amber-900 font-mono">admin@admin.com / admin123</p>
            </div>
            <div className="p-2 bg-white/50 rounded border border-amber-100">
              <p className="text-[10px] uppercase tracking-wider text-green-600 font-bold mb-0.5">Seller (Vendor)</p>
              <p className="text-xs text-amber-900 font-mono">vendor@electroplus.dz / vendor123</p>
            </div>
            <div className="p-2 bg-white/50 rounded border border-amber-100">
              <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold mb-0.5">Customer (User)</p>
              <p className="text-xs text-amber-900 font-mono">customer@example.com / user123</p>
            </div>
          </div>
          <p className="text-[10px] text-amber-500 italic mt-1 text-center">
            Note: These are for development and testing purposes.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
