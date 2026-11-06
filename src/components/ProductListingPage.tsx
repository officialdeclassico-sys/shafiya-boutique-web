import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
  Star,
  X,
  RotateCcw,
} from 'lucide-react';
import { Header, NavItemKey } from './Header';
import { Footer } from './Footer';
import { BagItem } from '../data/heroSlides';
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
  SizeOption,
  ALL_SIZES,
  ALL_CATALOG_CATEGORIES,
} from '../data/productsData';
import { getAssetUrl } from '../utils/assetPath';

interface ProductListingPageProps {
  embeddedInHomepage?: boolean;
  onOpenSignIn: () => void;
  onNavigate: (page: NavItemKey) => void;
  onOpenProduct: (
    productSlug: string,
    initialColourIdx?: number,
    initialSize?: SizeOption,
    scrollToReviews?: boolean
  ) => void;
  onOpenBagPage?: () => void;
  selectedCollectionCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
  bagItems: BagItem[];
  onAddVariantToBag: (
    product: CatalogProduct,
    colourName: string,
    size: SizeOption,
    quantity: number,
    variantImage: string
  ) => void;
  onRemoveBagItem: (id: string) => void;
  onUpdateBagQuantity?: (id: string, delta: number) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onToggleHeaderWishlist?: () => void;
}

const CATEGORY_FILTER_OPTIONS = ALL_CATALOG_CATEGORIES;

function getCardCategoryLabel(product: CatalogProduct): string {
  if (product.cardCategoryLabel && product.cardCategoryLabel.trim().length > 0) {
    return product.cardCategoryLabel;
  }
  switch (product.category) {
    case 'Kurtas':
      return 'Ethnic Wear';
    case 'Kurta Sets':
      return 'Festive Wear';
    case 'Kashmiri Embroidered Suits':
    case 'Suits':
      return 'Kashmiri Collection';
    case 'Pherans':
      return 'Traditional Collection';
    case 'Palazzo Sets':
    case 'Pant Sets':
      return 'Everyday Elegance';
    case 'Dupatta Sets':
    case 'Shawls':
    case 'Stoles':
    case 'Accessories':
      return 'Occasion Wear';
    default:
      return product.collectionGroup || 'New Collection';
  }
}

const FABRIC_FILTER_OPTIONS = [
  'Cotton Silk',
  'Pure Silk',
  'Georgette',
  'Chiffon',
  'Wool Blend',
] as const;

const COLOUR_FILTER_OPTIONS = [
  { name: 'Black', hex: '#101014' },
  { name: 'Beige', hex: '#ead5bd' },
  { name: 'Pink', hex: '#eb93a4' },
  { name: 'Brown', hex: '#683716' },
  { name: 'Gold', hex: '#b5895a' },
  { name: 'Wine', hex: '#5e2129' },
  { name: 'Blue', hex: '#d5dfe4' },
] as const;

const WORK_TYPE_OPTIONS = [
  'Kiran Border',
  'Kashmiri Aari',
  'Sozni Embroidery',
  'Zari & Gota',
  'Tilla Work',
  'Printed & Embroidered',
] as const;

type SortOption =
  | 'Popularity'
  | 'Price: Low to High'
  | 'Price: High to Low'
  | 'Newest First';

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  embeddedInHomepage = false,
  onOpenSignIn,
  onNavigate,
  onOpenProduct,
  onOpenBagPage,
  selectedCollectionCategory = 'All',
  onSelectCategory,
  bagItems,
  onAddVariantToBag,
  onRemoveBagItem,
  onUpdateBagQuantity,
  wishlistIds,
  onToggleWishlist,
  onToggleHeaderWishlist,
}) => {
  // Filter states — supports all 10 categories and syncs with header category selection
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (
      selectedCollectionCategory &&
      selectedCollectionCategory !== 'All' &&
      selectedCollectionCategory !== 'Custom Designs'
    ) {
      if (selectedCollectionCategory === 'Suits') {
        return ['Kashmiri Embroidered Suits'];
      }
      return [selectedCollectionCategory];
    }
    return embeddedInHomepage ? [] : [];
  });
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<SizeOption[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);

  // Sync external selectedCollectionCategory when user clicks a category in Header / Drawer
  useEffect(() => {
    if (!selectedCollectionCategory || selectedCollectionCategory === 'All') {
      setSelectedCategories([]);
    } else if (selectedCollectionCategory === 'Suits') {
      setSelectedCategories(['Kashmiri Embroidered Suits']);
    } else if (selectedCollectionCategory !== 'Custom Designs') {
      setSelectedCategories([selectedCollectionCategory]);
    }
  }, [selectedCollectionCategory]);

  // Sorting & View Mode
  const [sortBy, setSortBy] = useState<SortOption>('Popularity');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Desktop Filter Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    fabric: true,
    size: false,
    colour: false,
    workType: false,
  });

  // Mobile Filter Modal state (compact centred modal)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Prevent background scrolling while mobile centred filter popup is open
  useEffect(() => {
    if (mobileFilterOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileFilterOpen]);

  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleArrayFilter = <T extends string>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T
  ) => {
    setList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    onSelectCategory?.('All');
    setMaxPrice(5000);
    setSelectedFabrics([]);
    setSelectedSizes([]);
    setSelectedColours([]);
    setSelectedWorkTypes([]);
  };

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = CATALOG_PRODUCTS.filter((product) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }
      if (product.price < 500 || product.price > maxPrice) {
        return false;
      }
      if (
        selectedFabrics.length > 0 &&
        !selectedFabrics.includes(product.fabric)
      ) {
        return false;
      }
      if (selectedSizes.length > 0) {
        const productSizes = new Set(
          product.colours.flatMap((c) => c.availableSizes)
        );
        const matchesSize = selectedSizes.some((s) => productSizes.has(s));
        if (!matchesSize) return false;
      }
      if (selectedColours.length > 0) {
        const matchesColour = product.colours.some((c) =>
          selectedColours.includes(c.filterGroup)
        );
        if (!matchesColour) return false;
      }
      if (
        selectedWorkTypes.length > 0 &&
        !selectedWorkTypes.includes(product.workType)
      ) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Newest First') return a.newestRank - b.newestRank;
      return a.popularityRank - b.popularityRank;
    });
  }, [
    selectedCategories,
    maxPrice,
    selectedFabrics,
    selectedSizes,
    selectedColours,
    selectedWorkTypes,
    sortBy,
  ]);

  const isUnfiltered =
    selectedCategories.length === 0 &&
    maxPrice === 5000 &&
    selectedFabrics.length === 0 &&
    selectedSizes.length === 0 &&
    selectedColours.length === 0 &&
    selectedWorkTypes.length === 0;

  const handleCardAddToBag = (
    e: React.MouseEvent,
    product: CatalogProduct
  ) => {
    e.stopPropagation();
    const defaultCIdx = 0;
    const activeColour = product.colours[defaultCIdx] ?? product.colours[0];

    onAddVariantToBag(
      product,
      activeColour.name,
      product.defaultSize,
      1,
      activeColour.image
    );
    setJustAddedId(product.id);
    window.setTimeout(() => {
      setJustAddedId((prev) => (prev === product.id ? null : prev));
    }, 1400);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedFabrics.length +
    selectedSizes.length +
    selectedColours.length +
    selectedWorkTypes.length +
    (maxPrice < 5000 ? 1 : 0);

  const activeHeadingTitle =
    selectedCategories.length === 1
      ? selectedCategories[0]
      : selectedWorkTypes.length === 1
      ? selectedWorkTypes[0]
      : 'Kiran Border';

  return (
    <div
      id="collection-catalog-section"
      className={`${
        embeddedInHomepage ? '' : 'min-h-screen'
      } w-full bg-[#fcf9f5] flex flex-col justify-between overflow-x-clip`}
    >
      {/* =====================================================================
          1. SHARED WEBSITE HEADER & CATEGORY HERO BANNER
          (Rendered when on the dedicated Collections page; omitted when
           embedded immediately below the Homepage Hero Banner)
          ===================================================================== */}
      {!embeddedInHomepage && (
        <>
          <div className="w-full bg-[#fcf9f5] border-b border-[#f1e9e0]">
            <Header
              activePage="Collections"
              ecommerceMobileHeader
              onOpenBagPage={onOpenBagPage}
              onNavigate={onNavigate}
              onOpenSignIn={onOpenSignIn}
              onSelectCategory={(cat) => {
                onSelectCategory?.(cat);
                if (cat === 'Custom Designs') {
                  onNavigate('Custom Designs');
                }
              }}
              bagItems={bagItems}
              onRemoveBagItem={onRemoveBagItem}
              onUpdateBagQuantity={onUpdateBagQuantity}
              wishlistIds={wishlistIds}
              wishlistActive={wishlistIds.length > 0}
              onToggleHeaderWishlist={onToggleHeaderWishlist}
              onToggleWishlistItem={onToggleWishlist}
            />
          </div>

          <section
            aria-labelledby="plp-category-hero-heading"
            className="relative w-full bg-[#fcf9f6] border-b border-[#eee4da] overflow-hidden select-none"
          >
            <h1 id="plp-category-hero-heading" className="sr-only">
              Our Collections — Kurtas, Ethnic Sets — Everyday Elegance
            </h1>
            <div className="relative w-full aspect-[2172/724] max-w-[2560px] mx-auto overflow-hidden bg-[#fcf9f6]">
              <img
                src={getAssetUrl(
                  'assets/aistudio/Kashmiri_Elegance_Collection_Banner_76c1c0d4.png'
                )}
                alt="Our Collections — Kurtas, Ethnic Sets — Everyday Elegance: Beautifully crafted kurtas, suits and ethnic sets in timeless Kashmiri designs"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain object-center block pointer-events-none"
              />
            </div>
          </section>
        </>
      )}

      {/* =====================================================================
          2. BREADCRUMBS, HEADING, SORTING & PRODUCT LISTING BODY
          ===================================================================== */}
      <div className="w-full flex-1 px-3.5 sm:px-6 lg:px-[4.5%] xl:px-[5%] pt-4 sm:pt-5 pb-16">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs text-[#726d68] mb-2"
        >
          <button
            type="button"
            onClick={() => onNavigate('Home')}
            className="hover:text-[#f81d5c] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-[#a8a29d]" />
          <button
            type="button"
            onClick={handleResetFilters}
            className="hover:text-[#f81d5c] transition-colors cursor-pointer"
          >
            Clothing and Ethnic Wear
          </button>
          <ChevronRight className="w-3 h-3 text-[#a8a29d]" />
          <span className="font-medium text-[#2c2826]">
            {selectedCategories.length === 1
              ? selectedCategories[0]
              : selectedCategories.length > 1
              ? selectedCategories.join(', ')
              : 'Kurtas, Ethnic Sets'}
          </span>
        </nav>

        {/* Category Title + Product Count + Sort & Grid/List Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-3.5 border-b border-[#efe7de]">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] tracking-[-0.01em]">
              {activeHeadingTitle}
            </h2>
            <span className="font-ui text-[11.5px] sm:text-[13px] text-[#78726d]">
              (Showing 1 – {filteredAndSortedProducts.length} of{' '}
              {CATALOG_PRODUCTS.length} products)
            </span>
          </div>

          {/* Right Controls: Mobile Filter Button + Sort Dropdown + Grid/List View Toggle */}
          <div className="flex items-center justify-between lg:justify-end gap-2">
            {/* Mobile Filter Modal Trigger (< lg) matching Screen 1 pink-outlined pill */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-[#fff5f8] border border-[#f81d5c]/65 text-xs font-semibold text-[#f81d5c] shadow-2xs cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#f81d5c]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="min-w-[17px] h-[17px] px-1 rounded-full bg-[#f81d5c] text-white text-[10px] font-bold inline-flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2.5">
              {/* Sort By Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen((prev) => !prev)}
                  aria-expanded={sortDropdownOpen}
                  aria-haspopup="listbox"
                  className="h-9 sm:h-10 px-3.5 rounded-xl bg-white border border-[#e6ded6] hover:border-[#d5cbc0] text-xs sm:text-[13px] text-[#17171a] inline-flex items-center gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.02)] cursor-pointer"
                >
                  <span className="text-[#78726d]">Sort By</span>
                  <span className="h-3.5 w-[1px] bg-[#e2dad1]" />
                  <span className="font-semibold text-[#141416] min-w-[92px] text-left">
                    {sortBy}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#57524e]" />
                </button>

                {sortDropdownOpen && (
                  <div
                    role="listbox"
                    className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-white border border-[#eadfd5] shadow-xl p-1.5 z-30"
                  >
                    {(
                      [
                        'Popularity',
                        'Price: Low to High',
                        'Price: High to Low',
                        'Newest First',
                      ] as SortOption[]
                    ).map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={sortBy === option}
                        onClick={() => {
                          setSortBy(option);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          sortBy === option
                            ? 'bg-[#fdecef] text-[#f81d5c] font-semibold'
                            : 'text-[#262423] hover:bg-[#f7f2ec]'
                        }`}
                      >
                        <span>{option}</span>
                        {sortBy === option && (
                          <Check className="w-3.5 h-3.5 text-[#f81d5c]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid / List View Switcher matching Reference Image 1 */}
              <div
                role="group"
                aria-label="View mode"
                className="inline-flex items-center rounded-xl bg-white border border-[#e6ded6] p-0.5"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#fdecef] text-[#f81d5c] border border-[#f81d5c]/40'
                      : 'text-[#6e6762] hover:text-[#17171a]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 stroke-[2]" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#fdecef] text-[#f81d5c] border border-[#f81d5c]/40'
                      : 'text-[#6e6762] hover:text-[#17171a]'
                  }`}
                >
                  <List className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
             MAIN 2-COLUMN LAYOUT: LEFT FILTER SIDEBAR + RIGHT PRODUCT GRID
            ================================================================= */}
        <div className="mt-5 flex flex-col lg:flex-row items-start gap-6 xl:gap-8">
          {/* LEFT-SIDE FILTER PANEL (Desktop lg:block, Sticky with independent internal scroll) */}
          <aside
            aria-label="Product Filters"
            className="hidden lg:block w-[280px] xl:w-[300px] 2xl:w-[320px] shrink-0 sticky top-6 self-start max-h-[calc(100vh-2.5rem)] overflow-y-auto custom-filter-scrollbar overscroll-contain rounded-[24px] bg-white border border-[#ece3da] shadow-[0_4px_20px_rgba(24,24,27,0.03)] p-5 xl:p-6"
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#f0e8df]">
              <span className="font-ui text-[15px] xl:text-base font-bold text-[#141824] tracking-[-0.01em]">
                Filters
              </span>
              <div className="flex items-center gap-2.5">
                {!isUnfiltered && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs xl:text-[13px] font-semibold text-[#f81d5c] hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
                <SlidersHorizontal className="w-4 h-4 xl:w-4.5 xl:h-4.5 text-[#57524e]" />
              </div>
            </div>

            {/* 1. Category Filter (All 10 Categories) */}
            <div className="py-4 xl:py-4.5 border-b border-[#f0e8df]">
              <button
                type="button"
                onClick={() => toggleSection('category')}
                aria-expanded={openSections.category}
                className="w-full flex items-center justify-between text-left font-ui text-[13.5px] xl:text-[14.5px] font-bold text-[#141824] hover:text-[#f81d5c] transition-colors cursor-pointer"
              >
                <span>Category</span>
                {openSections.category ? (
                  <ChevronUp className="w-4 h-4 text-[#57524e]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#57524e]" />
                )}
              </button>
              {openSections.category && (
                <div className="mt-3 space-y-2.5">
                  {CATEGORY_FILTER_OPTIONS.map((cat) => {
                    const checked = selectedCategories.includes(cat);
                    return (
                      <label
                        key={cat}
                        className="group flex items-center gap-3 text-[13px] xl:text-[14px] text-[#423d39] hover:text-[#141824] cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleArrayFilter(
                              selectedCategories,
                              setSelectedCategories,
                              cat
                            )
                          }
                          className="sr-only"
                        />
                        <span
                          className={`w-[18px] h-[18px] rounded-[5px] border shrink-0 flex items-center justify-center transition-all ${
                            checked
                              ? 'bg-[#f81d5c] border-[#f81d5c] text-white shadow-2xs'
                              : 'bg-white border-[#d1c7bc] group-hover:border-[#f81d5c]'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 stroke-[2.8]" />}
                        </span>
                        <span
                          className={
                            checked
                              ? 'font-semibold text-[#141824]'
                              : 'transition-colors'
                          }
                        >
                          {cat}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Price Range Filter */}
            <div className="py-4 xl:py-4.5 border-b border-[#f0e8df]">
              <button
                type="button"
                onClick={() => toggleSection('price')}
                aria-expanded={openSections.price}
                className="w-full flex items-center justify-between text-left font-ui text-[13.5px] xl:text-[14.5px] font-bold text-[#141824] hover:text-[#f81d5c] transition-colors cursor-pointer"
              >
                <span>Price Range</span>
                {openSections.price ? (
                  <ChevronUp className="w-4 h-4 text-[#57524e]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#57524e]" />
                )}
              </button>
              {openSections.price && (
                <div className="mt-3.5 space-y-2.5">
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min={500}
                      max={5000}
                      step={100}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      aria-label="Maximum price range"
                      className="w-full h-2 bg-[#fce2ea] rounded-lg appearance-none cursor-pointer accent-[#f81d5c]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs xl:text-[13px] font-semibold text-[#524d48] tabular-nums">
                    <span>₹500</span>
                    <span>–</span>
                    <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Fabric Filter */}
            <div className="py-4 xl:py-4.5 border-b border-[#f0e8df]">
              <button
                type="button"
                onClick={() => toggleSection('fabric')}
                aria-expanded={openSections.fabric}
                className="w-full flex items-center justify-between text-left font-ui text-[13.5px] xl:text-[14.5px] font-bold text-[#141824] hover:text-[#f81d5c] transition-colors cursor-pointer"
              >
                <span>Fabric</span>
                {openSections.fabric ? (
                  <ChevronUp className="w-4 h-4 text-[#57524e]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#57524e]" />
                )}
              </button>
              {openSections.fabric && (
                <div className="mt-3 space-y-2.5">
                  {FABRIC_FILTER_OPTIONS.map((fab) => {
                    const checked = selectedFabrics.includes(fab);
                    return (
                      <label
                        key={fab}
                        className="group flex items-center gap-3 text-[13px] xl:text-[14px] text-[#423d39] hover:text-[#141824] cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleArrayFilter(
                              selectedFabrics,
                              setSelectedFabrics,
                              fab
                            )
                          }
                          className="sr-only"
                        />
                        <span
                          className={`w-[18px] h-[18px] rounded-[5px] border shrink-0 flex items-center justify-center transition-all ${
                            checked
                              ? 'bg-[#f81d5c] border-[#f81d5c] text-white shadow-2xs'
                              : 'bg-white border-[#d1c7bc] group-hover:border-[#f81d5c]'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 stroke-[2.8]" />}
                        </span>
                        <span
                          className={
                            checked
                              ? 'font-semibold text-[#141824]'
                              : 'transition-colors'
                          }
                        >
                          {fab}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Size Filter */}
            <div className="py-4 xl:py-4.5 border-b border-[#f0e8df]">
              <button
                type="button"
                onClick={() => toggleSection('size')}
                aria-expanded={openSections.size}
                className="w-full flex items-center justify-between text-left font-ui text-[13.5px] xl:text-[14.5px] font-bold text-[#141824] hover:text-[#f81d5c] transition-colors cursor-pointer"
              >
                <span>Size</span>
                {openSections.size ? (
                  <ChevronUp className="w-4 h-4 text-[#57524e]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#57524e]" />
                )}
              </button>
              {openSections.size && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {ALL_SIZES.map((sz) => {
                    const active = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() =>
                          toggleArrayFilter(selectedSizes, setSelectedSizes, sz)
                        }
                        className={`h-8.5 xl:h-9 rounded-lg text-xs xl:text-[13px] font-semibold border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#f81d5c] text-white border-[#f81d5c] shadow-2xs'
                            : 'bg-white text-[#373a47] border-[#dfd7ce] hover:border-[#f81d5c] hover:text-[#f81d5c]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Colour Filter */}
            <div className="py-4 xl:py-4.5 border-b border-[#f0e8df]">
              <button
                type="button"
                onClick={() => toggleSection('colour')}
                aria-expanded={openSections.colour}
                className="w-full flex items-center justify-between text-left font-ui text-[13.5px] xl:text-[14.5px] font-bold text-[#141824] hover:text-[#f81d5c] transition-colors cursor-pointer"
              >
                <span>Colour</span>
                {openSections.colour ? (
                  <ChevronUp className="w-4 h-4 text-[#57524e]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#57524e]" />
                )}
              </button>
              {openSections.colour && (
                <div className="mt-3 space-y-2.5">
                  {COLOUR_FILTER_OPTIONS.map((col) => {
                    const active = selectedColours.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() =>
                          toggleArrayFilter(
                            selectedColours,
                            setSelectedColours,
                            col.name
                          )
                        }
                        className="w-full flex items-center gap-3 text-left text-[13px] xl:text-[14px] text-[#423d39] hover:text-[#141824] cursor-pointer py-0.5"
                      >
                        <span
                          style={{ backgroundColor: col.hex }}
                          className={`w-[18px] h-[18px] rounded-full border shrink-0 transition-transform ${
                            active
                              ? 'ring-2 ring-[#f81d5c] ring-offset-2 border-white scale-105'
                              : 'border-black/15'
                          }`}
                        />
                        <span
                          className={
                            active ? 'font-semibold text-[#f81d5c]' : 'transition-colors'
                          }
                        >
                          {col.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 6. Work Type Filter */}
            <div className="pt-4 xl:pt-4.5">
              <button
                type="button"
                onClick={() => toggleSection('workType')}
                aria-expanded={openSections.workType}
                className="w-full flex items-center justify-between text-left font-ui text-[13.5px] xl:text-[14.5px] font-bold text-[#141824] hover:text-[#f81d5c] transition-colors cursor-pointer"
              >
                <span>Work Type</span>
                {openSections.workType ? (
                  <ChevronUp className="w-4 h-4 text-[#57524e]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#57524e]" />
                )}
              </button>
              {openSections.workType && (
                <div className="mt-3 space-y-2.5">
                  {WORK_TYPE_OPTIONS.map((wt) => {
                    const checked = selectedWorkTypes.includes(wt);
                    return (
                      <label
                        key={wt}
                        className="group flex items-center gap-3 text-[13px] xl:text-[14px] text-[#423d39] hover:text-[#141824] cursor-pointer select-none py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleArrayFilter(
                              selectedWorkTypes,
                              setSelectedWorkTypes,
                              wt
                            )
                          }
                          className="sr-only"
                        />
                        <span
                          className={`w-[18px] h-[18px] rounded-[5px] border shrink-0 flex items-center justify-center transition-all ${
                            checked
                              ? 'bg-[#f81d5c] border-[#f81d5c] text-white shadow-2xs'
                              : 'bg-white border-[#d1c7bc] group-hover:border-[#f81d5c]'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 stroke-[2.8]" />}
                        </span>
                        <span
                          className={
                            checked
                              ? 'font-semibold text-[#141824]'
                              : 'transition-colors'
                          }
                        >
                          {wt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT PRODUCT CARDS AREA (2 per row on mobile, 4 per row on desktop in Grid mode) */}
          <div className="flex-1 min-w-0 w-full">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="rounded-3xl bg-white border border-[#ece3da] p-12 text-center space-y-3">
                <p className="font-editorial text-3xl text-[#141824]">
                  No Kashmiri Creations Match Your Filters
                </p>
                <p className="font-ui text-xs sm:text-sm text-[#68635e] max-w-md mx-auto">
                  Try expanding your price range or clearing one of your
                  selected category, fabric, or size filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#f81d5c] text-white text-xs font-semibold hover:bg-[#e0154f] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All Creations</span>
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 xl:gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredAndSortedProducts.map((product) => {
                  const activeCIdx = 0;
                  const activeVariant =
                    product.colours[activeCIdx] ?? product.colours[0];
                  const isWishlisted = wishlistIds.includes(product.id);
                  const isJustAdded = justAddedId === product.id;
                  const fullStars = Math.floor(product.rating);
                  const hasHalfStar = product.rating - fullStars >= 0.25;

                  return (
                    <article
                      key={product.id}
                      onClick={() =>
                        onOpenProduct(
                          product.slug,
                          activeCIdx,
                          product.defaultSize,
                          false
                        )
                      }
                      className={`group rounded-[20px] sm:rounded-[24px] bg-white border border-[#eee5dc] p-2 sm:p-3 shadow-[0_6px_24px_rgba(24,24,27,0.04)] hover:shadow-[0_14px_34px_rgba(24,24,27,0.09)] transition-all duration-300 cursor-pointer ${
                        viewMode === 'list'
                          ? 'flex flex-col sm:flex-row items-stretch gap-3 sm:gap-5'
                          : 'flex flex-col justify-between'
                      }`}
                    >
                      {/* 1. Product Image with Very Small Top-Right Wishlist Icon */}
                      <div
                        className={`relative overflow-hidden rounded-[14px] sm:rounded-[18px] bg-[#f4ede6] ${
                          viewMode === 'list'
                            ? 'w-full sm:w-60 shrink-0 aspect-[163/189]'
                            : 'w-full aspect-[163/189]'
                        }`}
                      >
                        <img
                          src={getAssetUrl(activeVariant.image)}
                          alt={`${product.name} — ${activeVariant.name}`}
                          referrerPolicy="no-referrer"
                          style={{
                            filter: activeVariant.imageFilter ?? 'none',
                          }}
                          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-104"
                        />

                        {/* Tiny Subtle Top-Right Wishlist Heart Icon */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product.id);
                          }}
                          aria-label={
                            isWishlisted
                              ? `Remove ${product.name} from wishlist`
                              : `Add ${product.name} to wishlist`
                          }
                          aria-pressed={isWishlisted}
                          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/95 hover:bg-white shadow-xs flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        >
                          <Heart
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2] transition-colors ${
                              isWishlisted
                                ? 'fill-[#f81d5c] text-[#f81d5c]'
                                : 'text-[#1e1e24]'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Content Body */}
                      <div
                        className={`flex-1 flex flex-col justify-between ${
                          viewMode === 'list'
                            ? 'py-1 sm:py-2 px-1'
                            : 'pt-2 sm:pt-2.5 px-0.5 sm:px-1 pb-0'
                        }`}
                      >
                        <div>
                          {/* 2. Rating Row + Subtle Vertical Separator + Collection Label */}
                          <div className="flex items-center justify-between gap-1.5 sm:gap-2 min-h-[26px] sm:min-h-[30px]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenProduct(
                                  product.slug,
                                  activeCIdx,
                                  product.defaultSize,
                                  true
                                );
                              }}
                              aria-label={`Read ${product.reviewCount} customer reviews for ${product.name} (rated ${product.rating} out of 5)`}
                              className="group/rating flex-1 flex flex-col items-start text-left min-w-0 cursor-pointer"
                            >
                              {/* Stars Row */}
                              <span className="flex items-center gap-0.5 text-[#f81d5c]">
                                {[1, 2, 3, 4, 5].map((starIdx) => {
                                  const isFull = starIdx <= fullStars;
                                  const isHalf =
                                    !isFull &&
                                    starIdx === fullStars + 1 &&
                                    hasHalfStar;
                                  return (
                                    <span
                                      key={starIdx}
                                      className="relative inline-flex w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0"
                                    >
                                      <Star
                                        className={`w-full h-full stroke-[1.9] ${
                                          isFull
                                            ? 'fill-[#f81d5c] text-[#f81d5c]'
                                            : 'text-[#f81d5c]'
                                        }`}
                                      />
                                      {isHalf && (
                                        <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#f81d5c] text-[#f81d5c] stroke-[1.9]" />
                                        </span>
                                      )}
                                    </span>
                                  );
                                })}
                              </span>

                              {/* Rating Number, Review Count & Sold Count — Fully visible without clipping */}
                              <span className="mt-0.5 font-ui text-[8.5px] sm:text-[10.5px] xl:text-[11px] leading-tight tracking-[-0.015em] text-[#4a4542] group-hover/rating:text-[#f81d5c] transition-colors whitespace-nowrap">
                                <strong className="font-bold text-[#141824] group-hover/rating:text-[#f81d5c]">
                                  {product.rating}
                                </strong>{' '}
                                ({product.reviewCount} reviews) ·{' '}
                                {product.soldCount} sold
                              </span>
                            </button>

                            {/* Subtle Vertical Separator & Category/Collection Label Aligned at Identical Horizontal Position */}
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                              <span
                                aria-hidden="true"
                                className="self-center h-6 sm:h-7 w-px bg-[#dfd7ce] shrink-0"
                              />
                              <span className="w-[48px] sm:w-[64px] shrink-0 font-ui text-[8.5px] sm:text-[10.5px] font-medium text-[#3a3633] text-right leading-[1.18] line-clamp-2">
                                {getCardCategoryLabel(product)}
                              </span>
                            </div>
                          </div>

                          {/* 3. Product Title */}
                          <h3 className="mt-1.5 sm:mt-2 font-ui text-xs sm:text-[15px] font-bold text-[#141824] group-hover:text-[#f81d5c] transition-colors leading-[1.3] line-clamp-2">
                            {product.name}
                          </h3>

                          {/* 4. Single-Line Pricing: Selling Price + Strikethrough Original Price + Green Discount Percentage */}
                          <div className="mt-1.5 flex items-center flex-nowrap gap-1 sm:gap-2 whitespace-nowrap overflow-hidden">
                            <span className="font-ui text-[13px] sm:text-[17px] xl:text-[18px] font-extrabold text-[#121829] tabular-nums leading-none shrink-0">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="font-ui text-[10px] sm:text-[12.5px] text-[#9a948e] line-through tabular-nums leading-none shrink-0">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="font-ui text-[10px] sm:text-[12.5px] font-bold text-[#15803d] leading-none shrink-0">
                              {product.discountPercent}% off
                            </span>
                          </div>
                        </div>

                        {/* 5. Full-Width Add to Bag Button */}
                        <button
                          type="button"
                          onClick={(e) => handleCardAddToBag(e, product)}
                          className={`mt-2 sm:mt-2.5 w-full h-8.5 sm:h-9.5 rounded-full font-ui text-xs sm:text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isJustAdded
                              ? 'bg-[#15803d] text-white shadow-xs'
                              : 'bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] hover:from-[#e0144f] hover:to-[#eb1e5c] text-white shadow-[0_4px_14px_rgba(248,29,92,0.25)]'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[2.3]" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. SCREEN 2 — MOBILE CENTRED FILTER POPUP
          (Small, centred modal with visible margins, horizontal touch-scrolling
           rows with NO visible scrollbars)
          ===================================================================== */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          onClick={() => setMobileFilterOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-36px)] max-w-[352px] max-h-[min(78dvh,600px)] rounded-[28px] bg-[#fcf9f5] border border-[#eadfd5] shadow-[0_20px_50px_rgba(0,0,0,0.28)] flex flex-col overflow-hidden"
          >
            {/* Popup Header with Decorative Pink Floral Artwork matching Screen 2 */}
            <div className="relative px-5 py-3.5 bg-white border-b border-[#efe6dd] flex items-center justify-between shrink-0 overflow-hidden">
              <img
                src={getAssetUrl('assets/aistudio/collections_flower_right.png')}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute -top-2 right-8 w-20 h-auto object-contain opacity-65 pointer-events-none select-none"
              />
              <h3 className="relative z-10 font-editorial text-2xl font-bold text-[#141824]">
                Filters
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[#3a3633] hover:bg-[#f4ece4] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Internally Scrollable Popup Content */}
            <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
              {/* 1. Category — HORIZONTAL TOUCH-SCROLLING ROW (NO VISIBLE SCROLLBAR) */}
              <div>
                <p className="font-ui text-xs font-bold text-[#141824] mb-2">
                  Category
                </p>
                <div
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap pb-1"
                >
                  {CATEGORY_FILTER_OPTIONS.map((cat) => {
                    const active = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          toggleArrayFilter(
                            selectedCategories,
                            setSelectedCategories,
                            cat
                          )
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#f81d5c] text-white border-[#f81d5c] shadow-2xs'
                            : 'bg-white text-[#262423] border-[#e2dad1]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Price Range Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-ui text-xs font-bold text-[#141824]">
                    Price Range
                  </span>
                  <ChevronUp className="w-3.5 h-3.5 text-[#78726d]" />
                </div>
                <input
                  type="range"
                  min={500}
                  max={5000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label="Maximum price"
                  className="w-full h-1.5 bg-[#fce2ea] rounded-lg appearance-none cursor-pointer accent-[#f81d5c]"
                />
                <div className="mt-1 flex items-center justify-between font-ui text-[11px] font-medium text-[#6e6862] tabular-nums">
                  <span>₹500</span>
                  <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* 3. Fabric — HORIZONTAL TOUCH-SCROLLING ROW (NO VISIBLE SCROLLBAR) */}
              <div>
                <p className="font-ui text-xs font-bold text-[#141824] mb-2">
                  Fabric
                </p>
                <div
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap pb-1"
                >
                  {FABRIC_FILTER_OPTIONS.map((fab) => {
                    const active = selectedFabrics.includes(fab);
                    return (
                      <button
                        key={fab}
                        type="button"
                        onClick={() =>
                          toggleArrayFilter(
                            selectedFabrics,
                            setSelectedFabrics,
                            fab
                          )
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#f81d5c] text-white border-[#f81d5c] shadow-2xs'
                            : 'bg-white text-[#262423] border-[#e2dad1]'
                        }`}
                      >
                        {fab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Size */}
              <div>
                <p className="font-ui text-xs font-bold text-[#141824] mb-2">
                  Size
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {ALL_SIZES.map((sz) => {
                    const active = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() =>
                          toggleArrayFilter(selectedSizes, setSelectedSizes, sz)
                        }
                        className={`h-8 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#f81d5c] text-white border-[#f81d5c]'
                            : 'bg-white text-[#262423] border-[#e2dad1]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Colour — HORIZONTALLY SCROLLABLE SWATCH ROW (NO VISIBLE SCROLLBAR) */}
              <div>
                <p className="font-ui text-xs font-bold text-[#141824] mb-2">
                  Colour
                </p>
                <div
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  className="flex items-center gap-2.5 overflow-x-auto no-scrollbar flex-nowrap py-1 px-0.5"
                >
                  {COLOUR_FILTER_OPTIONS.map((col) => {
                    const active = selectedColours.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() =>
                          toggleArrayFilter(
                            selectedColours,
                            setSelectedColours,
                            col.name
                          )
                        }
                        title={col.name}
                        aria-label={`Filter by colour ${col.name}`}
                        aria-pressed={active}
                        style={{ backgroundColor: col.hex }}
                        className={`w-7 h-7 rounded-full shrink-0 transition-transform cursor-pointer ${
                          active
                            ? 'ring-2 ring-[#f81d5c] ring-offset-2 ring-offset-[#fcf9f5] scale-105'
                            : 'border border-black/15'
                        }`}
                      />
                    );
                  })}
                  <span className="w-7 h-7 rounded-full bg-white border border-[#e2dad1] text-[10.5px] font-semibold text-[#57524e] flex items-center justify-center shrink-0">
                    +3
                  </span>
                </div>
              </div>

              {/* 6. Work Type — HORIZONTAL TOUCH-SCROLLING ROW (NO VISIBLE SCROLLBAR) */}
              <div>
                <p className="font-ui text-xs font-bold text-[#141824] mb-2">
                  Work Type
                </p>
                <div
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap pb-1"
                >
                  {WORK_TYPE_OPTIONS.map((wt) => {
                    const active = selectedWorkTypes.includes(wt);
                    return (
                      <button
                        key={wt}
                        type="button"
                        onClick={() =>
                          toggleArrayFilter(
                            selectedWorkTypes,
                            setSelectedWorkTypes,
                            wt
                          )
                        }
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#f81d5c] border-[#f81d5c] text-white shadow-2xs'
                            : 'bg-white border-[#e2dad1] text-[#262423]'
                        }`}
                      >
                        {wt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Fixed Bottom Footer: Reset & Apply Filters Buttons matching Screen 2 */}
            <div className="px-4 py-3.5 bg-white border-t border-[#efe6dd] flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 h-10 rounded-full bg-white border border-[#f81d5c]/65 text-xs font-semibold text-[#f81d5c] hover:bg-[#fff2f6] transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-[1.35] h-10 rounded-full bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] hover:from-[#e0144f] hover:to-[#eb1e5c] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Apply Filters ({filteredAndSortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. SHARED WEBSITE FOOTER
          ===================================================================== */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
