import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error('Please enter the admin password');
      return;
    }

    setIsLoading(true);

    try {
      await adminLogin(password);
      toast.success('Welcome, Administrator!', {
        description: 'Access granted to admin dashboard.',
      });
      navigate('/admin');
    } catch (error) {
      setAttempts(prev => prev + 1);
      toast.error('Invalid admin password', {
        description: 'Access denied. This area is restricted.',
      });

      if (attempts >= 2) {
        toast.warning('Multiple failed attempts detected', {
          description: 'Please contact system administrator if you need access.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 pt-20 pb-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/login"
            className="inline-flex items-center text-[#5d6d7e] hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to role selection
          </Link>
        </motion.div>

        {/* Admin Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border-purple-200">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Administrator Access</CardTitle>
              <CardDescription>
                Restricted area - Authorized personnel only
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Security Warning */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Restricted Access</p>
                  <p>This area is for system administrators only. Unauthorized access attempts will be logged.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Admin Password */}
                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-purple-700 font-medium">
                    Admin Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <Input
                      id="adminPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      disabled={isLoading}
                      autoComplete="off"
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Access Admin Panel
                    </>
                  )}
                </Button>
              </form>

              {/* No Sign Up Notice */}
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-[#5d6d7e]">
                  Don't have admin access?{' '}
                  <Link to="/become-vendor" className="text-purple-600 hover:underline">
                    Apply as a vendor
                  </Link>
                  {' '}or{' '}
                  <Link to="/signup/user" className="text-blue-600 hover:underline">
                    create a customer account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Footer & Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-col items-center gap-4"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Secure encrypted connection</span>
          </div>

          <div className="w-full max-w-[280px] p-3 bg-purple-50 border border-purple-100 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-purple-600 font-bold mb-1">Development Admin Password</p>
            <p className="text-sm text-purple-900 font-mono font-bold">admin123</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
