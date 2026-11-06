import React, { useState } from 'react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import {
  FEATURED_PIECES,
  FeaturedPiece,
  COLLECTION_CATEGORIES,
} from '../data/heroSlides';
import { getAssetUrl } from '../utils/assetPath';
import { Footer } from './Footer';
import { NavItemKey } from './Header';

interface EditorialSectionsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onAddToBag: (piece: FeaturedPiece) => void;
  onNavigate?: (page: NavItemKey) => void;
  onOpenProduct?: (slug: string) => void;
}

const PIECE_TO_SLUG: Record<string, string> = {
  'gulmarg-floral-shawl': 'pink-elegance-embroidered-kurta-pant-dupatta-set',
  'nishat-lavender-suit': 'mustard-glow-embroidered-kurta-pant-dupatta-set',
  'shalimar-ivory-pheran': 'teal-royale-gold-embroidered-kurta-pant-dupatta-set',
  'zabarwan-kani-stole': 'lime-grace-embroidered-kurta-pant-dupatta-set',
  'chinar-rose-potli': 'teal-grace-silver-embroidered-kurta-set',
  'midnight-bloom-bespoke': 'midnight-elegance-silver-embroidered-kurta-set',
};

export const EditorialSections: React.FC<EditorialSectionsProps> = ({
  selectedCategory,
  onSelectCategory,
  wishlistIds,
  onToggleWishlist,
  onAddToBag,
  onNavigate,
  onOpenProduct,
}) => {
  const [addedId, setAddedId] = useState<string | null>(null);

  const visiblePieces =
    selectedCategory === 'All'
      ? FEATURED_PIECES
      : FEATURED_PIECES.filter((p) => p.category === selectedCategory);

  const handleAddClick = (piece: FeaturedPiece) => {
    onAddToBag(piece);
    setAddedId(piece.id);
    window.setTimeout(() => {
      setAddedId((prev) => (prev === piece.id ? null : prev));
    }, 1400);
  };

  return (
    <div className="w-full bg-[#fcfaf6] overflow-hidden">
      {/* ===================================================================
          FEATURED COLLECTION SHOWCASE (Interactive Filter + Bag)
          =================================================================== */}
      <section
        id="featured-collection"
        aria-labelledby="featured-collection-heading"
        className="relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-[3.5%] border-t border-[#f1e8df]"
      >
        {/* Decorative Pastel Wash */}
        <div
          aria-hidden="true"
          className="absolute top-12 right-[6%] w-72 h-72 rounded-full bg-[#fef1b9]/45 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-12 left-[5%] w-72 h-72 rounded-full bg-[#fdd0d3]/35 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#f43f70] mb-1.5">
              CURATED SEASONAL EDIT
            </p>
            <div className="relative inline-block">
              <h2
                id="featured-collection-heading"
                className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#141416] leading-tight"
              >
                Featured Kashmiri Creations
              </h2>
              <span className="hidden sm:inline-block font-script text-[#f83a6b] text-3xl lg:text-4xl ml-3 -rotate-6 select-none">
                Handpicked
              </span>
            </div>
            <p className="font-ui text-xs sm:text-sm text-[#4a4542] mt-2 max-w-xl">
              Explore signature pieces from our six collections — each crafted by master artisans in Srinagar and ready to add to your wardrobe.
            </p>
          </div>

          {/* Interactive Category Filter Bar */}
          <div
            role="tablist"
            aria-label="Filter Featured Creations by Category"
            className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-[#f5eee7] p-1.5 rounded-2xl self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'All'}
              onClick={() => onSelectCategory('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#17171a] text-white shadow-xs'
                  : 'text-[#4a4542] hover:text-[#17171a] hover:bg-white/60'
              }`}
            >
              All Creations
            </button>
            {COLLECTION_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#f83a6b] text-white shadow-xs'
                      : 'text-[#4a4542] hover:text-[#17171a] hover:bg-white/60'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Creations Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {visiblePieces.map((piece) => {
            const isWishlisted = wishlistIds.includes(piece.id);
            const isJustAdded = addedId === piece.id;
            return (
              <article
                key={piece.id}
                onClick={() => {
                  const targetSlug =
                    PIECE_TO_SLUG[piece.id] ??
                    'pink-elegance-embroidered-kurta-pant-dupatta-set';
                  if (onOpenProduct) {
                    onOpenProduct(targetSlug);
                  } else if (onNavigate) {
                    onNavigate('Collections');
                  }
                }}
                className="group rounded-[24px] overflow-hidden bg-white border border-[#efe6dd] shadow-[0_6px_24px_rgba(24,24,27,0.04)] hover:shadow-[0_14px_34px_rgba(24,24,27,0.09)] transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Product Photography */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f6efe8]">
                  <img
                    src={getAssetUrl(piece.image)}
                    alt={piece.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(piece.id);
                    }}
                    aria-label={
                      isWishlisted
                        ? `Remove ${piece.name} from wishlist`
                        : `Add ${piece.name} to wishlist`
                    }
                    aria-pressed={isWishlisted}
                    className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1e1e22] hover:bg-white shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted
                          ? 'fill-[#f83a6b] text-[#f83a6b]'
                          : 'text-[#1e1e22]'
                      }`}
                    />
                  </button>
                </div>

                {/* Pastel Editorial Card Body */}
                <div
                  style={{ backgroundColor: `${piece.pastelBg}55` }}
                  className="p-5 sm:p-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5c5550]">
                      <span>{piece.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{piece.craftNote}</span>
                    </div>
                    <h3 className="font-editorial text-2xl font-bold text-[#141416] mt-1.5 leading-snug">
                      {piece.name}
                    </h3>
                  </div>

                  <div className="mt-5 pt-4 border-t border-black/8 flex items-center justify-between gap-4">
                    <span className="font-ui text-base font-bold text-[#141416] tabular-nums">
                      {piece.price}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddClick(piece);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#1e1e22] text-white'
                          : 'bg-[#f83a6b] hover:bg-[#e02858] text-white shadow-xs'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Shared Website Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
