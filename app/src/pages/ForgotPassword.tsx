import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Key, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugKey, setDebugKey] = useState<string | null>(null);

  const handleRequestKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.forgotPassword(email);
      toast.success('Reset key sent!', {
        description: response.message
      });
      if (response.debug_key) {
        setDebugKey(response.debug_key);
      }
      setStep(2);
    } catch (error: any) {
      toast.error(error.message || 'Failed to request reset key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key) {
      toast.error('Please enter the reset key');
      return;
    }

    setIsLoading(true);
    try {
      await api.verifyResetKey(email, key);
      toast.success('Key verified!', {
        description: 'You can now set your new password.'
      });
      setStep(3);
    } catch (error: any) {
      toast.error(error.message || 'Invalid or expired key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword({
        email,
        key,
        newPassword
      });
      toast.success('Password reset successful!', {
        description: 'You can now sign in with your new password.'
      });
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
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
            Back to login
          </Link>
        </motion.div>

        {/* Forgot Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border-t-4 border-t-[#27ae60]">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {step === 1 && <Mail className="w-8 h-8 text-blue-600" />}
                {step === 2 && <Key className="w-8 h-8 text-[#27ae60]" />}
                {step === 3 && <ShieldCheck className="w-8 h-8 text-green-600" />}
              </div>
              <CardTitle className="text-2xl">
                {step === 1 && 'Forgot Password'}
                {step === 2 && 'Verify Reset Key'}
                {step === 3 && 'New Password'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Enter your email address to receive a password reset key.'}
                {step === 2 && 'Enter the 6-digit key sent to your email.'}
                {step === 3 && 'Set a strong new password for your account.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <form onSubmit={handleRequestKey} className="space-y-4">
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
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#27ae60] hover:bg-[#229954]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending Key...
                      </>
                    ) : (
                      'Send Reset Key'
                    )}
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyKey} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Reset Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="key"
                        type="text"
                        placeholder="Enter 6-digit key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="pl-10 h-12"
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    {debugKey && (
                      <p className="text-xs text-amber-600 mt-1">
                        Debug: Your key is <strong>{debugKey}</strong>
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#27ae60] hover:bg-[#229954]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Key'
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-sm text-[#5d6d7e] hover:text-[#27ae60] mt-2"
                  >
                    Back to email entry
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 h-12"
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repeat your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#27ae60] hover:bg-[#229954]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Box */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start"
          >
            <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              A 6-digit key has been sent to <strong>{email}</strong>. Please enter it to continue.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
