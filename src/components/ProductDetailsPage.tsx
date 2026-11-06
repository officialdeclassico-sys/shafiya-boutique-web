import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  ShoppingBag,
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ArrowLeft,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Ruler,
  Play,
  X,
  Check,
  Sparkles,
  Shirt,
  Minus,
  Plus,
  ThumbsUp,
  Share2,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Header, NavItemKey } from './Header';
import { Footer } from './Footer';
import { BagItem } from '../data/heroSlides';
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
  SizeOption,
  ALL_SIZES,
  SAMPLE_SIZE_GUIDE_CHART,
  ProductReviewItem,
} from '../data/productsData';
import { getAssetUrl } from '../utils/assetPath';

interface ProductDetailsPageProps {
  productSlug: string;
  initialColourIdx?: number;
  initialSize?: SizeOption;
  scrollToReviewsRequest?: number;
  onClearScrollToReviews?: () => void;
  onOpenSignIn: () => void;
  onNavigate: (page: NavItemKey) => void;
  onBackToListing: (categoryFilter?: string) => void;
  onOpenProduct: (
    productSlug: string,
    colourIdx?: number,
    size?: SizeOption,
    scrollToReviews?: boolean
  ) => void;
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
  onOpenBagPage?: () => void;
  onBuyNowProceedToCheckout?: () => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onToggleHeaderWishlist?: () => void;
}

type ReviewFilterKey = 'all' | 'photos' | '5star' | '4star' | '3star';

function getReviewerInitials(author: string): string {
  const parts = author
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'CR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const ReviewerAvatar: React.FC<{ author: string; avatar?: string }> = ({
  author,
  avatar,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = getReviewerInitials(author);

  if (avatar && !imgFailed) {
    return (
      <img
        src={getAssetUrl(avatar)}
        alt={author}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-9 h-9 rounded-full object-cover object-top border border-[#e5ddd4] shrink-0"
      />
    );
  }

  return (
    <div
      aria-label={author}
      className="w-9 h-9 rounded-full border border-[#e5ddd4] bg-[#f6ede4] text-[#8c3b52] font-ui text-xs font-bold flex items-center justify-center shrink-0 select-none"
    >
      {initials}
    </div>
  );
};

const ReviewReferencePhotos: React.FC<{
  reviewId: string;
  photos?: string[];
  productName: string;
  sizeClassName?: string;
  onOpenPhoto: (url: string) => void;
}> = ({
  reviewId,
  photos,
  productName,
  sizeClassName = 'w-16 h-16 sm:w-20 sm:h-20',
  onOpenPhoto,
}) => {
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>(
    {}
  );

  if (!photos || photos.length === 0) return null;

  const validPhotos = photos
    .map((url, idx) => ({ url, idx }))
    .filter(({ url, idx }) => Boolean(url) && !failedIndices[idx]);

  if (validPhotos.length === 0) return null;

  return (
    <div className="pt-1 space-y-1">
      <span className="block font-ui text-[10px] font-medium uppercase tracking-[0.08em] text-[#8a837c]">
        Product Reference
      </span>
      <div className="flex items-center gap-2">
        {validPhotos.map(({ url, idx }) => (
          <button
            key={`${reviewId}-photo-${idx}`}
            type="button"
            onClick={() => onOpenPhoto(url)}
            className={`${sizeClassName} rounded-xl overflow-hidden border border-[#e5ddd4] bg-[#f4ede6] shrink-0 cursor-pointer`}
          >
            <img
              src={getAssetUrl(url)}
              alt={`${productName} reference view ${idx + 1}`}
              referrerPolicy="no-referrer"
              onError={() =>
                setFailedIndices((prev) => ({ ...prev, [idx]: true }))
              }
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productSlug,
  initialColourIdx = 0,
  initialSize,
  scrollToReviewsRequest,
  onClearScrollToReviews,
  onOpenSignIn,
  onNavigate,
  onBackToListing,
  onOpenProduct,
  onSelectCategory,
  bagItems,
  onAddVariantToBag,
  onRemoveBagItem,
  onUpdateBagQuantity,
  onOpenBagPage,
  onBuyNowProceedToCheckout,
  wishlistIds,
  onToggleWishlist,
  onToggleHeaderWishlist,
}) => {
  const product =
    CATALOG_PRODUCTS.find((p) => p.slug === productSlug) ?? CATALOG_PRODUCTS[0];

  const [selectedColourIdx, setSelectedColourIdx] = useState<number>(
    initialColourIdx < product.colours.length ? initialColourIdx : 0
  );
  const activeColour =
    product.colours[selectedColourIdx] ?? product.colours[0];

  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(
    initialSize && activeColour.availableSizes.includes(initialSize)
      ? initialSize
      : product.defaultSize
  );
  const [sizeError, setSizeError] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);

  // Lightbox state (for customer review photos) & video preview state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [drapePreviewPlaying, setDrapePreviewPlaying] = useState(false);

  // Modals: Size Guide & Write a Review
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'in' | 'cm'>('in');
  const [justAddedToBag, setJustAddedToBag] = useState(false);
  const [addedRelatedId, setAddedRelatedId] = useState<string | null>(null);

  // Independent Accordion states (Screen 4 requirement: each section expands/collapses independently)
  const [leftDetailsExpanded, setLeftDetailsExpanded] = useState(true);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: false,
    fabric: false,
    sizeFit: false,
    shipping: false,
    reviews: false,
  });

  // Reviews Section (Screen 7) state — One Review at a Time + View All Reviews Modal
  const [reviewFilter, setReviewFilter] = useState<ReviewFilterKey>('all');
  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);
  const [viewAllReviewsModalOpen, setViewAllReviewsModalOpen] =
    useState<boolean>(false);
  const [modalReviewFilter, setModalReviewFilter] =
    useState<ReviewFilterKey>('all');
  const [visibleModalReviewCount, setVisibleModalReviewCount] =
    useState<number>(3);
  const [customReviews, setCustomReviews] = useState<ProductReviewItem[]>([]);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [expandedReviewIds, setExpandedReviewIds] = useState<
    Record<string, boolean>
  >({});
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewIncludePhoto, setNewReviewIncludePhoto] = useState(false);
  const [newReviewError, setNewReviewError] = useState('');

  // Touch swipe state for mobile gallery & single review card
  const touchStartX = useRef<number | null>(null);
  const reviewTouchStartX = useRef<number | null>(null);

  // Lock background scroll when Size Guide, Write Review, View All Reviews, or Lightbox modal is open
  useEffect(() => {
    if (
      sizeGuideOpen ||
      writeReviewOpen ||
      viewAllReviewsModalOpen ||
      lightboxOpen
    ) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [sizeGuideOpen, writeReviewOpen, viewAllReviewsModalOpen, lightboxOpen]);

  // Reset state when switching products
  useEffect(() => {
    const safeCIdx =
      initialColourIdx < product.colours.length ? initialColourIdx : 0;
    setSelectedColourIdx(safeCIdx);
    const col = product.colours[safeCIdx] ?? product.colours[0];
    setSelectedSize(
      initialSize && col.availableSizes.includes(initialSize)
        ? initialSize
        : col.availableSizes.includes(product.defaultSize)
        ? product.defaultSize
        : col.availableSizes[0] ?? null
    );
    setQuantity(1);
    setActiveGalleryIdx(0);
    setDrapePreviewPlaying(false);
    setSizeError('');
    setReviewFilter('all');
    setActiveReviewIdx(0);
    setModalReviewFilter('all');
    setVisibleModalReviewCount(3);
  }, [product.id, initialColourIdx, initialSize]);

  // Smoothly scroll to the Customer Reviews section when requested from a product card's rating row
  useEffect(() => {
    if (!scrollToReviewsRequest) return;
    const timer = window.setTimeout(() => {
      const reviewsEl = document.getElementById('pdp-customer-reviews-section');
      if (reviewsEl) {
        reviewsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      onClearScrollToReviews?.();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [scrollToReviewsRequest, product.id, onClearScrollToReviews]);

  const galleryItems = product.gallery;
  const currentGalleryItem =
    galleryItems[activeGalleryIdx] ?? galleryItems[0];

  const isWishlisted = wishlistIds.includes(product.id);

  const handleColourSelect = (idx: number) => {
    setSelectedColourIdx(idx);
    const nextColour = product.colours[idx] ?? product.colours[0];
    if (selectedSize && !nextColour.availableSizes.includes(selectedSize)) {
      setSelectedSize(nextColour.availableSizes[0] ?? null);
    }
    setSizeError('');
  };

  const handleSizeSelect = (sz: SizeOption) => {
    setSelectedSize(sz);
    setSizeError('');
  };

  const handleQuantityDelta = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stockQuantity) return product.stockQuantity;
      return next;
    });
  };

  const handleAddToBagClick = () => {
    if (!selectedSize || !activeColour.availableSizes.includes(selectedSize)) {
      setSizeError('Please select an available size before adding to bag.');
      return;
    }
    onAddVariantToBag(
      product,
      activeColour.name,
      selectedSize,
      quantity,
      activeColour.image
    );
    setJustAddedToBag(true);
    window.setTimeout(() => {
      setJustAddedToBag(false);
    }, 1600);
  };

  const handleBuyNowClick = () => {
    if (!selectedSize || !activeColour.availableSizes.includes(selectedSize)) {
      setSizeError('Please select a size to proceed with Buy Now.');
      return;
    }
    onAddVariantToBag(
      product,
      activeColour.name,
      selectedSize,
      quantity,
      activeColour.image
    );
    if (onBuyNowProceedToCheckout) {
      onBuyNowProceedToCheckout();
    } else if (onOpenBagPage) {
      onOpenBagPage();
    }
  };

  const handlePrevImage = () => {
    setDrapePreviewPlaying(false);
    setActiveGalleryIdx((prev) =>
      prev === 0 ? galleryItems.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setDrapePreviewPlaying(false);
    setActiveGalleryIdx((prev) =>
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 42) {
      if (deltaX < 0) handleNextImage();
      else handlePrevImage();
    }
    touchStartX.current = null;
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Screen 6: Related Products (Same category/similar fabric & price, excluding current product)
  const relatedProducts = CATALOG_PRODUCTS.filter(
    (p) => p.id !== product.id
  ).slice(0, 4);

  // Screen 7: Combined Reviews & Filtering
  const allReviews: ProductReviewItem[] = [
    ...customReviews,
    ...product.reviews,
  ];

  const filterReviewList = (
    list: ProductReviewItem[],
    filterKey: ReviewFilterKey
  ) =>
    list.filter((rev) => {
      if (filterKey === 'photos') {
        return Boolean(rev.photos && rev.photos.length > 0);
      }
      if (filterKey === '5star') return rev.rating === 5;
      if (filterKey === '4star') return rev.rating === 4;
      if (filterKey === '3star') return rev.rating <= 3;
      return true;
    });

  const filteredReviews = filterReviewList(allReviews, reviewFilter);
  const modalFilteredReviews = filterReviewList(allReviews, modalReviewFilter);

  const safeActiveReviewIdx =
    filteredReviews.length > 0
      ? Math.min(activeReviewIdx, filteredReviews.length - 1)
      : 0;
  const currentSingleReview = filteredReviews[safeActiveReviewIdx] ?? null;

  const handleSelectReviewFilter = (nextFilter: ReviewFilterKey) => {
    setReviewFilter(nextFilter);
    setActiveReviewIdx(0);
  };

  const handlePrevReview = () => {
    if (filteredReviews.length <= 1) return;
    setActiveReviewIdx((prev) =>
      prev <= 0 ? filteredReviews.length - 1 : prev - 1
    );
  };

  const handleNextReview = () => {
    if (filteredReviews.length <= 1) return;
    setActiveReviewIdx((prev) =>
      prev >= filteredReviews.length - 1 ? 0 : prev + 1
    );
  };

  const totalReviewDisplayCount = product.reviewCount + customReviews.length;
  const withPhotosCount = Math.max(
    35,
    allReviews.filter((r) => r.photos && r.photos.length > 0).length
  );
  const fiveStarCount = Math.max(
    89,
    allReviews.filter((r) => r.rating === 5).length
  );
  const fourStarCount = Math.max(
    22,
    allReviews.filter((r) => r.rating === 4).length
  );
  const threeStarCount = Math.max(
    13,
    allReviews.filter((r) => r.rating <= 3).length
  );

  const reviewFilterPills: { key: ReviewFilterKey; label: string }[] = [
    { key: 'all', label: `All (${totalReviewDisplayCount})` },
    { key: 'photos', label: `With Photos (${withPhotosCount})` },
    { key: '5star', label: `5 Star (${fiveStarCount})` },
    { key: '4star', label: `4 Star (${fourStarCount})` },
    { key: '3star', label: `3 Star (${threeStarCount})` },
  ];

  const handleWriteReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      setNewReviewError('Please enter your name and review comment.');
      return;
    }
    const createdReview: ProductReviewItem = {
      id: `user-rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      variantLabel: `Colour: ${activeColour.name} · Size: ${selectedSize ?? product.defaultSize}`,
      comment: newReviewComment.trim(),
      verifiedPurchase: false,
      helpfulCount: 0,
      photos: newReviewIncludePhoto ? [activeColour.image] : undefined,
    };
    setCustomReviews((prev) => [createdReview, ...prev]);
    setReviewFilter('all');
    setActiveReviewIdx(0);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setNewReviewIncludePhoto(false);
    setNewReviewError('');
    setWriteReviewOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#fcf9f5] flex flex-col justify-between overflow-x-hidden">
      {/* =====================================================================
          1. SHARED WEBSITE HEADER (With Mobile Ecommerce Header Layout)
          ===================================================================== */}
      <div className="w-full bg-[#fcf9f5] border-b border-[#f1e9e0]">
        <Header
          activePage="Collections"
          ecommerceMobileHeader={true}
          onNavigate={onNavigate}
          onOpenSignIn={onOpenSignIn}
          onSelectCategory={(cat) => {
            onSelectCategory?.(cat);
            if (cat === 'Custom Designs') {
              onNavigate('Custom Designs');
            } else {
              onBackToListing(cat);
            }
          }}
          bagItems={bagItems}
          onRemoveBagItem={onRemoveBagItem}
          onUpdateBagQuantity={onUpdateBagQuantity}
          onOpenBagPage={onOpenBagPage}
          wishlistIds={wishlistIds}
          wishlistActive={wishlistIds.length > 0}
          onToggleHeaderWishlist={onToggleHeaderWishlist}
          onToggleWishlistItem={onToggleWishlist}
        />
      </div>

      {/* =====================================================================
          2. MAIN PRODUCT DETAILS CONTAINER (Screens 3, 4, 6, 7 + Desktop Ref 2)
          ===================================================================== */}
      <div className="relative w-full flex-1">
        {/* Decorative Right Pink Floral Line Art (Desktop) */}
        <img
          src={getAssetUrl('assets/aistudio/collections_flower_right.png')}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="hidden lg:block absolute top-10 right-0 w-44 xl:w-56 h-auto object-contain pointer-events-none select-none opacity-90 z-0"
        />

        {/* Decorative Bottom-Left Pink Floral Line Art (Desktop) */}
        <img
          src={getAssetUrl('assets/aistudio/collections_flower_left.png')}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="hidden lg:block absolute bottom-12 left-0 w-40 xl:w-52 h-auto object-contain pointer-events-none select-none opacity-85 z-0"
        />

        <div className="relative z-10 w-full px-3.5 sm:px-6 lg:px-[5.2%] pt-3 sm:pt-5 pb-14">
          {/* Desktop Breadcrumbs: Home > Clothing and Ethnic Wear > Kurtas, Ethnic Sets > Product Name */}
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex flex-wrap items-center gap-1.5 text-[11.5px] sm:text-xs text-[#78726d] mb-4 sm:mb-5"
          >
            <button
              type="button"
              onClick={() => onNavigate('Home')}
              className="hover:text-[#f81d5c] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#b5ada5]" />
            <button
              type="button"
              onClick={() => onBackToListing()}
              className="hover:text-[#f81d5c] transition-colors cursor-pointer"
            >
              Clothing and Ethnic Wear
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#b5ada5]" />
            <button
              type="button"
              onClick={() => onBackToListing(product.category)}
              className="hover:text-[#f81d5c] transition-colors cursor-pointer"
            >
              Kurtas, Ethnic Sets
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#b5ada5]" />
            <span className="font-medium text-[#262423] truncate max-w-[240px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          {/* =================================================================
              SCREEN 3 & 4 + DESKTOP TOP 2-COLUMN SPLIT:
              LEFT IMAGE GALLERY + RIGHT PRODUCT INFO & SHOPPING OPTIONS
              ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-10 items-start">
            {/* LEFT COLUMN: THUMBNAIL STRIP + LARGE MAIN IMAGE (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row items-start gap-2.5 sm:gap-4">
              {/* Thumbnail Strip: Horizontal row below image on mobile with hidden scrollbar, Vertical on sm+ */}
              <div
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                className="w-full sm:w-[84px] md:w-[90px] shrink-0 flex sm:flex-col items-center gap-2 sm:gap-2.5 overflow-x-auto sm:overflow-visible no-scrollbar p-1"
              >
                {galleryItems.slice(0, 6).map((item, idx) => {
                  const isActive = idx === activeGalleryIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveGalleryIdx(idx);
                        setDrapePreviewPlaying(Boolean(item.isVideoPreview));
                      }}
                      aria-label={`View ${item.label}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative w-[62px] h-[74px] sm:w-[76px] sm:h-[90px] md:w-[82px] md:h-[96px] rounded-xl sm:rounded-2xl p-[3px] box-border shrink-0 transition-all cursor-pointer border-2 ${
                        isActive
                          ? 'border-[#f81d5c] bg-[#fcf9f5] shadow-[0_2px_8px_rgba(248,29,92,0.18)] opacity-100'
                          : 'border-[#e2dad1] hover:border-[#c9bfb4] bg-[#fcf9f5] opacity-85 hover:opacity-100'
                      }`}
                    >
                      <span className="relative block w-full h-full rounded-[8px] sm:rounded-[11px] overflow-hidden bg-[#efe7dd]">
                        <img
                          src={getAssetUrl(item.thumbUrl ?? item.url)}
                          alt={item.label}
                          referrerPolicy="no-referrer"
                          style={{
                            filter:
                              idx === 0
                                ? activeColour.imageFilter ?? 'none'
                                : item.imageFilter ?? 'none',
                          }}
                          className="w-full h-full object-cover object-top"
                        />

                        {/* Play Icon Overlay on Video/Motion Thumbnail */}
                        {item.isVideoPreview && (
                          <span className="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 border border-white/85 text-white flex items-center justify-center shadow-md">
                              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white ml-0.5" />
                            </span>
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Large Main Product Image Viewer */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => {
                  if (currentGalleryItem.isVideoPreview) {
                    setDrapePreviewPlaying((prev) => !prev);
                  }
                }}
                className="relative flex-1 w-full aspect-[345/405] sm:aspect-[386/447] max-h-[650px] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-[#efe7dd] border border-[#eae0d5] shadow-[0_6px_28px_rgba(24,24,27,0.06)] group select-none"
              >
                <img
                  src={getAssetUrl(
                    activeGalleryIdx === 0 &&
                    product.id !== 'pink-elegance-embroidered-kurta-pant-dupatta-set'
                      ? activeColour.image
                      : currentGalleryItem.url
                  )}
                  alt={`${product.name} — ${currentGalleryItem.label}`}
                  referrerPolicy="no-referrer"
                  style={{
                    filter: activeColour.imageFilter ?? 'none',
                  }}
                  className={`w-full h-full object-cover object-top transition-transform duration-300 ease-out ${
                    drapePreviewPlaying
                      ? 'scale-[1.12] animate-pulse'
                      : currentGalleryItem.cropClass ?? 'scale-100'
                  }`}
                />

                {/* Top-Left Circular Back Button inside Main Image (Screen 3) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBackToListing();
                  }}
                  aria-label="Back to product listing"
                  className="sm:hidden absolute top-3.5 left-3.5 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center text-[#141824] transition-transform active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.1]" />
                </button>

                {/* Top-Right Wishlist Heart Button inside Main Image */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  aria-label={
                    isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'
                  }
                  aria-pressed={isWishlisted}
                  className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[1.9] transition-colors ${
                      isWishlisted
                        ? 'fill-[#f81d5c] text-[#f81d5c]'
                        : 'text-[#262423]'
                    }`}
                  />
                </button>

                {/* Prev / Next Image Controls */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-[#17171a] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-[#17171a] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Subtle Descriptive Image Label at Bottom of Main Image */}
                <div className="absolute bottom-3.5 left-3.5 z-20 pointer-events-none">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/50 backdrop-blur-xs text-white font-ui text-[11px] font-medium tracking-[0.01em] shadow-2xs">
                    {currentGalleryItem.label}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PRODUCT INFORMATION & SHOPPING OPTIONS (Screens 3 & 4) */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Brand / Collection Subtitle */}
              <p className="font-ui text-xs sm:text-[13px] font-medium text-[#8a837c]">
                {product.brand}
              </p>

              {/* Product Title (Large Serif matching Screen 3 & Desktop Ref 2) */}
              <h1 className="mt-1 font-editorial text-[26px] sm:text-4xl xl:text-[40px] font-bold text-[#141824] leading-[1.13] tracking-[-0.01em]">
                {product.name}
              </h1>

              {/* Rating + Reviews + Sold Count Row */}
              <div className="mt-2.5 lg:mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <div
                  className="flex items-center gap-0.5 text-[#f81d5c]"
                  aria-label={`Rated ${product.rating} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-3.5 h-3.5 ${
                        starIdx <= Math.round(product.rating)
                          ? 'fill-[#f81d5c] text-[#f81d5c]'
                          : 'text-[#dfd7ce]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-ui font-bold text-[#141824]">
                  {product.rating}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById('pdp-customer-reviews-section')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="font-ui text-[#6e6862] hover:text-[#f81d5c] transition-colors cursor-pointer"
                >
                  ({totalReviewDisplayCount} reviews)
                </button>
                <span className="text-[#d6cdc4]">|</span>
                <span className="font-ui font-semibold text-[#2563eb] sm:text-[#6e6862]">
                  {product.soldCount} sold
                </span>
              </div>

              {/* Price + Original Price + Discount Badge + Top Discount Badge (Screen 3) */}
              <div className="mt-3.5 lg:mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-ui text-2xl sm:text-[30px] font-extrabold text-[#121829] tabular-nums leading-none">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="font-ui text-sm sm:text-base text-[#9a948e] line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#e6f7ed] text-[#15803d] font-ui text-xs font-bold">
                  {product.discountPercent}% off
                </span>
                {product.topDiscountBadge && (
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#fde8ef] text-[#f81d5c] font-ui text-[10.5px] sm:text-[11px] font-semibold">
                    {product.topDiscountBadge}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-3.5 lg:mt-3 font-ui text-xs sm:text-[13.5px] text-[#4a4642] leading-[1.58] max-w-xl">
                {product.shortDescription}
              </p>

              {/* =============================================================
                  SCREEN 4: SHOPPING OPTIONS (Colour, Size, Quantity, Buttons, Trust)
                  ============================================================= */}
              {/* Colour Selector */}
              <div className="mt-5 lg:mt-3.5 pt-4 border-t border-[#efe6dd] sm:border-none sm:pt-0">
                <p className="font-ui text-xs sm:text-[13px] text-[#57524e]">
                  <span className="font-bold text-[#141824]">Colour:</span>{' '}
                  {activeColour.name}
                </p>

                <div className="mt-2 flex items-center gap-2.5 flex-wrap">
                  {product.colours.map((col, idx) => {
                    const isSelected = idx === selectedColourIdx;
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => handleColourSelect(idx)}
                        aria-label={`Select colour ${col.name}`}
                        aria-pressed={isSelected}
                        style={{ backgroundColor: col.hex }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-[#f81d5c] ring-offset-2 ring-offset-[#fcf9f5] scale-105'
                            : 'border border-black/15 hover:scale-105'
                        }`}
                      />
                    );
                  })}
                  {product.extraColourCount > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleColourSelect(
                          (selectedColourIdx + 1) % product.colours.length
                        )
                      }
                      title="Cycle additional studio colourways"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#dfd7ce] hover:border-[#f81d5c] text-[11px] font-semibold text-[#57524e] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      +{product.extraColourCount}
                    </button>
                  )}
                </div>
              </div>

              {/* Size Selector + Size Guide Trigger (Screen 4 & 5) */}
              <div className="mt-5 lg:mt-3.5 max-w-lg">
                <div className="flex items-center justify-between">
                  <p className="font-ui text-xs sm:text-[13px] text-[#57524e]">
                    <span className="font-bold text-[#141824]">Size:</span>{' '}
                    {selectedSize ?? 'Select a size'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1.5 font-ui text-xs font-semibold text-[#233862] hover:text-[#f81d5c] underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-6 sm:flex sm:flex-wrap items-center gap-2">
                  {ALL_SIZES.map((sz) => {
                    const isAvailable =
                      activeColour.availableSizes.includes(sz);
                    const isSelected = selectedSize === sz && isAvailable;
                    return (
                      <button
                        key={sz}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleSizeSelect(sz)}
                        aria-pressed={isSelected}
                        className={`h-9 sm:h-10 sm:min-w-[52px] px-2 sm:px-3 rounded-lg font-ui text-xs font-semibold border transition-all flex items-center justify-center ${
                          !isAvailable
                            ? 'bg-[#f6f2ed] text-[#c2bbb4] border-[#e8e1d9] line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#f81d5c] text-white border-[#f81d5c] shadow-[0_4px_12px_rgba(248,29,92,0.28)] cursor-pointer'
                            : 'bg-white text-[#1e1e24] border-[#e2dad1] hover:border-[#f81d5c] cursor-pointer'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {sizeError && (
                  <p
                    role="alert"
                    className="mt-2 font-ui text-xs font-semibold text-[#e11d48]"
                  >
                    {sizeError}
                  </p>
                )}
              </div>

              {/* Quantity Selector + In Stock Indicator (Screen 4) */}
              <div className="mt-5 lg:mt-3.5">
                <p className="font-ui text-xs sm:text-[13px] font-bold text-[#141824] mb-1.5">
                  Quantity
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center h-10 rounded-xl bg-white border border-[#e2dad1] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleQuantityDelta(-1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-10 h-full flex items-center justify-center text-[#3a3633] hover:bg-[#f7f2ec] disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-11 text-center font-ui text-xs sm:text-sm font-bold text-[#141824] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityDelta(1)}
                      disabled={quantity >= product.stockQuantity}
                      aria-label="Increase quantity"
                      className="w-10 h-full flex items-center justify-center text-[#3a3633] hover:bg-[#f7f2ec] disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col text-xs">
                    <span className="inline-flex items-center gap-1.5 font-ui font-bold text-[#15803d]">
                      <span className="w-2 h-2 rounded-full bg-[#15803d]" />
                      <span>
                        {product.availabilityStatus === 'Low Stock'
                          ? `In Stock (${product.lowStockLabel})`
                          : 'In Stock'}
                      </span>
                    </span>
                    <span className="font-ui text-[11px] text-[#78726d]">
                      Ready to ship
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Action Buttons: Side-by-side Add to Bag & Buy Now (Screen 4 & Desktop Ref 2) */}
              <div className="mt-6 lg:mt-4 grid grid-cols-2 gap-3 max-w-xl">
                <button
                  type="button"
                  onClick={handleAddToBagClick}
                  className={`h-11 sm:h-12 px-4 sm:px-6 rounded-full font-ui text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    justAddedToBag
                      ? 'bg-[#15803d] text-white border border-[#15803d] shadow-md'
                      : 'bg-white text-[#f81d5c] border border-[#f81d5c] hover:bg-[#fff0f4] lg:bg-gradient-to-r lg:from-[#f81d5c] lg:to-[#ff2e6c] lg:text-white lg:border-transparent lg:shadow-[0_6px_20px_rgba(248,29,92,0.3)]'
                  }`}
                >
                  {justAddedToBag ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.4]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 stroke-[2]" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNowClick}
                  className="h-11 sm:h-12 px-4 sm:px-6 rounded-full bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] text-white shadow-[0_6px_18px_rgba(248,29,92,0.28)] lg:bg-none lg:bg-white lg:hover:bg-[#fff0f4] lg:text-[#f81d5c] lg:border lg:border-[#f81d5c]/65 lg:shadow-none font-ui text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 stroke-[2]" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* 4 Trust Indicators Row (4 columns on mobile & desktop, compact and evenly distributed) */}
              <div className="mt-6 lg:mt-4 pt-4 lg:pt-3.5 border-t border-[#ede4db] grid grid-cols-4 gap-2 sm:gap-3 lg:gap-3.5 w-full max-w-xl">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:border-r sm:border-[#ede4db] sm:pr-2.5 lg:pr-3 min-w-0">
                  <Truck className="w-4 h-4 text-[#f81d5c] stroke-[1.8] shrink-0" />
                  <p className="mt-1 font-ui text-[10px] sm:text-[11px] font-bold text-[#141824] leading-snug sm:whitespace-nowrap">
                    Free Shipping
                  </p>
                  <p className="font-ui text-[9px] sm:text-[10px] text-[#78726d] leading-snug mt-0.5 sm:whitespace-nowrap">
                    On eligible orders
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:border-r sm:border-[#ede4db] sm:pr-2.5 lg:pr-3 min-w-0">
                  <RotateCcw className="w-4 h-4 text-[#f81d5c] stroke-[1.8] shrink-0" />
                  <p className="mt-1 font-ui text-[10px] sm:text-[11px] font-bold text-[#141824] leading-snug sm:whitespace-nowrap">
                    Easy Returns
                  </p>
                  <p className="font-ui text-[9px] sm:text-[10px] text-[#78726d] leading-snug mt-0.5 sm:whitespace-nowrap">
                    Hassle-free process
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:border-r sm:border-[#ede4db] sm:pr-2.5 lg:pr-3 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-[#f81d5c] stroke-[1.8] shrink-0" />
                  <p className="mt-1 font-ui text-[10px] sm:text-[11px] font-bold text-[#141824] leading-snug sm:whitespace-nowrap">
                    Secure Payment
                  </p>
                  <p className="font-ui text-[9px] sm:text-[10px] text-[#78726d] leading-snug mt-0.5 sm:whitespace-nowrap">
                    100% secure checkout
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0">
                  <Headphones className="w-4 h-4 text-[#f81d5c] stroke-[1.8] shrink-0" />
                  <p className="mt-1 font-ui text-[10px] sm:text-[11px] font-bold text-[#141824] leading-snug sm:whitespace-nowrap">
                    Dedicated Support
                  </p>
                  <p className="font-ui text-[9px] sm:text-[10px] text-[#78726d] leading-snug mt-0.5 sm:whitespace-nowrap">
                    We&apos;re here to help
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              SCREEN 4 (BOTTOM) & DESKTOP REF 2:
              5 INDEPENDENT EXPANDABLE ACCORDION SECTIONS
              ================================================================= */}
          <section
            id="pdp-accordions-section"
            aria-label="Product Details and Specifications"
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#eae0d5] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start"
          >
            {/* Desktop Left Column: Product Details heading, pink underline, description & expandable specs */}
            <div className="hidden lg:block lg:col-span-5 lg:pr-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-2xl sm:text-[26px] font-bold text-[#141824]">
                    Product Details
                  </h2>
                  <span
                    aria-hidden="true"
                    className="block w-8 h-[2px] bg-[#f81d5c] mt-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setLeftDetailsExpanded((prev) => !prev)}
                  aria-expanded={leftDetailsExpanded}
                  className="text-xs font-semibold text-[#78726d] hover:text-[#f81d5c] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>
                    {leftDetailsExpanded ? 'Hide Specs' : 'Show Specs'}
                  </span>
                  {leftDetailsExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <p className="mt-3.5 font-ui text-xs sm:text-[13.5px] text-[#4a4642] leading-[1.7]">
                {product.productDetailsSummary}
              </p>

              {leftDetailsExpanded && (
                <dl className="mt-4 pt-3 border-t border-[#efe6dd] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl bg-white/80 border border-[#eee5dc] p-2.5"
                    >
                      <dt className="font-ui text-[10.5px] uppercase tracking-wider font-semibold text-[#8a837c]">
                        {spec.label}
                      </dt>
                      <dd className="mt-0.5 font-ui text-xs font-semibold text-[#171821]">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Expandable Accordions Column (All 5 on Mobile matching Screen 4; 4 on Desktop right column) */}
            <div className="lg:col-span-7 lg:border-l lg:border-[#e6dcd2] lg:pl-10 divide-y divide-[#e8dfd5]">
              {/* 0. Product Details (Mobile Accordion Row 1 matching Screen 4) */}
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  aria-expanded={Boolean(openAccordions.details)}
                  className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="inline-flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#f81d5c] shrink-0" />
                    <span className="font-ui text-xs sm:text-[13.5px] font-bold text-[#141824] group-hover:text-[#f81d5c] transition-colors">
                      Product Details
                    </span>
                  </span>
                  <span className="text-[#4a4542] font-ui text-base font-medium">
                    {openAccordions.details ? '−' : '+'}
                  </span>
                </button>

                {openAccordions.details && (
                  <div className="pb-4 pl-7 pr-2 space-y-3 text-xs text-[#4a4642] leading-relaxed">
                    <p>{product.productDetailsSummary}</p>
                    <dl className="grid grid-cols-2 gap-2">
                      {product.specifications.map((spec) => (
                        <div
                          key={spec.label}
                          className="rounded-xl bg-white border border-[#eee5dc] p-2"
                        >
                          <dt className="font-ui text-[10px] uppercase tracking-wider font-semibold text-[#8a837c]">
                            {spec.label}
                          </dt>
                          <dd className="mt-0.5 font-ui text-[11px] font-semibold text-[#171821]">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>

              {/* 1. Fabric & Care */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fabric')}
                  aria-expanded={Boolean(openAccordions.fabric)}
                  className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="inline-flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#f81d5c] shrink-0" />
                    <span className="font-ui text-xs sm:text-[13.5px] font-bold text-[#141824] group-hover:text-[#f81d5c] transition-colors">
                      Fabric &amp; Care
                    </span>
                  </span>
                  <span className="text-[#4a4542] font-ui text-base font-medium">
                    {openAccordions.fabric ? '−' : '+'}
                  </span>
                </button>

                {openAccordions.fabric && (
                  <div className="pb-4 pl-7 pr-2 space-y-2 text-xs text-[#4a4642] leading-relaxed">
                    <p>
                      <strong className="text-[#141824]">Composition:</strong>{' '}
                      {product.fabricAndCare.fabricComposition}
                    </p>
                    <p>
                      <strong className="text-[#141824]">
                        Craftsmanship:
                      </strong>{' '}
                      {product.fabricAndCare.weaveAndEmbroidery}
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      {product.fabricAndCare.careInstructions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Size & Fit */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('sizeFit')}
                  aria-expanded={Boolean(openAccordions.sizeFit)}
                  className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="inline-flex items-center gap-3">
                    <Shirt className="w-4 h-4 text-[#f81d5c] shrink-0" />
                    <span className="font-ui text-xs sm:text-[13.5px] font-bold text-[#141824] group-hover:text-[#f81d5c] transition-colors">
                      Size &amp; Fit
                    </span>
                  </span>
                  <span className="text-[#4a4542] font-ui text-base font-medium">
                    {openAccordions.sizeFit ? '−' : '+'}
                  </span>
                </button>

                {openAccordions.sizeFit && (
                  <div className="pb-4 pl-7 pr-2 space-y-1.5 text-xs text-[#4a4642] leading-relaxed">
                    <p>
                      <strong className="text-[#141824]">Silhouette:</strong>{' '}
                      {product.sizeAndFit.fitDescription}
                    </p>
                    <p>
                      <strong className="text-[#141824]">Model Fit:</strong>{' '}
                      {product.sizeAndFit.modelInfo}
                    </p>
                    <p>{product.sizeAndFit.garmentNote}</p>
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="mt-1 inline-flex items-center gap-1 text-[#f81d5c] font-semibold hover:underline cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Open Full Size Guide Table</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  aria-expanded={Boolean(openAccordions.shipping)}
                  className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="inline-flex items-center gap-3">
                    <Truck className="w-4 h-4 text-[#f81d5c] shrink-0" />
                    <span className="font-ui text-xs sm:text-[13.5px] font-bold text-[#141824] group-hover:text-[#f81d5c] transition-colors">
                      Shipping &amp; Returns
                    </span>
                  </span>
                  <span className="text-[#4a4542] font-ui text-base font-medium">
                    {openAccordions.shipping ? '−' : '+'}
                  </span>
                </button>

                {openAccordions.shipping && (
                  <div className="pb-4 pl-7 pr-2 space-y-1.5 text-xs text-[#4a4642] leading-relaxed">
                    <p>
                      <strong className="text-[#141824]">Shipping:</strong>{' '}
                      {product.shippingAndReturns.shippingNote}
                    </p>
                    <p>
                      <strong className="text-[#141824]">
                        Returns &amp; Exchanges:
                      </strong>{' '}
                      {product.shippingAndReturns.returnsNote}
                    </p>
                    <p>
                      <strong className="text-[#141824]">Packaging:</strong>{' '}
                      {product.shippingAndReturns.packagingNote}
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Customer Reviews (124) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('reviews')}
                  aria-expanded={Boolean(openAccordions.reviews)}
                  className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="inline-flex items-center gap-3">
                    <Star className="w-4 h-4 text-[#f81d5c] shrink-0" />
                    <span className="font-ui text-xs sm:text-[13.5px] font-bold text-[#141824] group-hover:text-[#f81d5c] transition-colors">
                      Customer Reviews ({totalReviewDisplayCount})
                    </span>
                  </span>
                  <span className="text-[#4a4542] font-ui text-base font-medium">
                    {openAccordions.reviews ? '−' : '+'}
                  </span>
                </button>

                {openAccordions.reviews && (
                  <div className="pb-4 pl-7 pr-2 space-y-2.5 text-xs text-[#4a4642]">
                    <p>
                      Rated <strong>{product.rating} out of 5</strong> across{' '}
                      {totalReviewDisplayCount} verified &amp; customer reviews.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        document
                          .getElementById('pdp-customer-reviews-section')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-[#f81d5c] hover:underline cursor-pointer"
                    >
                      <span>Jump to Full Customer Reviews Section</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =================================================================
              SCREEN 6: YOU MAY ALSO LIKE (RECOMMENDED PRODUCTS)
              ================================================================= */}
          <section
            aria-label="You May Also Like"
            className="mt-10 sm:mt-14 pt-7 sm:pt-8 border-t border-[#ece2d8]"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="font-editorial text-xl sm:text-3xl font-bold text-[#141824]">
                You May Also Like
              </h2>
              <button
                type="button"
                onClick={() => onBackToListing()}
                className="font-ui text-xs font-semibold text-[#f81d5c] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
              </button>
            </div>

            {/* 3-card horizontal grid on mobile matching Screen 6; 4-card grid on desktop */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedProducts.map((rel, idx) => {
                const isRelWishlisted = wishlistIds.includes(rel.id);
                const isRelAdded = addedRelatedId === rel.id;
                return (
                  <article
                    key={rel.id}
                    className={`group rounded-2xl bg-white border border-[#ede4db] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                      idx === 3 ? 'hidden md:flex' : 'flex'
                    }`}
                  >
                    <div>
                      {/* Image + Top-Right Wishlist Button */}
                      <div className="relative w-full aspect-[108/138] sm:aspect-[163/189] overflow-hidden bg-[#f4ede6]">
                        <img
                          src={getAssetUrl(rel.colours[0].image)}
                          alt={rel.name}
                          referrerPolicy="no-referrer"
                          onClick={() => {
                            onOpenProduct(rel.slug, 0, rel.defaultSize);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(rel.id);
                          }}
                          aria-label={
                            isRelWishlisted
                              ? `Remove ${rel.name} from Wishlist`
                              : `Add ${rel.name} to Wishlist`
                          }
                          className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/95 shadow-xs flex items-center justify-center cursor-pointer"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              isRelWishlisted
                                ? 'fill-[#f81d5c] text-[#f81d5c]'
                                : 'text-[#262423]'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Details */}
                      <div className="p-2 sm:p-3">
                        <p className="font-ui text-[9px] sm:text-[10.5px] text-[#8a837c] truncate">
                          {rel.brand}
                        </p>
                        <h3
                          onClick={() => {
                            onOpenProduct(rel.slug, 0, rel.defaultSize);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-ui text-[10px] sm:text-xs font-semibold text-[#141824] line-clamp-2 mt-0.5 leading-snug group-hover:text-[#f81d5c] cursor-pointer"
                        >
                          {rel.name}
                        </h3>

                        {/* Single-Line Pricing: Selling Price + Strikethrough Original Price + Green Discount Percentage */}
                        <div className="mt-1 sm:mt-1.5 flex items-center flex-nowrap gap-1 sm:gap-1.5 whitespace-nowrap overflow-hidden">
                          <span className="font-ui text-[11px] sm:text-sm font-extrabold text-[#121829] tabular-nums leading-none shrink-0">
                            ₹{rel.price.toLocaleString('en-IN')}
                          </span>
                          <span className="font-ui text-[9px] sm:text-[11px] text-[#9a948e] line-through tabular-nums leading-none shrink-0">
                            ₹{rel.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="font-ui text-[9px] sm:text-[11px] font-bold text-[#15803d] leading-none shrink-0">
                            {rel.discountPercent}% off
                          </span>
                        </div>

                        {/* Colour Swatches Row */}
                        <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                          {rel.colours.slice(0, 4).map((col) => (
                            <span
                              key={col.name}
                              style={{ backgroundColor: col.hex }}
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-black/15"
                            />
                          ))}
                          {rel.extraColourCount > 0 && (
                            <span className="font-ui text-[9px] sm:text-[10px] font-semibold text-[#78726d]">
                              +{rel.extraColourCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add to Bag Button matching Screen 6 */}
                    <div className="px-2 pb-2 sm:px-3 sm:pb-3">
                      <button
                        type="button"
                        onClick={() => {
                          onAddVariantToBag(
                            rel,
                            rel.colours[0].name,
                            rel.defaultSize,
                            1,
                            rel.colours[0].image
                          );
                          setAddedRelatedId(rel.id);
                          window.setTimeout(() => {
                            setAddedRelatedId((prev) =>
                              prev === rel.id ? null : prev
                            );
                          }, 1300);
                        }}
                        className={`w-full h-7 sm:h-9 rounded-full font-ui text-[9.5px] sm:text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isRelAdded
                            ? 'bg-[#15803d] text-white'
                            : 'bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] hover:from-[#e0144f] hover:to-[#eb1e5c] text-white shadow-xs'
                        }`}
                      >
                        <ShoppingBag className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        <span>{isRelAdded ? 'Added' : 'Add to Bag'}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* =================================================================
              SCREEN 7: CUSTOMER REVIEWS SECTION (ONE REVIEW AT A TIME + VIEW ALL MODAL)
              ================================================================= */}
          <section
            id="pdp-customer-reviews-section"
            aria-label="Customer Reviews"
            className="mt-10 sm:mt-14 pt-7 sm:pt-8 border-t border-[#ece2d8] max-w-3xl scroll-mt-24"
          >
            {/* Header Row: Customer Reviews (124) + Sort/Filter Icon */}
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#141824]">
                Customer Reviews ({totalReviewDisplayCount})
              </h2>
              <button
                type="button"
                onClick={() =>
                  handleSelectReviewFilter(
                    reviewFilter === 'all' ? 'photos' : 'all'
                  )
                }
                aria-label="Toggle photo reviews filter"
                className="w-8 h-8 rounded-full hover:bg-[#f2ebe3] flex items-center justify-center text-[#4a4542] cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Rating Summary + Write a Review Button (Screen 7) */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-[#f81d5c]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(product.rating)
                          ? 'fill-[#f81d5c] text-[#f81d5c]'
                          : 'text-[#dfd7ce]'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                  {product.rating} out of 5
                </span>
              </div>

              <button
                type="button"
                onClick={() => setWriteReviewOpen(true)}
                className="h-8 sm:h-9 px-4 rounded-full bg-white hover:bg-[#fff0f4] text-[#f81d5c] border border-[#f81d5c]/70 font-ui text-xs font-semibold transition-colors cursor-pointer"
              >
                Write a Review
              </button>
            </div>

            {/* Horizontally Scrollable Review Filter Pills with NO visible scrollbar */}
            <div
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
            >
              {reviewFilterPills.map((pill) => {
                const isActive = reviewFilter === pill.key;
                return (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => handleSelectReviewFilter(pill.key)}
                    className={`h-8 px-3.5 rounded-full font-ui text-xs font-semibold whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#f81d5c] text-white border-[#f81d5c] shadow-[0_3px_10px_rgba(248,29,92,0.22)]'
                        : 'bg-white text-[#3a3633] border-[#e2dad1] hover:border-[#f81d5c]'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Single Review Card Display (ONLY ONE review card visible at a time) */}
            <div className="mt-4">
              {currentSingleReview ? (
                <div>
                  <div
                    onTouchStart={(e) => {
                      reviewTouchStartX.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                      if (reviewTouchStartX.current === null) return;
                      const delta =
                        e.changedTouches[0].clientX - reviewTouchStartX.current;
                      if (Math.abs(delta) > 40) {
                        if (delta < 0) handleNextReview();
                        else handlePrevReview();
                      }
                      reviewTouchStartX.current = null;
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.article
                        key={currentSingleReview.id}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -14 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ece3da] shadow-2xs space-y-2.5"
                      >
                        {/* Author Row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <ReviewerAvatar
                              author={currentSingleReview.author}
                              avatar={currentSingleReview.avatar}
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-ui text-xs sm:text-[13px] font-bold text-[#141824]">
                                  {currentSingleReview.author}
                                </span>
                                {currentSingleReview.verifiedPurchase ? (
                                  <span className="inline-flex items-center gap-1 font-ui text-[10.5px] font-semibold text-[#15803d]">
                                    <CheckCircle2 className="w-3 h-3 fill-[#15803d] text-white" />
                                    <span>Verified Purchase</span>
                                  </span>
                                ) : (
                                  <span className="font-ui text-[10.5px] font-medium text-[#78726d]">
                                    Customer Review
                                  </span>
                                )}
                              </div>

                              {/* Stars under name */}
                              <div className="mt-0.5 flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((st) => (
                                  <Star
                                    key={st}
                                    className={`w-3 h-3 ${
                                      st <= currentSingleReview.rating
                                        ? 'fill-[#f81d5c] text-[#f81d5c]'
                                        : 'text-[#dfd7ce]'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <span className="font-ui text-[11px] text-[#8a837c] shrink-0">
                            {currentSingleReview.date}
                          </span>
                        </div>

                        {/* Review Text */}
                        {(() => {
                          const isExpanded = Boolean(
                            expandedReviewIds[currentSingleReview.id]
                          );
                          const isLongComment =
                            currentSingleReview.comment.length > 140;
                          return (
                            <p className="font-ui text-xs sm:text-[13px] text-[#3a3633] leading-relaxed">
                              {isLongComment && !isExpanded
                                ? `${currentSingleReview.comment.slice(0, 140)}...`
                                : currentSingleReview.comment}
                              {isLongComment && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedReviewIds((prev) => ({
                                      ...prev,
                                      [currentSingleReview.id]:
                                        !prev[currentSingleReview.id],
                                    }))
                                  }
                                  className="ml-1 font-semibold text-[#f81d5c] hover:underline cursor-pointer"
                                >
                                  {isExpanded ? 'Show Less' : 'Read More'}
                                </button>
                              )}
                            </p>
                          );
                        })()}

                        {/* Product Reference Photos */}
                        <ReviewReferencePhotos
                          reviewId={currentSingleReview.id}
                          photos={currentSingleReview.photos}
                          productName={product.name}
                          sizeClassName="w-16 h-16 sm:w-20 sm:h-20"
                          onOpenPhoto={(photoUrl) => {
                            setLightboxImageUrl(photoUrl);
                            setLightboxOpen(true);
                          }}
                        />

                        {/* Helpful & Share Footer */}
                        {(() => {
                          const isHelpful = Boolean(
                            helpfulVotes[currentSingleReview.id]
                          );
                          const helpfulTotal =
                            (currentSingleReview.helpfulCount ?? 0) +
                            (isHelpful ? 1 : 0);
                          return (
                            <div className="pt-1 flex items-center justify-between gap-3 text-xs text-[#6e6862]">
                              <span className="font-ui text-[11px] text-[#8a837c]">
                                {currentSingleReview.variantLabel ??
                                  `Colour: ${activeColour.name}`}
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setHelpfulVotes((prev) => ({
                                      ...prev,
                                      [currentSingleReview.id]:
                                        !prev[currentSingleReview.id],
                                    }))
                                  }
                                  className={`inline-flex items-center gap-1 font-ui text-xs font-medium transition-colors cursor-pointer ${
                                    isHelpful
                                      ? 'text-[#f81d5c] font-bold'
                                      : 'text-[#6e6862] hover:text-[#141824]'
                                  }`}
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>{helpfulTotal}</span>
                                </button>
                                <button
                                  type="button"
                                  aria-label="Share review"
                                  className="text-[#8a837c] hover:text-[#141824] cursor-pointer"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.article>
                    </AnimatePresence>
                  </div>

                  {/* Single-Review Navigation Controls: Previous / Counter / Next */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handlePrevReview}
                      disabled={filteredReviews.length <= 1}
                      aria-label="Previous Review"
                      className="h-9 px-3.5 rounded-full bg-white border border-[#e2dad1] hover:border-[#f81d5c] text-[#141824] hover:text-[#f81d5c] disabled:opacity-40 disabled:pointer-events-none font-ui text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {filteredReviews.map((r, dotIdx) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setActiveReviewIdx(dotIdx)}
                          aria-label={`View review ${dotIdx + 1}`}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            dotIdx === safeActiveReviewIdx
                              ? 'w-5 bg-[#f81d5c]'
                              : 'w-1.5 bg-[#dfd7ce] hover:bg-[#b8afa6]'
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 font-ui text-[11px] font-medium text-[#78726d] tabular-nums">
                        {safeActiveReviewIdx + 1} / {filteredReviews.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextReview}
                      disabled={filteredReviews.length <= 1}
                      aria-label="Next Review"
                      className="h-9 px-3.5 rounded-full bg-white border border-[#e2dad1] hover:border-[#f81d5c] text-[#141824] hover:text-[#f81d5c] disabled:opacity-40 disabled:pointer-events-none font-ui text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty State if Selected Filter Has No Matching Reviews */
                <div className="p-6 rounded-2xl bg-white border border-[#ece3da] text-center space-y-2.5">
                  <p className="font-editorial text-lg font-bold text-[#141824]">
                    No matching reviews for this filter yet
                  </p>
                  <p className="font-ui text-xs text-[#6e6862]">
                    Try viewing all customer reviews or share your own experience
                    with this handcrafted piece.
                  </p>
                  <div className="pt-1 flex items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSelectReviewFilter('all')}
                      className="h-8 px-4 rounded-full bg-[#f81d5c] text-white font-ui text-xs font-semibold cursor-pointer"
                    >
                      Show All Reviews
                    </button>
                    <button
                      type="button"
                      onClick={() => setWriteReviewOpen(true)}
                      className="h-8 px-4 rounded-full bg-white border border-[#dfd7ce] text-[#141824] font-ui text-xs font-semibold cursor-pointer"
                    >
                      Write a Review
                    </button>
                  </div>
                </div>
              )}

              {/* View All Reviews Button below the Single Review Card */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalReviewFilter(reviewFilter);
                    setVisibleModalReviewCount(3);
                    setViewAllReviewsModalOpen(true);
                  }}
                  className="w-full h-10 sm:h-11 rounded-full bg-white hover:bg-[#fff0f4] text-[#f81d5c] border border-[#f81d5c]/75 font-ui text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <span>View All Reviews ({totalReviewDisplayCount})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================================
          3. SCREEN 5 — SIZE GUIDE POPUP (SMALL, CENTRED MODAL)
          ===================================================================== */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50">
          {/* Dimmed Backdrop */}
          <div
            onClick={() => setSizeGuideOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/55 backdrop-blur-[1.5px]"
          />

          {/* Compact Centred Modal Card with visible margins on all sides */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-modal-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-36px)] max-w-[352px] sm:max-w-[380px] max-h-[min(80dvh,640px)] flex flex-col rounded-[26px] bg-white shadow-[0_24px_64px_rgba(20,20,30,0.32)] border border-[#f0e6dc] overflow-hidden"
          >
            {/* Top Drag Handle Indicator + Header */}
            <div className="relative px-5 pt-3 pb-2.5 flex flex-col border-b border-[#f3eae0] shrink-0">
              <div className="w-9 h-1 rounded-full bg-[#e4dad0] mx-auto mb-2" />
              <div className="flex items-center justify-between">
                <h2
                  id="size-guide-modal-title"
                  className="font-editorial text-[22px] font-bold text-[#141824] leading-none"
                >
                  Size Guide
                </h2>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(false)}
                  aria-label="Close Size Guide"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#3a3633] hover:text-[#f81d5c] hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>

              {/* INCHES / CM Segmented Toggle matching Screen 5 */}
              <div className="mt-3 grid grid-cols-2 rounded-xl border border-[#e6ddd3] bg-[#faf6f2] p-0.5">
                <button
                  type="button"
                  onClick={() => setSizeUnit('in')}
                  className={`h-8 rounded-[10px] font-ui text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    sizeUnit === 'in'
                      ? 'bg-[#f81d5c] text-white shadow-xs'
                      : 'text-[#4a4542] hover:text-[#141824]'
                  }`}
                >
                  INCHES
                </button>
                <button
                  type="button"
                  onClick={() => setSizeUnit('cm')}
                  className={`h-8 rounded-[10px] font-ui text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    sizeUnit === 'cm'
                      ? 'bg-[#f81d5c] text-white shadow-xs'
                      : 'text-[#4a4542] hover:text-[#141824]'
                  }`}
                >
                  CM
                </button>
              </div>
            </div>

            {/* Internally Scrollable Measurement Table + How to Measure Body Illustration */}
            <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4">
              {/* Measurement Table */}
              <div className="rounded-2xl border border-[#ece3da] overflow-hidden bg-white">
                <table className="w-full text-center border-collapse font-ui text-xs">
                  <thead>
                    <tr className="bg-[#faf5ef] text-[#141824] border-b border-[#ece3da]">
                      <th className="py-2 px-2 font-bold">Size</th>
                      <th className="py-2 px-2 font-bold">Bust</th>
                      <th className="py-2 px-2 font-bold">Waist</th>
                      <th className="py-2 px-2 font-bold">Hip</th>
                      <th className="py-2 px-2 font-bold">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2eae1]">
                    {SAMPLE_SIZE_GUIDE_CHART.map((row) => {
                      const isCurrent = selectedSize === row.size;
                      return (
                        <tr
                          key={row.size}
                          onClick={() => {
                            if (
                              activeColour.availableSizes.includes(row.size)
                            ) {
                              setSelectedSize(row.size);
                            }
                          }}
                          className={`cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-[#fdecef] font-bold text-[#f81d5c]'
                              : 'hover:bg-[#faf6f2] text-[#262423]'
                          }`}
                        >
                          <td className="py-2 px-2 font-bold text-[#141824]">
                            {row.size}
                          </td>
                          <td className="py-2 px-2 tabular-nums">
                            {sizeUnit === 'in' ? row.bustIn : row.bustCm}
                          </td>
                          <td className="py-2 px-2 tabular-nums">
                            {sizeUnit === 'in' ? row.waistIn : row.waistCm}
                          </td>
                          <td className="py-2 px-2 tabular-nums">
                            {sizeUnit === 'in' ? row.hipIn : row.hipCm}
                          </td>
                          <td className="py-2 px-2 tabular-nums">
                            {sizeUnit === 'in' ? row.lengthIn : row.lengthCm}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* How to Measure Section with Female Body Silhouette (Screen 5) */}
              <div className="pt-1">
                <h3 className="font-ui text-xs font-bold text-[#141824] text-center mb-2.5">
                  How to Measure
                </h3>

                <div className="grid grid-cols-12 gap-2.5 items-center">
                  {/* Left: Female Body Silhouette SVG with 1 Bust, 2 Waist, 3 Hip lines */}
                  <div className="col-span-4 flex items-center justify-center">
                    <svg
                      viewBox="0 0 110 210"
                      className="w-20 h-36 text-[#f81d5c]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      {/* Head & Neck */}
                      <circle
                        cx="55"
                        cy="22"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M50 34 L50 42 M60 34 L60 42"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      {/* Shoulders, Arms, Bust, Waist, Hips, Legs Outline */}
                      <path
                        d="M50 42 C34 44 26 52 24 68 L20 115 M60 42 C76 44 84 52 86 68 L90 115"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M35 58 C34 72 39 84 41 96 C43 108 32 120 33 138 L38 198 M75 58 C76 72 71 84 69 96 C67 108 78 120 77 138 L72 198"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M55 142 L51 198 M55 142 L59 198"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                      {/* 1. Bust Line */}
                      <line
                        x1="34"
                        y1="72"
                        x2="76"
                        y2="72"
                        stroke="#1e293b"
                        strokeWidth="1.2"
                        strokeDasharray="3 2"
                      />
                      <circle cx="55" cy="72" r="6" fill="#dbeafe" />
                      <text
                        x="55"
                        y="75"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="bold"
                        fill="#1e3a8a"
                      >
                        1
                      </text>
                      {/* 2. Waist Line */}
                      <line
                        x1="40"
                        y1="96"
                        x2="70"
                        y2="96"
                        stroke="#1e293b"
                        strokeWidth="1.2"
                        strokeDasharray="3 2"
                      />
                      <circle cx="55" cy="96" r="6" fill="#dbeafe" />
                      <text
                        x="55"
                        y="99"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="bold"
                        fill="#1e3a8a"
                      >
                        2
                      </text>
                      {/* 3. Hip Line */}
                      <line
                        x1="33"
                        y1="126"
                        x2="77"
                        y2="126"
                        stroke="#1e293b"
                        strokeWidth="1.2"
                        strokeDasharray="3 2"
                      />
                      <circle cx="55" cy="126" r="6" fill="#dbeafe" />
                      <text
                        x="55"
                        y="129"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="bold"
                        fill="#1e3a8a"
                      >
                        3
                      </text>
                    </svg>
                  </div>

                  {/* Right: 1 Bust, 2 Waist, 3 Hip Explanations */}
                  <div className="col-span-8 space-y-2 font-ui text-[11px]">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#dbeafe] text-[#1e3a8a] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <p className="font-bold text-[#141824]">Bust</p>
                        <p className="text-[10.5px] text-[#6e6862]">
                          Measure around the fullest part
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#dbeafe] text-[#1e3a8a] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <p className="font-bold text-[#141824]">Waist</p>
                        <p className="text-[10.5px] text-[#6e6862]">
                          Measure around the natural waist
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#dbeafe] text-[#1e3a8a] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <p className="font-bold text-[#141824]">Hip</p>
                        <p className="text-[10.5px] text-[#6e6862]">
                          Measure around the fullest part
                        </p>
                      </div>
                    </div>

                    <p className="pt-1 text-[10px] text-[#78726d] leading-relaxed">
                      All measurements are in{' '}
                      {sizeUnit === 'in' ? 'inches' : 'centimetres'}. If you are
                      between sizes, we recommend choosing the larger size.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. WRITE A REVIEW MODAL (Screen 7)
          ===================================================================== */}
      {writeReviewOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => setWriteReviewOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/55 backdrop-blur-[1.5px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Write a Review"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-36px)] max-w-[360px] rounded-[24px] bg-white border border-[#eadfd5] shadow-2xl overflow-hidden p-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efe6dd]">
              <h3 className="font-editorial text-xl font-bold text-[#141824]">
                Write a Review
              </h3>
              <button
                type="button"
                onClick={() => setWriteReviewOpen(false)}
                aria-label="Close review modal"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#6e6862] hover:text-[#141824] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleWriteReviewSubmit}
              className="mt-3.5 space-y-3 font-ui text-xs"
            >
              <div>
                <label className="block font-bold text-[#141824] mb-1">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewReviewRating(st)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          st <= newReviewRating
                            ? 'fill-[#f81d5c] text-[#f81d5c]'
                            : 'text-[#dfd7ce]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#141824] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Ayesha M."
                  className="w-full h-9 px-3 rounded-xl border border-[#dfd7ce] focus:outline-none focus:border-[#f81d5c]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#141824] mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share your thoughts on fabric, embroidery and fit..."
                  className="w-full p-3 rounded-xl border border-[#dfd7ce] focus:outline-none focus:border-[#f81d5c]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-[#4a4542] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newReviewIncludePhoto}
                  onChange={(e) => setNewReviewIncludePhoto(e.target.checked)}
                  className="accent-[#f81d5c]"
                />
                <span>Attach garment photo from this variant</span>
              </label>

              {newReviewError && (
                <p className="text-[11px] font-semibold text-[#e11d48]">
                  {newReviewError}
                </p>
              )}

              <div className="pt-1 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setWriteReviewOpen(false)}
                  className="flex-1 h-10 rounded-full border border-[#dfd7ce] font-semibold text-[#4a4542] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-full bg-[#f81d5c] text-white font-semibold shadow-sm cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VIEW ALL REVIEWS MODAL (DEDICATED REVIEW LISTING VIEW WITH FILTERS & LOAD MORE)
          ===================================================================== */}
      {viewAllReviewsModalOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => setViewAllReviewsModalOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/55 backdrop-blur-[1.5px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="All Customer Reviews"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-28px)] max-w-[540px] max-h-[min(86dvh,740px)] flex flex-col rounded-[26px] bg-[#fcf9f5] border border-[#eadfd5] shadow-[0_24px_64px_rgba(20,20,30,0.32)] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-5 pt-4 pb-3 bg-white border-b border-[#efe6dd] shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#141824]">
                    Customer Reviews ({totalReviewDisplayCount})
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-[#f81d5c]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.round(product.rating)
                              ? 'fill-[#f81d5c] text-[#f81d5c]'
                              : 'text-[#dfd7ce]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-ui text-xs font-bold text-[#141824]">
                      {product.rating} out of 5
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setViewAllReviewsModalOpen(false);
                      setWriteReviewOpen(true);
                    }}
                    className="h-8 px-3 rounded-full bg-white hover:bg-[#fff0f4] text-[#f81d5c] border border-[#f81d5c]/70 font-ui text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Write a Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewAllReviewsModalOpen(false)}
                    aria-label="Close all reviews modal"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#4a4542] hover:text-[#f81d5c] hover:bg-[#faf5ef] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {/* Horizontally Scrollable Filter Chips inside Modal with NO visible scrollbar */}
              <div
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
              >
                {reviewFilterPills.map((pill) => {
                  const isActive = modalReviewFilter === pill.key;
                  return (
                    <button
                      key={pill.key}
                      type="button"
                      onClick={() => {
                        setModalReviewFilter(pill.key);
                        setVisibleModalReviewCount(3);
                      }}
                      className={`h-8 px-3.5 rounded-full font-ui text-xs font-semibold whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#f81d5c] text-white border-[#f81d5c] shadow-[0_3px_10px_rgba(248,29,92,0.22)]'
                          : 'bg-white text-[#3a3633] border-[#e2dad1] hover:border-[#f81d5c]'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Reviews List inside Modal */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
              {modalFilteredReviews.length > 0 ? (
                <>
                  {modalFilteredReviews
                    .slice(0, visibleModalReviewCount)
                    .map((rev) => {
                      const isHelpful = Boolean(helpfulVotes[rev.id]);
                      const helpfulTotal =
                        (rev.helpfulCount ?? 0) + (isHelpful ? 1 : 0);
                      return (
                        <article
                          key={rev.id}
                          className="p-4 rounded-2xl bg-white border border-[#ece3da] shadow-2xs space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <ReviewerAvatar
                                author={rev.author}
                                avatar={rev.avatar}
                              />
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-ui text-xs sm:text-[13px] font-bold text-[#141824]">
                                    {rev.author}
                                  </span>
                                  {rev.verifiedPurchase ? (
                                    <span className="inline-flex items-center gap-1 font-ui text-[10.5px] font-semibold text-[#15803d]">
                                      <CheckCircle2 className="w-3 h-3 fill-[#15803d] text-white" />
                                      <span>Verified Purchase</span>
                                    </span>
                                  ) : (
                                    <span className="font-ui text-[10.5px] font-medium text-[#78726d]">
                                      Customer Review
                                    </span>
                                  )}
                                </div>

                                <div className="mt-0.5 flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((st) => (
                                    <Star
                                      key={st}
                                      className={`w-3 h-3 ${
                                        st <= rev.rating
                                          ? 'fill-[#f81d5c] text-[#f81d5c]'
                                          : 'text-[#dfd7ce]'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="font-ui text-[11px] text-[#8a837c] shrink-0">
                              {rev.date}
                            </span>
                          </div>

                          <p className="font-ui text-xs sm:text-[13px] text-[#3a3633] leading-relaxed">
                            {rev.comment}
                          </p>

                          <ReviewReferencePhotos
                            reviewId={`${rev.id}-modal`}
                            photos={rev.photos}
                            productName={product.name}
                            sizeClassName="w-16 h-16"
                            onOpenPhoto={(photoUrl) => {
                              setLightboxImageUrl(photoUrl);
                              setLightboxOpen(true);
                            }}
                          />

                          <div className="pt-1 flex items-center justify-between gap-3 text-xs text-[#6e6862]">
                            <span className="font-ui text-[11px] text-[#8a837c]">
                              {rev.variantLabel ??
                                `Colour: ${activeColour.name}`}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setHelpfulVotes((prev) => ({
                                  ...prev,
                                  [rev.id]: !prev[rev.id],
                                }))
                              }
                              className={`inline-flex items-center gap-1 font-ui text-xs font-medium transition-colors cursor-pointer ${
                                isHelpful
                                  ? 'text-[#f81d5c] font-bold'
                                  : 'text-[#6e6862] hover:text-[#141824]'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{helpfulTotal}</span>
                            </button>
                          </div>
                        </article>
                      );
                    })}

                  {visibleModalReviewCount < modalFilteredReviews.length && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleModalReviewCount((prev) => prev + 3)
                        }
                        className="h-9 px-5 rounded-full bg-white hover:bg-[#fff0f4] text-[#f81d5c] border border-[#f81d5c]/75 font-ui text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Load More Reviews (
                        {modalFilteredReviews.length - visibleModalReviewCount}{' '}
                        remaining)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-[#ece3da] text-center space-y-2">
                  <p className="font-editorial text-lg font-bold text-[#141824]">
                    No reviews match this filter
                  </p>
                  <button
                    type="button"
                    onClick={() => setModalReviewFilter('all')}
                    className="h-8 px-4 rounded-full bg-[#f81d5c] text-white font-ui text-xs font-semibold cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. LIGHTBOX FULL-IMAGE ZOOM MODAL
          ===================================================================== */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product Image Zoom"
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close zoom view"
              className="absolute -top-3 -right-3 z-20 w-10 h-10 rounded-full bg-white text-[#141824] shadow-lg flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={getAssetUrl(lightboxImageUrl ?? currentGalleryItem.url)}
              alt={product.name}
              referrerPolicy="no-referrer"
              style={{ filter: activeColour.imageFilter ?? 'none' }}
              className="max-h-[82vh] w-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          6. SHARED WEBSITE FOOTER
          ===================================================================== */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
