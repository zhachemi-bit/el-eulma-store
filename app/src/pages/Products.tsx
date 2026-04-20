import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';
import { categories } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

// Removed static priceRanges

export function Products() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const vendorId = searchParams.get('vendorId') || '';
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
          vendorId: vendorId || undefined,
          limit: 100, // Fetch a reasonable amount for local sorting/filtering
        });
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, vendorId]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by price range locally
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Already sorted by newest in backend
        break;
    }

    return result;
  }, [products, minPrice, maxPrice, sortBy]);

  const activeFiltersCount = [
    selectedCategory,
    minPrice,
    maxPrice
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSearchParams({}); // This clears the URL search params (like vendorId)
  };

  return (
    <main className="pt-24 pb-20 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="mb-8"
>
  <h1 className="text-3xl sm:text-4xl font-bold text-[#2c3e50] mb-2">
    {t('products.all')}
  </h1>
  <p className="text-[#5d6d7e]">
    Browse {filteredProducts.length} products from verified El Eulma wholesalers
  </p>
</motion.div>

{/* Search and Filters Bar */}
<div className="flex flex-col sm:flex-row gap-4 mb-8">
  {/* Search */}
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <Input
      placeholder={t('nav.search', 'Search products...')}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10 h-12"
    />
  </div>

  {/* Mobile Filter Button */}
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" className="h-12 sm:hidden">
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        {t('products.filters')}
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-[#27ae60]">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Category Filter */}
                <div>
                  <h4 className="font-semibold mb-3">{t('products.category')}</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory ? 'bg-[#27ae60]/10 text-[#27ae60]' : 'hover:bg-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-[#27ae60]/10 text-[#27ae60]'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-semibold mb-3">{t('products.price')}</h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder={t('filter.min', 'Min')} 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)} 
                    />
                    <span className="text-gray-400">-</span>
                    <Input 
                      type="number" 
                      placeholder={t('filter.max', 'Max')} 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 min-w-[160px]">
                {sortOptions.find((o) => o.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="text-sm text-[#5d6d7e]">Active filters:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {(minPrice || maxPrice) && (
              <Badge variant="secondary" className="gap-1">
                {minPrice || 0} - {maxPrice || 'Any'} DZD
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {vendorId && (
              <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700">
                Vendor ID: {vendorId}
                <button onClick={() => { setSearchParams({}); window.location.reload(); }}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-[#27ae60] hover:underline ml-2"
            >
              {t('products.clear')}
            </button>
          </motion.div>
        )}

        {/* Desktop Layout with Sidebar */}
        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-[#2c3e50] mb-4">Category</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      !selectedCategory ? 'bg-[#27ae60]/10 text-[#27ae60]' : 'hover:bg-gray-100 text-[#5d6d7e]'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedCategory === cat.id
                          ? 'bg-[#27ae60]/10 text-[#27ae60]'
                          : 'hover:bg-gray-100 text-[#5d6d7e]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-semibold text-[#2c3e50] mb-4">Custom Price (DZD)</h4>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)} 
                  />
                  <span className="text-gray-400">-</span>
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
                <Loader2 className="w-10 h-10 animate-spin text-[#27ae60] mb-4" />
                <p className="text-[#5d6d7e]">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <p className="text-lg text-[#5d6d7e] mb-4">No products found</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
