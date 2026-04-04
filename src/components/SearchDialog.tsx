import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { products, brands, categories } from '@/lib/products';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const searchResults = useMemo(() => {
    if (query.length < 2) return { products: [], brands: [], categories: [] };

    const lowerQuery = query.toLowerCase();

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    ).slice(0, 6);

    const matchedBrands = brands.filter((b) =>
      b.toLowerCase().includes(lowerQuery)
    );

    const matchedCategories = categories.filter((c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.slug.toLowerCase().includes(lowerQuery)
    );

    return {
      products: matchedProducts,
      brands: matchedBrands,
      categories: matchedCategories,
    };
  }, [query]);

  const hasResults =
    searchResults.products.length > 0 ||
    searchResults.brands.length > 0 ||
    searchResults.categories.length > 0;

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onOpenChange(false);
  };

  const handleBrandClick = (brand: string) => {
    navigate(`/products?brand=${brand.toLowerCase()}`);
    onOpenChange(false);
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/products?category=${slug}`);
    onOpenChange(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-card">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            autoFocus
            type="text"
            placeholder="Search products, brands, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="border-0 bg-transparent focus-visible:ring-0 text-lg p-0 h-auto"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => setQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {query.length < 2 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center text-muted-foreground"
              >
                <p>Start typing to search...</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="text-xs">Popular:</span>
                  {['TWS', 'ANC', 'boAt', 'Gaming'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs px-3 py-1 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : !hasResults ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center text-muted-foreground"
              >
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-2"
              >
                {/* Categories */}
                {searchResults.categories.length > 0 && (
                  <div className="px-4 py-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.categories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="px-4 py-2 bg-secondary rounded-xl text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brands */}
                {searchResults.brands.length > 0 && (
                  <div className="px-4 py-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Brands
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => handleBrandClick(brand)}
                          className="px-4 py-2 bg-secondary rounded-xl text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {searchResults.products.length > 0 && (
                  <div className="px-4 py-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Products
                    </h4>
                    <div className="space-y-1">
                      {searchResults.products.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-colors text-left"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{product.brand}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-primary text-primary" />
                                {product.rating}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">₹{product.price.toLocaleString()}</p>
                            {product.discount > 0 && (
                              <p className="text-xs text-muted-foreground line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* View All Button */}
                <div className="p-4 border-t border-border">
                  <Button
                    onClick={handleSearch}
                    className="w-full"
                    variant="outline"
                  >
                    View all results for "{query}"
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
