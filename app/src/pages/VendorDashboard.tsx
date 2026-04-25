import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  TrendingUp,
  ShoppingCart,
  Star,
  DollarSign,
  Search,
  Loader2,
  CheckCircle2,
  Flame,
  Percent
} from 'lucide-react';
import { useVendor } from '@/context/VendorContext';
import { useAuth } from '@/context/AuthContext';
import { categories } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

type TabType = 'overview' | 'products' | 'orders' | 'analytics';

export function VendorDashboard() {
  const { user } = useAuth();
  const { vendorProducts, vendorStats, isLoading, addProduct, updateProduct, deleteProduct } = useVendor();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercentage: '',
    stock: '',
    category: '',
    image: '',
    minOrderQuantity: '1',
  });

  const filteredProducts = useMemo(() => {
    return vendorProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vendorProducts, searchQuery]);

  // Mock analytics data
  const chartData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 13 },
    { name: 'Wed', sales: 2000, orders: 98 },
    { name: 'Thu', sales: 2780, orders: 39 },
    { name: 'Fri', sales: 1890, orders: 48 },
    { name: 'Sat', sales: 2390, orders: 38 },
    { name: 'Sun', sales: 3490, orders: 43 },
  ];

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      discountPercentage: '',
      stock: '',
      category: '',
      image: '',
      minOrderQuantity: '1',
    });
    setIsProductDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      discountPercentage: product.originalPrice && product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100).toString() 
        : '',
      stock: product.stock.toString(),
      category: product.category,
      image: product.image,
      minOrderQuantity: product.minOrderQuantity.toString(),
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        toast.success('Product deleted successfully');
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.stock || !productForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user?.vendorId) {
      toast.error('No vendor profile found');
      return;
    }

    setIsSaving(true);
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      stock: parseInt(productForm.stock),
      category: productForm.category,
      subcategory: productForm.category,
      minOrderQuantity: parseInt(productForm.minOrderQuantity || '1'),
      images: [productForm.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60'],
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }
      setIsProductDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscountChange = (percentage: string) => {
    const price = parseFloat(productForm.price);
    if (!isNaN(price) && percentage) {
      const discount = parseFloat(percentage);
      const original = price / (1 - discount / 100);
      setProductForm({
        ...productForm,
        discountPercentage: percentage,
        originalPrice: Math.round(original).toString()
      });
    } else {
      setProductForm({
        ...productForm,
        discountPercentage: percentage,
        originalPrice: ''
      });
    }
  };

  const handleOriginalPriceChange = (original: string) => {
    const price = parseFloat(productForm.price);
    if (!isNaN(price) && original) {
      const orig = parseFloat(original);
      if (orig > price) {
        const discount = ((orig - price) / orig) * 100;
        setProductForm({
          ...productForm,
          originalPrice: original,
          discountPercentage: Math.round(discount).toString()
        });
      } else {
        setProductForm({
          ...productForm,
          originalPrice: original,
          discountPercentage: '0'
        });
      }
    } else {
      setProductForm({
        ...productForm,
        originalPrice: original,
        discountPercentage: ''
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ').format(price);
  };

  const sidebarItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as TabType, label: 'My Products', icon: Package },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingCart },
    { id: 'analytics' as TabType, label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#27ae60] rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#2c3e50]">Vendor Panel</h2>
                    <p className="text-xs text-[#5d6d7e] font-medium">{user?.name || 'Vendor'}</p>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                      activeTab === item.id
                        ? 'bg-[#27ae60]/10 text-[#27ae60] font-semibold'
                        : 'text-[#5d6d7e] hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#2c3e50]">Vendor Overview</h1>
                    <Badge variant="outline" className="text-[#27ae60] border-[#27ae60] bg-[#27ae60]/5 px-3 py-1">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Approved Vendor
                    </Badge>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#5d6d7e] mb-1">Total Products</p>
                             <p className="text-3xl font-bold text-[#2c3e50]">{vendorProducts.length}</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#5d6d7e] mb-1">Total Revenue</p>
                             <p className="text-3xl font-bold text-[#27ae60]">{formatPrice(vendorStats?.totalRevenue || 0)} <span className="text-sm">DZD</span></p>
                          </div>
                          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#5d6d7e] mb-1">Total Orders</p>
                             <p className="text-3xl font-bold text-[#2c3e50]">{vendorStats?.totalOrderItems || 0}</p>
                          </div>
                          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#5d6d7e] mb-1">Rating</p>
                             <p className="text-3xl font-bold text-[#fbc531]">4.8</p>
                          </div>
                          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                            <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Summary Charts */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                           <TrendingUp className="w-5 h-5 text-[#27ae60]" />
                           Revenue Growth
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#27ae60" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#27ae60" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5d6d7e', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#5d6d7e', fontSize: 12}} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="sales" stroke="#27ae60" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                         <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Recent Orders</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')} className="text-[#27ae60]">View All</Button>
                         </div>
                      </CardHeader>
                      <CardContent>
                         <div className="space-y-4">
                            {vendorStats?.recentOrders?.slice(0, 4).map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img src={item.product?.image || item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-[#2c3e50] truncate">{item.product?.name}</p>
                                  <p className="text-xs text-[#5d6d7e]">{item.order?.user?.name}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-[#27ae60]">{formatPrice(item.price)}</p>
                                  <p className="text-[10px] text-[#5d6d7e]">{new Date(item.order?.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))}
                            {(!vendorStats?.recentOrders || vendorStats.recentOrders.length === 0) && (
                              <div className="text-center py-10">
                                 <ShoppingCart className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                 <p className="text-sm text-[#5d6d7e]">No recent orders</p>
                              </div>
                            )}
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-[#2c3e50]">My Products</h1>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-full sm:w-64 bg-white"
                        />
                      </div>
                      <Button onClick={handleAddProduct} className="bg-[#27ae60] hover:bg-[#229954] shadow-md shadow-green-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                      </Button>
                    </div>
                  </div>

                  <Card className="border-none shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#27ae60] mb-4" />
                            <p className="text-[#5d6d7e]">Loading products...</p>
                          </div>
                        ) : filteredProducts.length === 0 ? (
                          <div className="p-20 text-center">
                            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-[#5d6d7e]">No products found. Start by adding one!</p>
                          </div>
                        ) : (
                          filteredProducts.map((product) => (
                            <div key={product.id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                                    <img
                                      src={product.image || product.images?.[0]}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="font-bold text-[#2c3e50] truncate">{product.name}</h3>
                                    <p className="text-sm text-[#5d6d7e] mb-2">{categories.find(c => c.id === product.category)?.name}</p>
                                    <div className="flex items-center gap-3">
                                      <span className="text-[#27ae60] font-bold">{formatPrice(product.price)} DZD</span>
                                      <Badge variant="outline" className={product.stock > 5 ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-red-600 bg-red-50 border-red-100'}>
                                        {product.stock} in stock
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditProduct(product)}
                                    className="h-10 w-10 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteClick(product)}
                                    className="h-10 w-10 rounded-lg hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h1 className="text-2xl font-bold text-[#2c3e50]">Manage Orders</h1>
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-0">
                      {(!vendorStats?.recentOrders || vendorStats.recentOrders.length === 0) ? (
                        <div className="p-20 text-center">
                          <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-[#5d6d7e]">You don't have any orders yet.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                           <table className="w-full">
                              <thead>
                                 <tr className="bg-gray-50/50 border-b">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5d6d7e] uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5d6d7e] uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5d6d7e] uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5d6d7e] uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5d6d7e] uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#5d6d7e] uppercase tracking-wider">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y">
                                 {vendorStats.recentOrders.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2c3e50]">
                                          #{item.order?.id?.slice(-8).toUpperCase()}
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5d6d7e]">
                                          {item.order?.user?.name}
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center gap-2">
                                             <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden">
                                                <img src={item.product?.image || item.product?.images?.[0]} className="w-full h-full object-cover" />
                                             </div>
                                             <span className="text-sm text-[#2c3e50] font-medium">{item.product?.name}</span>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5d6d7e]">
                                          {new Date(item.order?.createdAt).toLocaleDateString()}
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#27ae60]">
                                          {formatPrice(item.price)}
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <Badge className={
                                            item.order?.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            item.order?.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                          }>
                                            {item.order?.status}
                                          </Badge>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h1 className="text-2xl font-bold text-[#2c3e50]">Sales Analytics</h1>
                  
                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-none shadow-sm">
                      <CardHeader>
                        <CardTitle>Sales Over Time</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5d6d7e', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#5d6d7e', fontSize: 12}} />
                            <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="sales" fill="#27ae60" radius={[4, 4, 0, 0]} barSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                       <CardHeader>
                         <CardTitle>Orders Distributed</CardTitle>
                       </CardHeader>
                       <CardContent className="h-[400px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5d6d7e', fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#5d6d7e', fontSize: 12}} />
                              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                              <Line type="monotone" dataKey="orders" stroke="#3498db" strokeWidth={3} dot={{fill: '#3498db', r: 4}} activeDot={{r: 6}} />
                            </LineChart>
                          </ResponsiveContainer>
                       </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update your product details' : 'Add a new product to your store'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>Product Name *</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Enter product name"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Enter product description"
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price (DZD) *</Label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="85000"
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label>Original Price (DZD)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => handleOriginalPriceChange(e.target.value)}
                    placeholder="95000"
                    className="h-11 pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono">
                    DZD
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Set Discount (%)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={productForm.discountPercentage}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    placeholder="20"
                    min="0"
                    max="99"
                    className="h-11 pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Percent className="w-4 h-4 text-[#27ae60]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Fire Offer Status Badge */}
            {parseFloat(productForm.originalPrice) > parseFloat(productForm.price) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-orange-700 leading-tight">Fire Offer Active!</h4>
                  <p className="text-xs text-orange-600/80 mt-1">
                    This product will be featured in the <b>Fire Offers</b> section on the home page with a {productForm.discountPercentage}% discount.
                  </p>
                </div>
              </motion.div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Stock *</Label>
                <Input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  placeholder="15"
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label>Category *</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Minimum Wholesale Quantity *</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={productForm.minOrderQuantity}
                  onChange={(e) => setProductForm({ ...productForm, minOrderQuantity: e.target.value })}
                  placeholder="10"
                  min="1"
                  className="h-11 pr-12"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                  PCS
                </div>
              </div>
              <p className="text-[10px] text-gray-500 italic">Minimum items per order for this wholesale product.</p>
            </div>
            <div className="grid gap-2">
              <Label>Product Image *</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProductForm({ ...productForm, image: reader.result as string });
                          // toast.success('Image selected successfully!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="h-11 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-xs text-[#5d6d7e]">Take a picture from your camera or upload an image file.</p>
              {productForm.image && (
                <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border relative shadow-sm">
                  <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setProductForm({ ...productForm, image: '' })}
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-1.5 shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)} className="h-11 px-6">
              Cancel
            </Button>
            <Button disabled={isSaving} onClick={handleSaveProduct} className="bg-[#27ae60] hover:bg-[#229954] h-11 px-8 shadow-lg shadow-green-100">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
