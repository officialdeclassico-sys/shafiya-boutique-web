import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HERO_SLIDES, BagItem } from '../data/heroSlides';
import { getAssetUrl } from '../utils/assetPath';
import { Header, NavItemKey } from './Header';

interface HeroBannerProps {
  activePage?: NavItemKey;
  onNavigate?: (page: NavItemKey) => void;
  onOpenSignIn: () => void;
  onSelectCategory?: (categoryId: string) => void;
  bagItems?: BagItem[];
  onAddSampleBagItem?: () => void;
  onRemoveBagItem?: (id: string) => void;
  onOpenBagPage?: () => void;
  wishlistIds?: string[];
  wishlistActive?: boolean;
  onToggleHeaderWishlist?: () => void;
  onToggleWishlistItem?: (id: string) => void;
}

const HERO_BACKGROUND_IMAGE =
  'assets/aistudio/Kashmiri_Embroidery_Blossom_Portrait_edcd40b3.png';

// Mobile slide order preserved strictly unchanged so mobile (<640px) is 100% untouched
const MOBILE_SLIDE_MAP = [2, 0, 1];

interface PortraitCircleItem {
  id: string;
  src: string;
  alt: string;
  imgClassName: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activePage,
  onNavigate,
  onOpenSignIn,
  onSelectCategory,
  bagItems,
  onAddSampleBagItem,
  onRemoveBagItem,
  onOpenBagPage,
  wishlistIds,
  wishlistActive,
  onToggleHeaderWishlist,
  onToggleWishlistItem,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scriptImgError, setScriptImgError] = useState(false);

  const totalSlides = HERO_SLIDES.length;
  const slide = HERO_SLIDES[currentSlide];
  const mobileSlide = HERO_SLIDES[MOBILE_SLIDE_MAP[currentSlide] ?? currentSlide];

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handleSelectSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Continuous 5-second automatic slide transition preserving existing timing and sequence
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [currentSlide, totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Distinct, realistic female fashion models wearing elegant Kashmiri outfits & jhumkas
  const desktopPortraits: PortraitCircleItem[] = [
    {
      id: 'portrait-1',
      src: getAssetUrl(
        currentSlide === 2
          ? 'assets/aistudio/Warm_Terracotta_Kurta_Portrait_bf2214ec.png'
          : 'assets/aistudio/Maroon_Embroidered_Salwar_Kameez_Portrait_7c1ce529.png'
      ),
      alt: 'Kashmiri fashion model wearing embroidered V-neck suit and traditional jhumka earrings',
      imgClassName:
        currentSlide === 2
          ? 'w-full h-full object-cover object-[48%_7%] scale-[2.55]'
          : 'w-full h-full object-cover object-[49%_6%] scale-[2.55]',
    },
    {
      id: 'portrait-2',
      src: getAssetUrl('assets/aistudio/Fuchsia_Embroidered_Kurta_Portrait__1__5afec958.png'),
      alt: 'Kashmiri fashion model with floral hair accent wearing rose-pink embroidered ensemble and jhumka earrings',
      imgClassName: 'w-full h-full object-cover object-[48%_6%] scale-[2.65]',
    },
    {
      id: 'portrait-3',
      src: getAssetUrl('assets/aistudio/Teal_Elegance_in_an_Archway_61e3e17f.png'),
      alt: 'Kashmiri fashion model wearing emerald-teal gold-embroidered suit and statement jhumka earrings',
      imgClassName: 'w-full h-full object-cover object-[45%_6%] scale-[2.55]',
    },
  ];

  return (
    <section
      id="home"
      aria-label="Shafiya Kashmiri Designs Hero Banner"
      className="relative w-full bg-white overflow-hidden select-none"
    >
      {/* Shared Website Header */}
      <div className="w-full bg-[#fcf8f3] border-b border-[#f1e9e0]">
        <Header
          activePage={activePage}
          onNavigate={onNavigate}
          onOpenSignIn={onOpenSignIn}
          onSelectCollectionSlide={handleSelectSlide}
          onSelectCategory={onSelectCategory}
          bagItems={bagItems}
          onAddSampleBagItem={onAddSampleBagItem}
          onRemoveBagItem={onRemoveBagItem}
          wishlistIds={wishlistIds}
          wishlistActive={wishlistActive}
          onToggleHeaderWishlist={onToggleHeaderWishlist}
          onToggleWishlistItem={onToggleWishlistItem}
          onOpenBagPage={onOpenBagPage}
        />
      </div>

      {/* =====================================================================
          UNIFIED EDITORIAL HERO BANNER (Desktop, Tablet & Mobile)
          - Mobile (<640px): Exact visual replication of reference (aspect-[371/182]),
            completely static background (model on left, cherry blossoms across top,
            wooden houseboat, Dal Lake & mountains on bottom-right, lotus divider),
            preserving all existing text animations.
          - Desktop (>=640px): STRICTLY UNCHANGED (sm:aspect-[2033/745] md:aspect-[2033/730] lg:aspect-[2033/715])
          ===================================================================== */}
      <div className="relative w-full aspect-[371/182] sm:aspect-[2033/745] md:aspect-[2033/730] lg:aspect-[2033/715] max-w-[2560px] mx-auto overflow-hidden bg-[#fff9fb] sm:bg-white border-b border-[#f1e8df]">
        {/* ===================================================================
            MOBILE-ONLY STATIC HERO BACKGROUND (<640px)
            Completely static background matching the supplied visual blueprint
            =================================================================== */}
        <img
          src={getAssetUrl('assets/aistudio/mobile_hero_exact_bg.png')}
          alt="Kashmiri woman wearing traditional floral embroidered outfit beside Dal Lake houseboats, Himalayan mountains, and cherry blossom branches"
          referrerPolicy="no-referrer"
          className="sm:hidden absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* ===================================================================
            DESKTOP-ONLY HERO BACKGROUND IMAGE (>=640px) — STRICTLY UNCHANGED
            =================================================================== */}
        <motion.img
          key={`canvas-${currentSlide}`}
          src={getAssetUrl(HERO_BACKGROUND_IMAGE)}
          alt="Kashmiri woman wearing traditional floral embroidered outfit and headscarf beside carved wooden architecture and pink blossoms"
          referrerPolicy="no-referrer"
          initial={{ opacity: 0.96 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="hidden sm:block sm:absolute sm:inset-y-0 sm:left-0 sm:w-full sm:h-full sm:object-cover sm:object-left-top pointer-events-none"
        />

        {/* Desktop-only floating blossom petal on the middle-right matching the three reference images */}
        <svg
          aria-hidden="true"
          viewBox="0 0 64 42"
          className="hidden sm:block absolute sm:right-[8.8%] sm:top-[37.5%] sm:w-[2.45vw] h-auto pointer-events-none z-10 drop-shadow-[0_2px_4px_rgba(238,38,102,0.12)]"
        >
          <defs>
            <linearGradient id="heroPetalGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d5e" />
              <stop offset="55%" stopColor="#f54d84" />
              <stop offset="100%" stopColor="#fda4c4" />
            </linearGradient>
          </defs>
          <path
            d="M4 37 C18 35, 34 31, 45 21 C54 13, 58 4, 60 2 C51 6, 37 12, 26 20 C16 27, 9 33, 4 37 Z"
            fill="url(#heroPetalGrad)"
          />
        </svg>

        {/* Accessible semantic markers preserving slide captions */}
        <div
          aria-label={slide.embroideryCaption}
          title={slide.embroideryCaption}
          className="sr-only"
        />
        <div
          aria-label={slide.landscapeCaption}
          title={slide.landscapeCaption}
          className="sr-only"
        />

        {/* 2-Column Responsive CSS Grid:
            - Mobile (<640px): grid-cols-[48.8%_51.2%] matching reference text start at x=181/371
            - Desktop (>=640px): sm:grid-cols-[53.4%_46.6%] matching reference left margin at x=1086/2033 */}
        <div className="relative z-20 w-full h-full grid grid-cols-[48.8%_51.2%] sm:grid-cols-[53.4%_46.6%] items-center">
          {/* Column 1: Protected Model Area — prevents any text from entering the model region */}
          <div aria-hidden="true" className="w-full h-full pointer-events-none" />

          {/* Column 2: Right-Hand Content Container */}
          <div className="w-full min-w-0 pr-[2.5%] sm:pr-[3.2%] sm:pt-[1.8%] pointer-events-auto">
            {/* ===============================================================
                MOBILE VERSION (<640px) — EXACT REFERENCE POSITION & PRESERVED TEXT ANIMATIONS
                =============================================================== */}
            <div className="sm:hidden -mt-[28%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`mobile-hero-content-${mobileSlide.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative inline-block">
                    <h1 className="font-editorial text-[clamp(18px,6.25vw,38px)] font-normal text-[#141416] leading-[1.06] tracking-[-0.015em]">
                      <span className="block whitespace-nowrap">
                        {mobileSlide.headlineLine1}
                      </span>
                      <span className="relative block w-fit whitespace-nowrap">
                        {mobileSlide.headlineLine2}
                        {mobileSlide.useReferenceScriptAsset && !scriptImgError ? (
                          <span className="pointer-events-none select-none">
                            <span className="sr-only">{mobileSlide.scriptWord}</span>
                            <img
                              src={getAssetUrl('assets/aistudio/script_beautiful.png')}
                              alt=""
                              aria-hidden="true"
                              referrerPolicy="no-referrer"
                              onError={() => setScriptImgError(true)}
                              className="absolute left-[102%] -top-[6%] w-[1.9em] max-w-none h-auto object-contain"
                            />
                          </span>
                        ) : (
                          <span className="font-script text-[#f83a6b] text-[1.04em] leading-none absolute left-[103%] top-[2%] -rotate-[12deg] whitespace-nowrap pointer-events-none select-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
                            {mobileSlide.scriptWord}
                          </span>
                        )}
                      </span>
                      <span className="block whitespace-nowrap pl-[0.16em]">
                        {mobileSlide.headlineLine3}
                      </span>
                    </h1>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ===============================================================
                DESKTOP VERSION (>=640px) — REPLICATING SUPPLIED REFERENCES
                =============================================================== */}
            <div className="hidden sm:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`desktop-hero-content-${slide.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* 1. Eyebrow — 2 lines in rose-pink uppercase */}
                  <p className="font-ui text-[clamp(8.5px,0.76vw,15.5px)] font-semibold uppercase tracking-[0.23em] text-[#ee2666] leading-[1.72]">
                    <span className="block whitespace-nowrap">
                      {slide.eyebrowLine1}
                    </span>
                    <span className="block whitespace-nowrap">
                      {slide.eyebrowLine2}
                    </span>
                  </p>

                  {/* 2. Main Editorial Serif Heading + Animated Pink Handwritten Script Word & Swash */}
                  <div className="relative mt-[0.35vw] inline-block">
                    <h2 className="font-editorial text-[clamp(30px,4.55vw,92px)] font-normal text-[#121214] leading-[0.93] tracking-[-0.015em]">
                      <span className="block whitespace-nowrap">
                        {slide.headlineLine1}
                      </span>
                      <span className="relative block w-fit whitespace-nowrap">
                        {slide.headlineLine2}
                        {/* Script-font entrance animation + curved pink underline swash */}
                        <motion.span
                          key={`script-${slide.id}`}
                          initial={{ opacity: 0, x: -6, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.48,
                            delay: 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="absolute left-[103.5%] -top-[6%] -rotate-[8.5deg] origin-bottom-left whitespace-nowrap pointer-events-none select-none"
                        >
                          <span className="font-script text-[#ee2464] text-[1.18em] leading-none block drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                            {slide.scriptWord}
                          </span>
                          {/* Hand-drawn curved pink underline flourish matching the references */}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 240 28"
                            className="w-[88%] h-auto -mt-[0.16em] ml-[8%] overflow-visible"
                          >
                            <motion.path
                              d="M 4 22 Q 118 4 226 7"
                              fill="none"
                              stroke="#ee2464"
                              strokeWidth="3.6"
                              strokeLinecap="round"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{
                                duration: 0.52,
                                delay: 0.16,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            />
                          </svg>
                        </motion.span>
                      </span>
                      <span className="block whitespace-nowrap">
                        {slide.headlineLine3}
                      </span>
                    </h2>
                  </div>

                  {/* 3. Multi-Line Editorial Serif Description */}
                  <p className="mt-[0.82vw] font-editorial text-[clamp(10.5px,1.16vw,23.5px)] font-medium text-[#181717] leading-[1.31] tracking-[0.002em]">
                    {slide.description.map((line, i) => (
                      <span key={i} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
                  </p>

                  {/* 4. Lower-Right Portrait Trio (Audi-Rings Overlap) + Vertical Line + Mountain & Floral Signature */}
                  <div className="mt-[0.95vw] ml-[1.85vw] flex items-center gap-[1.55vw]">
                    {/* Three Overlapping Circular Female Model Portraits */}
                    <div className="relative flex items-center -space-x-[1.25vw] shrink-0">
                      {desktopPortraits.map((portrait, idx) => (
                        <button
                          key={portrait.id}
                          type="button"
                          onClick={() => handleSelectSlide(idx)}
                          aria-label={`Select Hero Slide 0${idx + 1}: ${HERO_SLIDES[idx]?.headlineLine1} ${HERO_SLIDES[idx]?.headlineLine2}`}
                          className={`group relative w-[clamp(50px,7.4vw,150px)] h-[clamp(50px,7.4vw,150px)] rounded-full p-[2px] lg:p-[3.2px] bg-white border-[2px] lg:border-[3.2px] border-[#ee2666] shadow-[0_6px_16px_rgba(238,38,102,0.12)] transition-transform duration-200 hover:scale-[1.03] cursor-pointer ${
                            idx === 1 ? 'z-20' : 'z-10'
                          } ${
                            currentSlide === idx
                              ? 'ring-[1.5px] ring-[#ee2666]/35'
                              : ''
                          }`}
                        >
                          {/* Subtle inner outline + cropped model portrait */}
                          <span className="block w-full h-full rounded-full overflow-hidden ring-[1px] ring-[#ee2666]/45 bg-[#f7ede6]">
                            <img
                              src={portrait.src}
                              alt={portrait.alt}
                              referrerPolicy="no-referrer"
                              className={portrait.imgClassName}
                            />
                          </span>
                        </button>
                      ))}

                      {/* Subtle Audi-rings interlocking pink arc overlay across the overlapping joints */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 436 160"
                        className="absolute inset-0 w-full h-full pointer-events-none z-30"
                      >
                        {/* Left circle right-side interlocking arc */}
                        <path
                          d="M 136 22 A 77 77 0 0 1 136 138"
                          fill="none"
                          stroke="#ee2666"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                        {/* Right circle left-side interlocking arc */}
                        <path
                          d="M 300 22 A 77 77 0 0 0 300 138"
                          fill="none"
                          stroke="#ee2666"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      </svg>
                    </div>

                    {/* Thin Vertical Pink Line */}
                    <div
                      aria-hidden="true"
                      className="w-[1.5px] h-[clamp(42px,6.1vw,124px)] bg-[#ee2666]/85 shrink-0"
                    />

                    {/* Accompanying Signature Block with Kashmir Mountain Illustration & Floral Divider */}
                    <div className="flex flex-col items-center justify-center text-center shrink-0">
                      {/* Subtle Kashmir Mountain Illustration */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 140 44"
                        className="w-[clamp(46px,6.2vw,126px)] h-auto mb-[0.3vw] text-[#ee2666]"
                      >
                        {/* Outer mountain peaks */}
                        <path
                          d="M 8 40 L 42 13 L 56 26 L 74 5 L 103 33 M 87 18 L 99 10 L 132 40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Inner ridge shading facets matching Kashmir mountain line-art */}
                        <path
                          d="M 42 13 L 36 29 L 25 36 M 74 5 L 68 24 L 59 35 M 74 5 L 81 22 M 99 10 L 95 25 L 108 34"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      {/* Two-Line Uppercase Signature Text */}
                      <div className="font-ui text-[clamp(7px,0.74vw,15px)] font-semibold uppercase tracking-[0.22em] text-[#141416] leading-[1.85]">
                        <span className="block whitespace-nowrap">
                          {slide.curatedLine1}
                        </span>
                        <span className="block whitespace-nowrap">
                          {slide.curatedLine2}
                        </span>
                      </div>

                      {/* Delicate Floral Divider */}
                      <div
                        aria-hidden="true"
                        className="mt-[0.35vw] flex items-center justify-center w-full gap-[0.55vw]"
                      >
                        <span className="h-[1.2px] flex-1 bg-gradient-to-r from-transparent via-[#ee2666]/70 to-[#ee2666]" />
                        <svg
                          viewBox="0 0 36 36"
                          className="w-[clamp(11px,1.45vw,29px)] h-[clamp(11px,1.45vw,29px)] text-[#ee2666] shrink-0"
                        >
                          {[0, 60, 120, 180, 240, 300].map((angle) => (
                            <path
                              key={angle}
                              d="M 18 16 C 14.5 9, 15.5 3.5, 18 3.5 C 20.5 3.5, 21.5 9, 18 16 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.9"
                              strokeLinejoin="round"
                              transform={`rotate(${angle} 18 18)`}
                            />
                          ))}
                          <circle cx="18" cy="18" r="2.2" fill="currentColor" />
                        </svg>
                        <span className="h-[1.2px] flex-1 bg-gradient-to-l from-transparent via-[#ee2666]/70 to-[#ee2666]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
