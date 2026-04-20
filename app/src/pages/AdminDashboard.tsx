import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Package,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  User as UserIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAdmin } from '@/context/AdminContext';
import { wilayas } from '@/data/wilayas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { VendorApplication } from '@/types';

type TabType = 'overview' | 'applications' | 'vendors' | 'orders';

export function AdminDashboard() {
  const { applications, vendors, stats, approveApplication, rejectApplication } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  const filteredApplications = applications.filter(app =>
    app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getWilayaName = (id: string) => {
    return wilayas.find(w => w.id === id)?.name || id;
  };

  const handleReview = (action: 'approve' | 'reject') => {
    if (!selectedApplication) return;

    if (action === 'approve') {
      approveApplication(selectedApplication.id, reviewNotes);
      toast.success(`Approved ${selectedApplication.businessName}`, {
        description: 'Vendor can now start selling on the platform.',
      });
    } else {
      rejectApplication(selectedApplication.id, reviewNotes);
      toast.error(`Rejected ${selectedApplication.businessName}`, {
        description: 'Application has been rejected.',
      });
    }

    setIsReviewDialogOpen(false);
    setSelectedApplication(null);
    setReviewNotes('');
    setReviewAction(null);
  };

  const openReviewDialog = (application: VendorApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setReviewAction(action);
    setIsReviewDialogOpen(true);
  };

  const sidebarItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'applications' as TabType, label: 'Applications', icon: Clock, badge: stats.pendingApplications },
    { id: 'vendors' as TabType, label: 'Vendors', icon: Store },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingBag },
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
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#2c3e50]">Admin Panel</h2>
                    <p className="text-xs text-[#5d6d7e]">El Eulma Store</p>
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
                        ? 'bg-[#27ae60]/10 text-[#27ae60]'
                        : 'text-[#5d6d7e] hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge ? (
                      <Badge className="bg-[#e67e22] text-white text-xs">
                        {item.badge}
                      </Badge>
                    ) : null}
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
                  <h1 className="text-2xl font-bold text-[#2c3e50]">Dashboard Overview</h1>
                  
                  {/* Stats Cards */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#5d6d7e]">Total Vendors</p>
                            <p className="text-3xl font-bold text-[#2c3e50]">{stats.totalVendors}</p>
                          </div>
                          <div className="w-12 h-12 bg-[#27ae60]/10 rounded-lg flex items-center justify-center">
                            <Store className="w-6 h-6 text-[#27ae60]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#5d6d7e]">Pending Applications</p>
                            <p className="text-3xl font-bold text-[#e67e22]">{stats.pendingApplications}</p>
                          </div>
                          <div className="w-12 h-12 bg-[#e67e22]/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-[#e67e22]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#5d6d7e]">Total Products</p>
                            <p className="text-3xl font-bold text-[#2c3e50]">{stats.totalProducts}</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-[#5d6d7e]">Total Orders</p>
                            <p className="text-3xl font-bold text-[#2c3e50]">{stats.totalOrders}</p>
                          </div>
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Vendor Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {applications.slice(0, 3).map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-[#27ae60]/10 rounded-full flex items-center justify-center">
                                <Store className="w-5 h-5 text-[#27ae60]" />
                              </div>
                              <div>
                                <p className="font-medium text-[#2c3e50]">{app.businessName}</p>
                                <p className="text-sm text-[#5d6d7e]">{app.ownerName} • {getWilayaName(app.wilaya)}</p>
                              </div>
                            </div>
                            <Badge className={
                              app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              app.status === 'approved' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }>
                              {app.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <motion.div
                  key="applications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#2c3e50]">Vendor Applications</h1>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {filteredApplications.map((app) => (
                          <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#27ae60]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Store className="w-6 h-6 text-[#27ae60]" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-[#2c3e50]">{app.businessName}</h3>
                                  <p className="text-sm text-[#5d6d7e] mb-2">{app.description}</p>
                                  <div className="flex flex-wrap gap-2 text-xs text-[#5d6d7e]">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{app.ownerName}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">{app.email}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">{app.phone}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">{getWilayaName(app.wilaya)}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">RC: {app.registrationNumber}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                  app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }>
                                  {app.status}
                                </Badge>
                                {app.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-[#27ae60] hover:bg-[#229954]"
                                      onClick={() => openReviewDialog(app, 'approve')}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => openReviewDialog(app, 'reject')}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Vendors Tab */}
              {activeTab === 'vendors' && (
                <motion.div
                  key="vendors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#2c3e50]">All Vendors</h1>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search vendors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {filteredVendors.map((vendor) => (
                      <Card key={vendor.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-2 border-[#27ae60]/20 rounded-xl">
                                  {vendor.user?.avatar ? (
                                    <AvatarImage src={vendor.user.avatar} className="object-cover" />
                                  ) : null}
                                  <AvatarFallback className="bg-[#27ae60]/10 text-[#27ae60] rounded-xl">
                                    <Store className="w-8 h-8" />
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-[#2c3e50]">{vendor.name}</h3>
                                    {vendor.verified && (
                                      <Badge className="bg-[#27ae60]/10 text-[#27ae60] border-none">Verified</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-[#5d6d7e] flex items-center gap-1">
                                    <UserIcon className="w-3 h-3" />
                                    Account: {vendor.user?.name || 'Linked Owner'}
                                  </p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-5 h-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`/products?vendorId=${vendor.id}`} className="flex items-center">
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Products
                                    </Link>
                                  </DropdownMenuItem>
                                  {vendor.latitude && vendor.longitude && (
                                    <DropdownMenuItem asChild>
                                      <a 
                                        href={`https://www.google.com/maps?q=${vendor.latitude},${vendor.longitude}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                      >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open in Maps
                                      </a>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5d6d7e]">Contact Info</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-[#2c3e50]">
                                    <Mail className="w-4 h-4 text-[#5d6d7e]" />
                                    {vendor.email}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-[#2c3e50]">
                                    <Phone className="w-4 h-4 text-[#5d6d7e]" />
                                    {vendor.phone || vendor.user?.phone || 'No phone'}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5d6d7e]">Store Location</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-[#2c3e50]">
                                    <MapPin className="w-4 h-4 text-[#5d6d7e]" />
                                    {getWilayaName(vendor.wilaya)}, {vendor.location}
                                  </div>
                                  {vendor.latitude && (
                                    <div className="text-xs text-[#27ae60] font-mono">
                                      GPS: {vendor.latitude.toFixed(5)}, {vendor.longitude?.toFixed(5)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex gap-4">
                                <span className="text-sm text-[#5d6d7e] bg-gray-100 px-2 py-1 rounded-md">
                                  <Package className="w-3.5 h-3.5 inline mr-1" />
                                  {vendor.productCount} Items
                                </span>
                                <span className="text-sm text-[#5d6d7e] bg-gray-100 px-2 py-1 rounded-md">
                                  <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                                  {vendor.rating} Rating
                                </span>
                              </div>
                              <span className="text-xs text-[#5d6d7e]">
                                Joined {new Date(vendor.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                  <h1 className="text-2xl font-bold text-[#2c3e50]">Orders</h1>
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-[#5d6d7e]">Order management coming soon</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve Vendor' : 'Reject Vendor'}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.businessName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Review Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes about this decision..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleReview(reviewAction!)}
              className={reviewAction === 'approve' ? 'bg-[#27ae60] hover:bg-[#229954]' : 'bg-red-500 hover:bg-red-600'}
            >
              {reviewAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
