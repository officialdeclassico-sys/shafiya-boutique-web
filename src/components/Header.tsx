import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAssetUrl } from '../utils/assetPath';
import { BrandLogo } from './BrandLogo';
import {
  COLLECTION_CATEGORIES,
  BagItem,
} from '../data/heroSlides';
import { CATALOG_PRODUCTS } from '../data/productsData';

const DRAWER_AND_MENU_CATEGORIES: { id: string; title: string; subtitle: string }[] = [
  { id: 'Kurtas', title: 'Kurtas', subtitle: 'EVERYDAY ELEGANCE' },
  { id: 'Kurta Sets', title: 'Kurta Sets', subtitle: 'CRAFTED ENSEMBLES' },
  { id: 'Palazzo Sets', title: 'Palazzo Sets', subtitle: 'FLUID SILHOUETTES' },
  { id: 'Pant Sets', title: 'Pant Sets', subtitle: 'TAILORED GRACE' },
  { id: 'Dupatta Sets', title: 'Dupatta Sets', subtitle: 'HEIRLOOM DRAPES' },
  { id: 'Kashmiri Embroidered Suits', title: 'Kashmiri Embroidered Suits', subtitle: 'ARTISAN NEEDLEWORK' },
  { id: 'Pherans', title: 'Pherans', subtitle: 'VALLEY HERITAGE' },
  { id: 'Shawls', title: 'Shawls', subtitle: 'PASHMINA & AARI' },
  { id: 'Stoles', title: 'Stoles', subtitle: 'LIGHTWEIGHT LUXURY' },
  { id: 'Accessories', title: 'Accessories', subtitle: 'POTLIS & ACCENTS' },
  { id: 'Custom Designs', title: 'Custom Designs', subtitle: 'BESPOKE ATELIER' },
];

export type NavItemKey =
  | 'Home'
  | 'Collections'
  | 'Custom Designs'
  | 'Our Story'
  | 'Contact';

const NAV_ITEMS: { label: NavItemKey; targetId: string }[] = [
  { label: 'Home', targetId: 'home' },
  { label: 'Collections', targetId: 'collections' },
  { label: 'Custom Designs', targetId: 'custom-designs' },
  { label: 'Our Story', targetId: 'our-story' },
  { label: 'Contact', targetId: 'contact' },
];

interface HeaderProps {
  activePage?: NavItemKey;
  onNavigate?: (page: NavItemKey) => void;
  onOpenSignIn: () => void;
  onSelectCollectionSlide?: (slideIndex: number) => void;
  onSelectCategory?: (categoryId: string) => void;
  bagItems?: BagItem[];
  onAddSampleBagItem?: () => void;
  onRemoveBagItem?: (id: string) => void;
  onUpdateBagQuantity?: (id: string, delta: number) => void;
  wishlistIds?: string[];
  wishlistActive?: boolean;
  onToggleHeaderWishlist?: () => void;
  onToggleWishlistItem?: (id: string) => void;
  ecommerceMobileHeader?: boolean;
  onOpenBagPage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onOpenSignIn,
  onSelectCollectionSlide,
  onSelectCategory,
  bagItems: externalBagItems,
  onAddSampleBagItem,
  onRemoveBagItem,
  onUpdateBagQuantity,
  wishlistIds = [],
  wishlistActive,
  onToggleHeaderWishlist,
  onToggleWishlistItem,
  ecommerceMobileHeader = false,
  onOpenBagPage,
}) => {
  const [activeNav, setActiveNav] = useState<NavItemKey>(activePage ?? 'Home');
  const currentActiveNav = activePage ?? activeNav;
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [drawerCollectionsOpen, setDrawerCollectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState<string | null>(null);
  const [localWishlisted, setLocalWishlisted] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [mobileBagModalOpen, setMobileBagModalOpen] = useState(false);
  const [localBagItems, setLocalBagItems] = useState<BagItem[]>([]);

  // Mobile-specific states (< 1024px)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [drawerSupportModal, setDrawerSupportModal] = useState<
    'Help & Support' | 'Shipping' | 'Returns' | null
  >(null);

  const collectionsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const isWishlisted =
    wishlistActive !== undefined
      ? wishlistActive
      : wishlistIds.length > 0 || localWishlisted;
  const wishlistCount =
    wishlistIds.length > 0 ? wishlistIds.length : localWishlisted ? 1 : 0;

  const bagItems = externalBagItems ?? localBagItems;
  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  // Lock background page scroll while mobile slide-out drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileDrawerOpen]);

  // Focus mobile search input when expanded
  useEffect(() => {
    if (mobileSearchOpen) {
      window.setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 60);
    }
  }, [mobileSearchOpen]);

  // Escape key closes drawer or modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
        setCollectionsOpen(false);
        setBagOpen(false);
        setWishlistModalOpen(false);
        setMobileBagModalOpen(false);
        setDrawerSupportModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        collectionsRef.current &&
        !collectionsRef.current.contains(e.target as Node)
      ) {
        setCollectionsOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node) &&
        (!mobileSearchRef.current ||
          !mobileSearchRef.current.contains(e.target as Node))
      ) {
        setSubmittedSearch(null);
      }
      if (bagRef.current && !bagRef.current.contains(e.target as Node)) {
        setBagOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (label: NavItemKey = 'Home') => {
    setActiveNav(label);
    if (onNavigate) {
      onNavigate(label);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setSubmittedSearch(trimmed || 'All Kashmiri Designs');
  };

  const handleClearDesktopSearch = () => {
    setSearchQuery('');
    setSubmittedSearch(null);
  };

  const handleMobileSearchCloseOrClear = () => {
    if (searchQuery.trim().length > 0) {
      setSearchQuery('');
      setSubmittedSearch(null);
      mobileInputRef.current?.focus();
    } else {
      setSubmittedSearch(null);
      setMobileSearchOpen(false);
    }
  };

  const filteredCategories = submittedSearch
    ? COLLECTION_CATEGORIES.filter(
        (cat) =>
          submittedSearch === 'All Kashmiri Designs' ||
          cat.title.toLowerCase().includes(submittedSearch.toLowerCase()) ||
          cat.description.toLowerCase().includes(submittedSearch.toLowerCase())
      )
    : [];

  const handleAddSample = () => {
    if (onAddSampleBagItem) {
      onAddSampleBagItem();
      return;
    }
    const sampleProd = CATALOG_PRODUCTS[0];
    setLocalBagItems((prev) => {
      const existing = prev.find((i) => i.id === sampleProd.id);
      if (existing) {
        return prev.map((i) =>
          i.id === sampleProd.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          id: sampleProd.id,
          productId: sampleProd.id,
          name: sampleProd.name,
          variant: `${sampleProd.colours[0].name} | ${sampleProd.defaultSize}`,
          price: `₹${sampleProd.price.toLocaleString('en-IN')}`,
          numericPrice: sampleProd.price,
          quantity: 1,
          image: sampleProd.colours[0].image,
        },
      ];
    });
  };

  const handleRemoveItem = (id: string) => {
    if (onRemoveBagItem) {
      onRemoveBagItem(id);
      return;
    }
    setLocalBagItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    if (onUpdateBagQuantity) {
      onUpdateBagQuantity(id, delta);
      return;
    }
    setLocalBagItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const bagSubtotal = bagItems.reduce((sum, item) => {
    const unit =
      item.numericPrice ??
      (Number(String(item.price).replace(/[^0-9.]/g, '')) || 0);
    return sum + unit * item.quantity;
  }, 0);

  const wishlistedPieces = CATALOG_PRODUCTS.filter((p) =>
    wishlistIds.includes(p.id)
  ).map((p) => ({
    id: p.id,
    name: p.name,
    craftNote: `${p.brand} · ${p.fabric}`,
    price: `₹${p.price.toLocaleString('en-IN')}`,
    image: p.colours[0]?.image
      ? getAssetUrl(p.colours[0].image)
      : getAssetUrl(
          'assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png'
        ),
  }));

  return (
    <header className="relative z-30 w-full">
      {/* =====================================================================
          1. DESKTOP HEADER (1024px and above) — PRESERVED UNCHANGED
          ===================================================================== */}
      <div className="hidden lg:flex w-full lg:pl-[5.35%] lg:pr-[1.85%] lg:pt-[0.85%] pb-2 items-center justify-between gap-3 xl:gap-6">
        {/* 1. Brand Logo */}
        <div className="shrink-0">
          <BrandLogo
            onClick={() => {
              setCollectionsOpen(false);
              onSelectCollectionSlide?.(0);
              handleNavClick();
            }}
          />
        </div>

        {/* 2. Navigation Menu (Desktop: one horizontal row with exact 5 items) */}
        <nav
          aria-label="Primary Navigation"
          className="flex items-center gap-6 xl:gap-9 -mt-2 shrink-0"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentActiveNav === item.label;
            return (
              <a
                key={item.label}
                href={`#${item.targetId}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.label);
                }}
                className={`relative py-2 text-[14px] xl:text-[15px] tracking-[-0.01em] transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#141416] font-semibold'
                    : 'text-[#262528] font-medium hover:text-[#f83a6b]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#f83a6b] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* 3. Right Controls: Search Input, Wishlist Icon, Shopping Bag Icon, Sign In Button */}
        <div className="flex items-center gap-4 xl:gap-5 -mt-2 shrink-0">
          {/* Visible Rounded Search Input (Desktop) */}
          <div ref={searchRef} className="relative">
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="relative flex items-center"
            >
              <Search
                aria-hidden="true"
                className="w-[18px] h-[18px] text-[#232225] stroke-[1.75] absolute left-4 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for shawls, suits, pherans..."
                aria-label="Search for shawls, suits, pherans"
                className="w-[220px] xl:w-[324px] h-[44px] xl:h-[48px] pl-11 pr-9 rounded-full bg-[#f7f2ec]/90 hover:bg-[#f7f2ec] focus:bg-white text-[13px] xl:text-[13.5px] text-[#17171a] placeholder-[#a8a29d] border border-transparent focus:border-[#f83a6b]/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearDesktopSearch}
                  aria-label="Clear search"
                  className="absolute right-3 w-6 h-6 rounded-full flex items-center justify-center text-[#78716c] hover:text-[#17171a] hover:bg-[#ede5dd] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Search Handler Popover when Enter is pressed */}
            {submittedSearch && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#fcf8f3] border border-[#eadfd5] shadow-xl p-3.5 z-40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716c]">
                    Search: &ldquo;{submittedSearch}&rdquo;
                  </span>
                  <button
                    type="button"
                    onClick={() => setSubmittedSearch(null)}
                    aria-label="Close search results"
                    className="text-[#78716c] hover:text-[#17171a] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {filteredCategories.length > 0 ? (
                  <div className="space-y-1.5">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          onSelectCategory?.(cat.id);
                          setSubmittedSearch(null);
                          if (cat.id === 'Custom Designs') {
                            handleNavClick();
                          } else {
                            handleNavClick();
                          }
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f4ebe2] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#17171a]">
                            {cat.title}
                          </p>
                          <p className="text-[11px] text-[#78716c]">
                            {cat.subtitle}
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-[#f83a6b]">
                          Explore
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#57534e] py-2">
                    Showing handcrafted matches for &ldquo;{submittedSearch}&rdquo; in our Kashmiri Couture Edit.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Icon + Count Badge */}
          <button
            type="button"
            onClick={() => {
              setWishlistModalOpen(true);
            }}
            aria-label={`Wishlist with ${wishlistCount} items`}
            aria-pressed={isWishlisted}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#1e1e22] hover:bg-[#f3ece4]/80 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-[22px] h-[22px] stroke-[1.7] transition-all duration-200 ${
                isWishlisted
                  ? 'fill-[#f83a6b] text-[#f83a6b] scale-105'
                  : 'text-[#1e1e22]'
              }`}
            />
            <span className="absolute -top-0.5 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#f83a6b] text-white text-[11px] font-semibold flex items-center justify-center leading-none tabular-nums shadow-xs">
              {wishlistCount}
            </span>
          </button>

          {/* Shopping Bag Icon + Badge + Preview Popover */}
          <div ref={bagRef} className="relative">
            <button
              type="button"
              onClick={() => setBagOpen((prev) => !prev)}
              aria-label={`Shopping bag with ${totalBagCount} items`}
              aria-expanded={bagOpen}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#1e1e22] hover:bg-[#f3ece4]/80 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-[22px] h-[22px] stroke-[1.7]" />
              <span className="absolute -top-0.5 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#f83a6b] text-white text-[11px] font-semibold flex items-center justify-center leading-none tabular-nums shadow-xs">
                {totalBagCount}
              </span>
            </button>

            {bagOpen && (
              <div
                role="dialog"
                aria-label="Shopping Bag Preview"
                className="absolute right-0 mt-2.5 w-80 rounded-2xl bg-[#fcf8f3] border border-[#eadfd5] shadow-xl p-4 z-40"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#efe6dd]">
                  <span className="font-editorial text-lg font-semibold text-[#17171a]">
                    Your Shopping Bag ({totalBagCount})
                  </span>
                  <button
                    type="button"
                    onClick={() => setBagOpen(false)}
                    aria-label="Close shopping bag preview"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#78716c] hover:text-[#17171a] hover:bg-[#f2eae1] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {bagItems.length === 0 ? (
                  <div className="py-5 text-center space-y-3">
                    <p className="text-xs text-[#57534e]">
                      Your shopping bag is currently empty.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddSample}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fde8ee] hover:bg-[#fbd5e0] text-[#f83a6b] text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Preview Featured Ensemble</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-3 space-y-3">
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                      {bagItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2.5"
                        >
                          <img
                            src={getAssetUrl(item.image)}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getAssetUrl(
                                'assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png'
                              );
                            }}
                            className="w-11 h-11 rounded-xl object-cover object-top border border-[#e6dcd2] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#17171a] truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#78716c] truncate">
                              {item.variant}
                            </p>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#f83a6b] tabular-nums">
                                {item.price}
                              </span>
                              <div className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#e5dcd3] px-1 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.id, -1)}
                                  aria-label="Decrease quantity"
                                  className="w-5 h-5 flex items-center justify-center text-[#4a4542] hover:text-[#f83a6b] cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-[11px] font-bold text-[#17171a] px-1 tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(item.id, 1)}
                                  aria-label="Increase quantity"
                                  className="w-5 h-5 flex items-center justify-center text-[#4a4542] hover:text-[#f83a6b] cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="p-1.5 text-[#78716c] hover:text-[#f83a6b] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#efe6dd] flex items-center justify-between">
                      <span className="text-xs font-medium text-[#57534e]">
                        Subtotal
                      </span>
                      <span className="text-sm font-extrabold text-[#17171a] tabular-nums">
                        ₹{bagSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {onOpenBagPage && (
                      <button
                        type="button"
                        onClick={() => {
                          setBagOpen(false);
                          onOpenBagPage();
                        }}
                        className="w-full h-10 rounded-full bg-[#f81d5c] hover:bg-[#e0144f] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View Bag &amp; Checkout
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vertical Hairline Divider matching reference */}
          <span
            aria-hidden="true"
            className="block h-7 w-[1px] bg-[#dfd8d0] mx-0.5"
          />

          {/* Sign In Button */}
          <button
            type="button"
            onClick={onOpenSignIn}
            className="h-[42px] xl:h-[46px] px-5 xl:px-6 rounded-full bg-[#f83a6b] hover:bg-[#e42959] active:scale-[0.99] text-white text-[13px] xl:text-[14px] font-medium inline-flex items-center gap-2 shadow-[0_6px_18px_rgba(248,58,107,0.28)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <User className="w-4 h-4 stroke-[2]" />
            <span>Sign In</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. UNIFIED SHARED MOBILE & TABLET HEADER (< 1024px)
          (Consistent across Homepage, Collections, Product Details, Wishlist,
           Shopping Bag, Checkout, Our Story, and Contact Us)
          ===================================================================== */}
      <div className="lg:hidden w-full">
        <div className="w-full px-4 sm:px-6 pt-3 pb-2.5 flex items-center justify-between">
          {/* Left: Hamburger Menu Button (Opens Drawer from LEFT) */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileDrawerOpen}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-[#17171a] hover:bg-[#f2eae1]/70 transition-colors cursor-pointer"
          >
            <Menu className="w-[23px] h-[23px] stroke-[1.8]" />
          </button>

          {/* Center: Shafiya Logo */}
          <BrandLogo
            compact
            onClick={() => {
              onSelectCollectionSlide?.(0);
              handleNavClick();
            }}
          />

          {/* Right: Search Icon + Wishlist with Live Count + Shopping Bag with Live Count */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
              aria-expanded={mobileSearchOpen}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#17171a] hover:bg-[#f2eae1]/70 transition-colors cursor-pointer"
            >
              <Search className="w-[20px] h-[20px] stroke-[1.8]" />
            </button>

            <button
              type="button"
              onClick={() => setWishlistModalOpen(true)}
              aria-label={`Wishlist with ${wishlistCount} items`}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#17171a] hover:bg-[#f2eae1]/70 transition-colors cursor-pointer"
            >
              <Heart
                className={`w-[20px] h-[20px] stroke-[1.8] ${
                  isWishlisted
                    ? 'fill-[#f81d5c] text-[#f81d5c]'
                    : 'text-[#17171a]'
                }`}
              />
              <span className="absolute top-0.5 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-[#f81d5c] text-white text-[9.5px] font-bold flex items-center justify-center leading-none tabular-nums">
                {wishlistCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenBagPage) {
                  onOpenBagPage();
                } else {
                  setMobileBagModalOpen(true);
                }
              }}
              aria-label={`Shopping bag with ${totalBagCount} items`}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#17171a] hover:bg-[#f2eae1]/70 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-[20px] h-[20px] stroke-[1.8]" />
              <span className="absolute top-0.5 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-[#f81d5c] text-white text-[9.5px] font-bold flex items-center justify-center leading-none tabular-nums">
                {totalBagCount}
              </span>
            </button>
          </div>
        </div>

        {/* Expanded Mobile Search Input (Screen 3 of Reference) */}
        <div
          ref={mobileSearchRef}
          className={`overflow-hidden transition-all duration-250 ease-out ${
            mobileSearchOpen
              ? 'max-h-96 opacity-100 px-5 sm:px-7 pb-3 pt-1'
              : 'max-h-0 opacity-0 px-5 sm:px-7 pb-0 pt-0 pointer-events-none'
          }`}
        >
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="relative flex items-center w-full h-[46px] rounded-full bg-[#f4efe9] border border-[#e7dfd7] shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          >
            <Search
              aria-hidden="true"
              className="w-[18px] h-[18px] text-[#17171a] stroke-[1.8] ml-4 shrink-0 pointer-events-none"
            />
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for shawls, suits, pherans..."
              aria-label="Search for shawls, suits, pherans"
              className="flex-1 h-full pl-3 pr-3 bg-transparent text-[13.5px] text-[#17171a] placeholder-[#9a938d] focus:outline-none"
            />
            {/* Vertical Hairline Separator + Close/Clear X Button matching Screen 3 */}
            <span
              aria-hidden="true"
              className="h-6 w-[1px] bg-[#dfd7ce] shrink-0"
            />
            <button
              type="button"
              onClick={handleMobileSearchCloseOrClear}
              aria-label={
                searchQuery.trim().length > 0 ? 'Clear search' : 'Close search'
              }
              className="w-11 h-full flex items-center justify-center text-[#17171a] hover:text-[#f83a6b] transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-[18px] h-[18px] stroke-[1.8]" />
            </button>
          </form>

          {/* Search Results Dropdown when Enter is pressed on Mobile */}
          {submittedSearch && mobileSearchOpen && (
            <div className="mt-2 rounded-2xl bg-[#fcf8f3] border border-[#eadfd5] shadow-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716c]">
                  Results for &ldquo;{submittedSearch}&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => setSubmittedSearch(null)}
                  aria-label="Dismiss search results"
                  className="text-[#78716c] hover:text-[#17171a]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {filteredCategories.length > 0 ? (
                <div className="space-y-1">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory?.(cat.id);
                        setSubmittedSearch(null);
                        setMobileSearchOpen(false);
                        if (cat.id === 'Custom Designs') {
                          handleNavClick();
                        } else {
                          handleNavClick();
                        }
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f4ebe2] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#17171a]">
                          {cat.title}
                        </p>
                        <p className="text-[11px] text-[#78716c]">
                          {cat.subtitle}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-[#f83a6b]">
                        Explore
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#57534e] py-1.5">
                  Showing handcrafted matches for &ldquo;{submittedSearch}&rdquo; in our Kashmiri Couture Edit.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          3. MOBILE SLIDE-OUT NAVIGATION DRAWER — OPENS SMOOTHLY FROM LEFT EDGE
          ===================================================================== */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden fixed inset-0 z-50 flex justify-start bg-black/45 backdrop-blur-[1px]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            onClick={() => setMobileDrawerOpen(false)}
          >
            {/* Slide-Out Drawer Panel from LEFT to RIGHT */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[85%] max-w-[360px] h-full bg-[#fcf9f5] shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Drawer Header: Shafiya Logo Left + Close X Right + Thin Divider Underneath */}
                <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[#eae2d9]">
                  <BrandLogo
                    compact
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onSelectCollectionSlide?.(0);
                      handleNavClick();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    aria-label="Close navigation menu"
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#17171a] hover:bg-[#f2eae1] transition-colors cursor-pointer"
                  >
                    <X className="w-[22px] h-[22px] stroke-[1.75]" />
                  </button>
                </div>

                {/* Main Navigation Links (5 Exact Items) */}
                <nav
                  aria-label="Mobile Drawer Navigation"
                  className="px-6 py-4 space-y-1 border-b border-[#eae2d9]"
                >
                  {NAV_ITEMS.map((item) => {
                    const isActive = currentActiveNav === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setMobileDrawerOpen(false);
                          handleNavClick(item.label);
                        }}
                        className={`w-full py-2.5 flex items-center justify-between text-left text-[17px] tracking-[-0.01em] transition-colors cursor-pointer ${
                          isActive
                            ? 'text-[#f83a6b] font-medium'
                            : 'text-[#17171a] font-normal hover:text-[#f83a6b]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-[#f83a6b] stroke-[2]" />
                        )}
                      </button>
                    );
                  })}
              </nav>

              {/* Account and Shopping Options in Exact Order: 1. Wishlist, 2. Shopping Bag, 3. Sign In */}
              <div className="px-6 pt-4 pb-2 space-y-3.5">
                {/* 1. Wishlist */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setWishlistModalOpen(true);
                  }}
                  className="w-full py-1.5 flex items-center gap-3.5 text-left text-[#17171a] hover:text-[#f83a6b] transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-[22px] h-[22px] stroke-[1.7] shrink-0 ${
                      wishlistCount > 0
                        ? 'fill-[#f83a6b] text-[#f83a6b]'
                        : 'text-[#17171a]'
                    }`}
                  />
                  <span className="text-[16px] font-normal tracking-[-0.01em]">
                    Wishlist
                  </span>
                  <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#f83a6b] text-white text-[11px] font-semibold inline-flex items-center justify-center leading-none tabular-nums">
                    {wishlistCount}
                  </span>
                </button>

                {/* 2. Shopping Bag */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    if (onOpenBagPage) {
                      onOpenBagPage();
                    } else {
                      setMobileBagModalOpen(true);
                    }
                  }}
                  className="w-full py-1.5 flex items-center gap-3.5 text-left text-[#17171a] hover:text-[#f83a6b] transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-[22px] h-[22px] stroke-[1.7] text-[#17171a] shrink-0" />
                  <span className="text-[16px] font-normal tracking-[-0.01em]">
                    Shopping Bag
                  </span>
                  <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#f83a6b] text-white text-[11px] font-semibold inline-flex items-center justify-center leading-none tabular-nums">
                    {totalBagCount}
                  </span>
                </button>

                {/* 3. Sign In (Full-width pink rounded button) */}
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onOpenSignIn();
                    }}
                    className="w-full h-[46px] rounded-full bg-[#f83a6b] hover:bg-[#e02858] active:scale-[0.99] text-white text-[15px] font-medium flex items-center justify-center gap-2.5 shadow-[0_6px_18px_rgba(248,58,107,0.28)] transition-all cursor-pointer"
                  >
                    <User className="w-[18px] h-[18px] stroke-[2]" />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>

              {/* Decorative Brand Artwork below Sign In (Pink Brush Strokes, Kashmiri Floral Line Illustration, "Threads of a Brighter Tomorrow") */}
              <div className="px-4 pt-2 pb-1 flex justify-center">
                <img
                  src={getAssetUrl('assets/aistudio/drawer_decorative_art.png')}
                  alt="Threads of a Brighter Tomorrow — Kashmiri floral line illustration"
                  referrerPolicy="no-referrer"
                  className="w-full max-w-[260px] h-auto object-contain select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Drawer Footer: Social Icons + Divider + Help & Support | Shipping | Returns + Copyright */}
            <div className="px-6 pt-3 pb-6 bg-[#fcf9f5]">
              {/* Social Media Icons Row: Instagram, Facebook, Pinterest, YouTube */}
              <div className="flex items-center justify-center gap-7 pb-4">
                {/* Instagram */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label="Instagram"
                  className="text-[#17171a] hover:text-[#f83a6b] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[19px] h-[19px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label="Facebook"
                  className="text-[#17171a] hover:text-[#f83a6b] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[19px] h-[19px]"
                    fill="currentColor"
                  >
                    <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V6.65c0-1.05.29-1.73 1.76-1.73Z" />
                  </svg>
                </a>

                {/* Pinterest */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label="Pinterest"
                  className="text-[#17171a] hover:text-[#f83a6b] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[19px] h-[19px]"
                    fill="currentColor"
                  >
                    <path d="M12.04 2C6.58 2 3 5.66 3 9.65c0 2.2 1.23 4.14 2.66 4.75.25.11.39.05.45-.18.05-.19.27-1.1.37-1.53.03-.14.02-.26-.1-.4-.55-.65-.99-1.84-.99-2.96 0-2.86 2.17-5.63 5.87-5.63 3.19 0 5.42 2.17 5.42 5.27 0 3.5-1.78 5.93-4.1 5.93-1.28 0-2.24-1.06-1.93-2.36.37-1.55 1.09-3.22 1.09-4.34 0-1-.54-1.83-1.65-1.83-1.31 0-2.36 1.35-2.36 3.16 0 1.15.39 1.93.39 1.93l-1.54 6.53c-.39 1.66-.06 3.99-.03 4.21.02.11.15.14.22.05.11-.14 1.48-1.97 1.87-3.61.14-.55.72-2.85.72-2.85.38.72 1.47 1.33 2.63 1.33 3.46 0 5.96-3.18 5.96-7.14C20.98 5.48 17.28 2 12.04 2Z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label="YouTube"
                  className="text-[#17171a] hover:text-[#f83a6b] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[20px] h-[20px]"
                    fill="currentColor"
                  >
                    <path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.51 2.51 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15V9l5.2 3-5.2 3Z" />
                  </svg>
                </a>
              </div>

              {/* Thin Horizontal Divider */}
              <div className="border-t border-[#eae2d9] pt-3.5 text-center">
                {/* Help & Support | Shipping | Returns */}
                <div className="flex items-center justify-center gap-2.5 text-[12px] font-medium text-[#2c2826]">
                  <button
                    type="button"
                    onClick={() => setDrawerSupportModal('Help & Support')}
                    className="hover:text-[#f83a6b] transition-colors cursor-pointer"
                  >
                    Help &amp; Support
                  </button>
                  <span aria-hidden="true" className="text-[#cfc6bc]">
                    |
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerSupportModal('Shipping')}
                    className="hover:text-[#f83a6b] transition-colors cursor-pointer"
                  >
                    Shipping
                  </button>
                  <span aria-hidden="true" className="text-[#cfc6bc]">
                    |
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerSupportModal('Returns')}
                    className="hover:text-[#f83a6b] transition-colors cursor-pointer"
                  >
                    Returns
                  </button>
                </div>

                {/* Copyright Text */}
                <p className="text-[11px] text-[#8a827c] mt-2">
                  © Shafiya. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* =====================================================================
          4. SYNCHRONIZED WISHLIST MODAL (Triggered from Mobile Drawer)
          ===================================================================== */}
      {wishlistModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label="Your Wishlist"
          onClick={() => setWishlistModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[#fcf8f3] border border-[#eadfd5] shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efe6dd]">
              <h3 className="font-editorial text-2xl font-semibold text-[#17171a]">
                Your Wishlist ({wishlistCount})
              </h3>
              <button
                type="button"
                onClick={() => setWishlistModalOpen(false)}
                aria-label="Close wishlist"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716c] hover:text-[#17171a] hover:bg-[#f2eae1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {wishlistedPieces.length === 0 ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-[#57534e]">
                  Your Kashmiri wishlist is currently empty.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onToggleWishlistItem?.(CATALOG_PRODUCTS[0].id);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fde8ee] hover:bg-[#fbd5e0] text-[#f83a6b] text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save {CATALOG_PRODUCTS[0].name}</span>
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-3 max-h-72 overflow-y-auto">
                {wishlistedPieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <img
                      src={getAssetUrl(piece.image)}
                      alt={piece.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getAssetUrl(
                          'assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png'
                        );
                      }}
                      className="w-12 h-12 rounded-full object-cover border border-[#e6dcd2] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#17171a] truncate">
                        {piece.name}
                      </p>
                      <p className="text-[11px] text-[#78716c] truncate">
                        {piece.craftNote}
                      </p>
                      <p className="text-xs font-medium text-[#f83a6b] mt-0.5 tabular-nums">
                        {piece.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleWishlistItem?.(piece.id)}
                      aria-label={`Remove ${piece.name} from wishlist`}
                      className="p-1.5 text-[#78716c] hover:text-[#f83a6b]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          5. SYNCHRONIZED MOBILE SHOPPING BAG MODAL (Triggered from Mobile Drawer)
          ===================================================================== */}
      {mobileBagModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label="Your Shopping Bag"
          onClick={() => setMobileBagModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-[#fcf8f3] border border-[#eadfd5] shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efe6dd]">
              <h3 className="font-editorial text-2xl font-semibold text-[#17171a]">
                Your Shopping Bag ({totalBagCount})
              </h3>
              <button
                type="button"
                onClick={() => setMobileBagModalOpen(false)}
                aria-label="Close shopping bag"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716c] hover:text-[#17171a] hover:bg-[#f2eae1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bagItems.length === 0 ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-[#57534e]">
                  Your shopping bag is currently empty.
                </p>
                <button
                  type="button"
                  onClick={handleAddSample}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fde8ee] hover:bg-[#fbd5e0] text-[#f83a6b] text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Preview Featured Ensemble</span>
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-3">
                <div className="max-h-72 overflow-y-auto space-y-3">
                  {bagItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <img
                        src={getAssetUrl(item.image)}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getAssetUrl(
                            'assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png'
                          );
                        }}
                        className="w-12 h-12 rounded-xl object-cover object-top border border-[#e6dcd2] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#17171a] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#78716c] truncate">
                          {item.variant}
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#f83a6b] tabular-nums">
                            {item.price}
                          </span>
                          <div className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#e5dcd3] px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, -1)}
                              aria-label="Decrease quantity"
                              className="w-5 h-5 flex items-center justify-center text-[#4a4542] hover:text-[#f83a6b]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[11px] font-bold text-[#17171a] px-1 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, 1)}
                              aria-label="Increase quantity"
                              className="w-5 h-5 flex items-center justify-center text-[#4a4542] hover:text-[#f83a6b]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="p-1.5 text-[#78716c] hover:text-[#f83a6b]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-[#efe6dd] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#57534e]">
                    Subtotal
                  </span>
                  <span className="text-base font-extrabold text-[#17171a] tabular-nums">
                    ₹{bagSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          6. DRAWER FOOTER INFO MODAL (Help & Support | Shipping | Returns)
          ===================================================================== */}
      {drawerSupportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label={drawerSupportModal}
          onClick={() => setDrawerSupportModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-[#fcf8f3] border border-[#eadfd5] shadow-2xl p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-2xl font-bold text-[#17171a]">
                {drawerSupportModal}
              </h3>
              <button
                type="button"
                onClick={() => setDrawerSupportModal(null)}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716c] hover:text-[#17171a]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#4a4542] leading-relaxed">
              {drawerSupportModal === 'Help & Support' &&
                'Our Srinagar and New Delhi styling specialists are available Monday through Saturday to assist with sizing, custom Aari embroidery requests, and garment care.'}
              {drawerSupportModal === 'Shipping' &&
                'All handcrafted Shafiya orders ship in protective heirloom muslin packaging from our Srinagar atelier with insured express delivery across India and worldwide.'}
              {drawerSupportModal === 'Returns' &&
                'Ready-to-wear ensembles and stoles may be exchanged or returned within 14 days of delivery in unworn condition with original artisan tags intact.'}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
