import React from 'react';
import { COLLECTION_CATEGORIES, CollectionCategory } from '../data/heroSlides';
import { getAssetUrl } from '../utils/assetPath';
import { NavItemKey } from './Header';

interface OurCollectionsSectionProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onNavigate?: (page: NavItemKey) => void;
}

export const OurCollectionsSection: React.FC<OurCollectionsSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onNavigate,
}) => {
  const handleCardClick = (cat: CollectionCategory) => {
    onSelectCategory(cat.id);
    if (cat.id === 'Custom Designs' && onNavigate) {
      onNavigate('Custom Designs');
      window.setTimeout(() => {
        const el = document.getElementById('contact-enquiry');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 40);
      return;
    }
    if (onNavigate) {
      onNavigate('Collections');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetId =
      cat.id === 'Custom Designs' ? 'custom-designs' : 'featured-collection';
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="collections"
      aria-labelledby="our-collections-heading"
      className="relative w-full bg-[#fcfaf6] pt-8 sm:pt-10 lg:pt-12 pb-12 sm:pb-16 overflow-hidden"
    >
      {/* Left & Right Decorative Pink Floral Line-Art Illustrations from Reference */}
      <img
        src={getAssetUrl('assets/aistudio/collections_flower_left.png')}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="hidden sm:block absolute top-0 left-0 w-36 md:w-44 lg:w-52 xl:w-60 h-auto object-contain pointer-events-none select-none"
      />
      <img
        src={getAssetUrl('assets/aistudio/collections_flower_right.png')}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="hidden sm:block absolute top-0 right-0 w-36 md:w-44 lg:w-52 xl:w-60 h-auto object-contain pointer-events-none select-none"
      />

      {/* Section Header */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-10 lg:mb-12">
        {/* Soft Blush Pink Watercolor Brush Wash behind title */}
        <svg
          viewBox="0 0 680 130"
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] lg:w-[640px] h-auto pointer-events-none select-none -z-10 opacity-85"
        >
          <path
            d="M45 78C130 28 265 14 390 32C490 46 585 30 645 48C615 88 495 112 355 104C215 96 95 115 45 78Z"
            fill="#fbe4e8"
          />
          <path
            d="M95 45C195 12 340 18 485 38C550 48 605 56 625 74C545 96 405 94 265 86C155 80 70 68 95 45Z"
            fill="#f9d8df"
            opacity="0.65"
          />
        </svg>

        {/* Small Uppercase Pink Eyebrow */}
        <p className="font-ui text-[11px] sm:text-xs lg:text-[13px] font-semibold uppercase tracking-[0.28em] text-[#f43f70] mb-1.5">
          OUR COLLECTIONS
        </p>

        {/* Main Serif Title */}
        <h2
          id="our-collections-heading"
          className="font-editorial text-4xl sm:text-5xl lg:text-[56px] font-normal text-[#141416] leading-[1.04] tracking-[-0.015em]"
        >
          Our Collections
        </h2>

        {/* Centered Editorial Hairline Accent */}
        <span
          aria-hidden="true"
          className="block w-11 h-[1.5px] bg-[#1e1e22] mx-auto mt-2.5 mb-3"
        />

        {/* Supporting Description */}
        <p className="font-ui text-xs sm:text-sm lg:text-[15px] text-[#262423] font-normal max-w-2xl mx-auto leading-relaxed">
          Discover our handcrafted Kashmiri collections, where traditional artistry meets contemporary style.
        </p>
      </div>

      {/* Six Category Cards Grid (6 in one horizontal row on desktop, 3 on tablet, 2 on mobile) */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-[3%]">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4">
          {COLLECTION_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCardClick(category)}
                aria-pressed={isSelected}
                style={{ backgroundColor: category.bgColor }}
                className={`group relative w-full text-left rounded-[18px] sm:rounded-[20px] overflow-hidden flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_14px_30px_rgba(24,24,27,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f83a6b] cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#f83a6b] shadow-[0_12px_26px_rgba(248,58,107,0.16)]'
                    : 'shadow-[0_4px_14px_rgba(0,0,0,0.03)]'
                }`}
              >
                {/* Top Fashion Photograph with subtle hover zoom */}
                <div className="relative w-full aspect-[232/174] overflow-hidden bg-[#f4ede6]">
                  <img
                    src={getAssetUrl(category.image)}
                    alt={`${category.title} — Shafiya Kashmiri Designs`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>

                {/* Pastel Footer Block — Clean typography ONLY, ZERO arrow buttons or icons */}
                <div className="w-full px-4 sm:px-5 py-4 sm:py-[18px] flex flex-col justify-center min-h-[84px] sm:min-h-[90px] transition-colors duration-300">
                  <h3 className="font-editorial text-[20px] sm:text-[22px] font-bold text-[#141416] leading-[1.15] tracking-[-0.01em] group-hover:text-[#000000]">
                    {category.title}
                  </h3>
                  <p className="font-ui text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2c2826] mt-1 leading-snug">
                    {category.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
