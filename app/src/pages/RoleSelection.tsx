import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Store, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const roles = [
  {
    id: 'user',
    title: 'Customer',
    description: 'Shop for products and track your orders',
    icon: User,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
  },
  {
    id: 'vendor',
    title: 'Vendor',
    description: 'Sell your products and manage your store',
    icon: Store,
    color: 'bg-[#27ae60]',
    lightColor: 'bg-green-50',
    textColor: 'text-[#27ae60]',
    borderColor: 'border-green-200',
    hoverBorder: 'hover:border-[#27ae60]',
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage vendors, products, and platform settings',
    icon: Shield,
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    hoverBorder: 'hover:border-purple-400',
  },
];

export function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: string) => {
    if (roleId === 'admin') {
      navigate('/login/admin');
    } else {
      navigate(`/login/${roleId}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8f5e9] pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-[#5d6d7e] hover:text-[#27ae60] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2c3e50] mb-3">
            Welcome Back
          </h1>
          <p className="text-lg text-[#5d6d7e]">
            Please select how you want to sign in
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${role.hoverBorder} border-2 ${role.borderColor} h-full`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 ${role.lightColor} ${role.color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <role.icon className={`w-10 h-10 ${role.textColor}`} />
                  </div>
                  <h2 className="text-xl font-bold text-[#2c3e50] mb-2">
                    {role.title}
                  </h2>
                  <p className="text-[#5d6d7e] mb-6">
                    {role.description}
                  </p>
                  <Button 
                    className={`w-full ${role.color} text-white group`}
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-[#5d6d7e] mt-10"
        >
          New to El Eulma Store?{' '}
          <Link to="/signup/user" className="text-[#27ae60] hover:underline font-medium">
            Create an account
          </Link>
        </motion.p>
      </div>
    </main>
  );
}
