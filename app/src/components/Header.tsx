import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Menu, 
  Search, 
  User, 
  Store,
  Package,
  LogOut,
  ChevronDown,
  Shield,
  Heart,
  Settings
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/products' },
  { key: 'categories', href: '/#categories' },
  { key: 'about', href: '/#about' },
];

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalFavorites } = useFavorites();
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t, i18n } = useTranslation();
  
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.substring(1);
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    toast.success(t('auth.logout_success', 'Logged out successfully'));
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#27ae60] rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-[#2c3e50] leading-tight">
                {t('site_name', 'El Eulma Store')}
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#27ae60] ${
                  isActive(link.href)
                    ? 'text-[#27ae60]'
                    : 'text-[#5d6d7e]'
                }`}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex text-[#5d6d7e]">
                  <span className="uppercase text-xs font-bold">{i18n.language.substring(0, 2)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('ar')}>العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <div className="hidden md:flex relative ml-2 w-64">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('nav.search', 'Search products...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border rounded-full text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#27ae60]/20 focus:border-[#27ae60] outline-none transition-all"
                />
              </form>
            </div>

            {/* Favorites */}
            {isAuthenticated && (
              <Link to="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-[#5d6d7e] hover:text-red-500 hover:bg-red-50"
                >
                  <Heart className="w-5 h-5" />
                  {totalFavorites > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {totalFavorites}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#5d6d7e] hover:text-[#27ae60] hover:bg-[#27ae60]/10"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#e67e22] text-white text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* Auth Buttons */}
            {isAuthenticated && user && !isAuthPage ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden sm:flex items-center gap-2 text-[#5d6d7e] hover:text-[#27ae60] hover:bg-[#27ae60]/10"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[#27ae60]/10 border border-[#27ae60]/20">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-[#27ae60]" />
                      )}
                    </div>
                    <span className="max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-[#2c3e50]">{user?.name}</p>
                    <p className="text-xs text-[#5d6d7e]">{user?.email}</p>
                    <Badge className="mt-1 capitalize" variant="secondary">
                      {user?.role}
                    </Badge>
                  </div>
                  
                  {/* Role-specific menu items */}
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <Shield className="w-4 h-4 mr-2 text-purple-600" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {user?.role === 'vendor' && (
                    <DropdownMenuItem asChild>
                      <Link to="/vendor" className="flex items-center cursor-pointer">
                        <Package className="w-4 h-4 mr-2 text-[#27ae60]" />
                        Vendor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center cursor-pointer">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      My Favorites
                      {totalFavorites > 0 && (
                        <Badge className="ml-auto bg-red-100 text-red-600 text-[10px] px-1.5">{totalFavorites}</Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/account" className="flex items-center cursor-pointer">
                      <Settings className="w-4 h-4 mr-2 text-gray-600" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Login Button */
              <Link to="/login" className="hidden sm:block">
                <Button 
                  variant="outline" 
                  className="border-[#27ae60] text-[#27ae60] hover:bg-[#27ae60] hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t('header.login', 'Login')}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#5d6d7e] hover:text-[#27ae60]"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-[#27ae60] rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-[#2c3e50]">
                        El Eulma Store
                      </h1>
                      <p className="text-xs text-[#5d6d7e]">سوق الجملة الرقمي</p>
                    </div>
                  </div>

                  {/* User Info (if authenticated) */}
                  {isAuthenticated && user && (
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-[#27ae60]/10">
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-[#27ae60]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#2c3e50]">{user.name}</p>
                        <p className="text-sm text-[#5d6d7e]">{user.email}</p>
                        <Badge className="mt-1 capitalize" variant="secondary">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive(link.href)
                              ? 'bg-[#27ae60]/10 text-[#27ae60]'
                              : 'text-[#5d6d7e] hover:bg-gray-100'
                          }`}
                        >
                          <span className="font-medium">{t(`nav.${link.key}`)}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  <div className="border-t pt-4 mt-auto space-y-2">
                    {isAuthenticated ? (
                      <>
                        {/* Role-specific links */}
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">
                              <Shield className="w-4 h-4 mr-2 text-purple-600" />
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}
                        {user?.role === 'vendor' && (
                          <Link to="/vendor" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">
                              <Package className="w-4 h-4 mr-2 text-[#27ae60]" />
                              Vendor Dashboard
                            </Button>
                          </Link>
                        )}
                        <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">
                            <Heart className="w-4 h-4 mr-2 text-red-500" />
                            My Favorites
                            {totalFavorites > 0 && (
                              <Badge className="ml-2 bg-red-100 text-red-600 text-[10px] px-1.5">{totalFavorites}</Badge>
                            )}
                          </Button>
                        </Link>
                        <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">
                            <Settings className="w-4 h-4 mr-2 text-gray-600" />
                            Account Settings
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-[#27ae60] hover:bg-[#229954] text-white">
                            <User className="w-4 h-4 mr-2" />
                            Login
                          </Button>
                        </Link>
                        <Link to="/become-vendor" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">
                            <Store className="w-4 h-4 mr-2" />
                            Become a Vendor
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
