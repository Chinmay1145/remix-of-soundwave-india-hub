import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid3X3, LayoutList, SlidersHorizontal, X, ArrowUpDown, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, brands, categories } from '@/lib/products';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasANC, setHasANC] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get initial category/brand/search from URL
  const urlCategory = searchParams.get('category');
  const urlBrand = searchParams.get('brand');
  const urlSearch = searchParams.get('search');

  // Sync URL brand param into the brand checkbox filter so it's visible/removable in the UI
  useEffect(() => {
    if (urlBrand && urlBrand !== 'all') {
      const match = brands.find((b) => b.toLowerCase() === urlBrand.toLowerCase());
      if (match) {
        setSelectedBrands((prev) => (prev.includes(match) ? prev : [...prev, match]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlBrand]);

  const removeUrlParam = (key: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (urlSearch) {
      const searchLower = urlSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    if (urlCategory && urlCategory !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === urlCategory.toLowerCase()
      );
    }

    if (urlBrand && urlBrand !== 'all') {
      result = result.filter(
        (p) => p.brand.toLowerCase() === urlBrand.toLowerCase()
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.some(
          (cat) => p.category.toLowerCase() === cat.toLowerCase()
        )
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (hasANC) {
      result = result.filter((p) => p.anc);
    }

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
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      default:
        result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [urlCategory, urlBrand, urlSearch, selectedBrands, selectedCategories, priceRange, hasANC, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    if (urlBrand && urlBrand.toLowerCase() === brand.toLowerCase()) {
      removeUrlParam('brand');
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    if (urlCategory && urlCategory.toLowerCase() === category.toLowerCase()) {
      removeUrlParam('category');
    }
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setHasANC(false);
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount =
    selectedBrands.length +
    selectedCategories.length +
    (hasANC ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    (urlSearch ? 1 : 0);

  const sortLabels: Record<string, string> = {
    popular: 'Most Popular',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
    rating: 'Highest Rated',
    discount: 'Best Discount',
  };

  const FilterContent = () => (
    <>
      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-medium mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          min={0}
          max={10000}
          step={100}
          onValueChange={setPriceRange}
          className="mb-3"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-8">
        <h4 className="font-medium mb-4">Brands</h4>
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span className="text-sm group-hover:text-primary transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-medium mb-4">Categories</h4>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <span className="text-sm group-hover:text-primary transition-colors">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ANC Filter */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox checked={hasANC} onCheckedChange={(c) => setHasANC(!!c)} />
          <span className="text-sm">Active Noise Cancellation</span>
        </label>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8"
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-[80px]" />
            <h1 className="relative font-display text-4xl md:text-5xl font-bold mb-3">
              {urlSearch ? (
                <>
                  Results for "<span className="gradient-text">{urlSearch}</span>"
                </>
              ) : urlCategory ? (
                <>
                  <span className="gradient-text capitalize">{urlCategory}</span> Products
                </>
              ) : urlBrand && urlBrand !== 'all' ? (
                <>
                  <span className="gradient-text capitalize">{urlBrand}</span> Products
                </>
              ) : (
                <>
                  All <span className="gradient-text">Products</span>
                </>
              )}
            </h1>
            <p className="relative text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              {urlSearch && (
                <button onClick={() => removeUrlParam('search')} className="flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  Search: {urlSearch} <X className="w-3 h-3" />
                </button>
              )}
              {selectedBrands.map((b) => (
                <button key={b} onClick={() => toggleBrand(b)} className="flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  {b} <X className="w-3 h-3" />
                </button>
              ))}
              {selectedCategories.map((c) => (
                <button key={c} onClick={() => toggleCategory(c)} className="flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors capitalize">
                  {c} <X className="w-3 h-3" />
                </button>
              ))}
              {hasANC && (
                <button onClick={() => setHasANC(false)} className="flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  ANC <X className="w-3 h-3" />
                </button>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <button onClick={() => setPriceRange([0, 10000])} className="flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  ₹{priceRange[0]}–₹{priceRange[1]} <X className="w-3 h-3" />
                </button>
              )}
              <button onClick={clearFilters} className="text-xs font-medium text-muted-foreground hover:text-destructive underline underline-offset-2 ml-1">
                Clear all
              </button>
            </motion.div>
          )}

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Sticky Toolbar */}
              <div className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-card/90 backdrop-blur-xl rounded-xl border border-border shadow-sm">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>

                <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                  <PackageSearch className="w-4 h-4 text-primary" />
                  Showing {filteredProducts.length} results
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <div className="relative">
                    <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-background border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      {Object.entries(sortLabels).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode('list')}
                    >
                      <LayoutList className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                      >
                        <ProductCard product={product} index={0} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border"
                >
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                    <PackageSearch className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">No products found</h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting or clearing your filters to see more results
                  </p>
                  <Button onClick={clearFilters} variant="glow">Clear Filters</Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-card border-r border-border p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-8">
                <FilterContent />
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Products;
