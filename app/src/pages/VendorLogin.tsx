import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Store, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export function VendorLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/vendor');
    }
  }, [isAuthenticated, navigate]);

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
        role: 'vendor',
      });

      toast.success('Welcome back!', {
        description: 'Logged in as Vendor',
      });

      navigate('/vendor');
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-green-50 pt-20 pb-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
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
            Back to selection
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border-green-100">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-[#27ae60]" />
              </div>
              <CardTitle className="text-2xl">Vendor Login</CardTitle>
              <CardDescription>Sign in to manage your store and products</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Username</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="identifier"
                      type="text"
                      placeholder="vendor@electroplus.dz or Mobile World"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 h-12 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 h-12 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
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

                <div className="text-right">
                  <Link to="/forgot-password" title="vendor" className="text-sm text-[#27ae60] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#27ae60] hover:bg-[#229954]"
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

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#5d6d7e]">Want to sell on our platform?</span>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full h-12 bg-transparent hover:bg-green-50 text-[#27ae60] border-[#27ae60]"
              >
                <Link to="/become-vendor">
                  Apply as Vendor
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-green-800 font-medium text-sm mb-2">
            <Lock className="w-4 h-4" />
            <span>Vendor Test Account:</span>
          </div>
          <p className="text-xs text-green-900 font-mono">vendor@electroplus.dz / vendor123</p>
        </motion.div>
      </div>
    </main>
  );
}
