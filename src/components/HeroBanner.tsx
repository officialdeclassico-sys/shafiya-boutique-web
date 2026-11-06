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

  const avatarThumbnails = [
    getAssetUrl('assets/aistudio/avatar_1.png'),
    getAssetUrl('assets/aistudio/avatar_2.png'),
    getAssetUrl('assets/aistudio/avatar_3.png'),
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
          - 2-Column CSS Grid structure:
            * Left Column: Protected Model & Architecture Zone
            * Right Column: Right-Hand White-Space Content Zone (zero overlap at all widths)
          - Mobile (<640px): Displays ONLY the 3-line headline and pink handwritten accent word inside the right-side white space
          - Tablet & Desktop (>=640px): Displays enlarged headline, pink accent, description, avatars, and curated tagline
          ===================================================================== */}
      <div className="relative w-full aspect-[16/6.5] sm:aspect-[1798/710] md:aspect-[1798/695] lg:aspect-[1798/685] max-w-[2560px] mx-auto overflow-hidden bg-white border-b border-[#f1e8df]">
        {/* Approved Hero Background Image:
            - On mobile (<640px), framed via proportional width (w-[116.3%] -left-[12.8%] top-0 h-auto)
              so the Kashmiri model occupies 0%–46% on the left and 48%–100% on the right is pure white space.
            - On tablet/desktop (>=640px), full-width top-aligned cover preserving the approved composition. */}
        <motion.img
          key={`canvas-${currentSlide}`}
          src={getAssetUrl(HERO_BACKGROUND_IMAGE)}
          alt="Kashmiri woman wearing traditional floral embroidered outfit and headscarf beside carved wooden architecture and pink blossoms"
          referrerPolicy="no-referrer"
          initial={{ opacity: 0.96 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 -left-[12.8%] w-[116.3%] max-w-none h-auto sm:inset-y-0 sm:left-0 sm:w-full sm:h-full sm:object-cover sm:object-left-top pointer-events-none"
        />

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

        {/* 2-Column Responsive CSS Grid: Left = Protected Model Zone, Right = White-Space Content Zone */}
        <div className="relative z-20 w-full h-full grid grid-cols-[49.5%_50.5%] sm:grid-cols-[54%_46%] lg:grid-cols-[55%_45%] items-center">
          {/* Column 1: Protected Model Area — prevents any text from entering the model region */}
          <div aria-hidden="true" className="w-full h-full pointer-events-none" />

          {/* Column 2: Right-Hand White-Space Content Container */}
          <div className="w-full min-w-0 pr-[2.5%] sm:pr-[5%] lg:pr-[6%] pt-[2%] sm:pt-[1%] pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`hero-content-${slide.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Small uppercase introductory text — Hidden on mobile, enlarged on tablet/desktop */}
                <p className="hidden sm:block font-ui text-[clamp(9.5px,0.88vw,14px)] lg:text-[clamp(11.5px,0.95vw,16px)] font-medium uppercase tracking-[0.24em] lg:tracking-[0.28em] text-[#f43f70] leading-[1.48]">
                  <span className="block whitespace-nowrap">
                    {slide.eyebrowLine1}
                  </span>
                  <span className="block whitespace-nowrap">
                    {slide.eyebrowLine2}
                  </span>
                </p>

                {/* Prominent Editorial Serif Headline + Handwritten Pink Script Accent Word */}
                <div className="relative sm:mt-[0.65vw] inline-block">
                  <h1 className="font-editorial text-[clamp(20px,6.8vw,42px)] sm:text-[clamp(34px,4.7vw,58px)] lg:text-[clamp(52px,5.1vw,94px)] font-normal text-[#141416] leading-[1.03] sm:leading-[0.94] tracking-[-0.02em]">
                    <span className="block whitespace-nowrap">
                      {slide.headlineLine1}
                    </span>
                    <span className="relative block w-fit whitespace-nowrap">
                      {slide.headlineLine2}
                      {/* Handwritten Pink Script Accent Word anchored cleanly beside Line 2 inside the right white space */}
                      {slide.useReferenceScriptAsset && !scriptImgError ? (
                        <span className="pointer-events-none select-none">
                          <span className="sr-only">{slide.scriptWord}</span>
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
                          {slide.scriptWord}
                        </span>
                      )}
                    </span>
                    <span className="block whitespace-nowrap">
                      {slide.headlineLine3}
                    </span>
                  </h1>
                </div>

                {/* Existing 3-Line Description — Hidden on mobile, enlarged for comfortable desktop readability */}
                <p className="hidden sm:block sm:mt-[1vw] lg:mt-[1.05vw] font-ui text-[clamp(11px,1.02vw,15.5px)] lg:text-[clamp(13.5px,1.08vw,19px)] font-normal text-[#262423] leading-[1.48] tracking-[0.005em]">
                  {slide.description.map((line, i) => (
                    <span key={i} className="block whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </p>

                {/* Circular fashion thumbnails + Curated tagline — Hidden on mobile, prominent on tablet/desktop */}
                <div className="hidden sm:flex sm:mt-[1.05vw] lg:mt-[1.1vw] items-center sm:gap-[0.9vw] lg:gap-[1vw]">
                  <div className="flex items-center sm:-space-x-[0.55vw]">
                    {avatarThumbnails.map((src, idx) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => handleSelectSlide(idx)}
                        aria-label={`Preview Kashmiri Look 0${idx + 1}`}
                        className={`relative sm:w-[clamp(28px,2.6vw,44px)] sm:h-[clamp(28px,2.6vw,44px)] lg:w-[clamp(36px,2.8vw,50px)] lg:h-[clamp(36px,2.8vw,50px)] rounded-full overflow-hidden border-[2px] border-white shadow-sm transition-transform duration-200 hover:scale-105 hover:z-10 cursor-pointer ${
                          currentSlide === idx ? 'ring-2 ring-[#f83a6b]/50' : ''
                        }`}
                      >
                        <img
                          src={src}
                          alt={`Kashmiri design thumbnail ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="font-ui text-[clamp(8px,0.68vw,11px)] lg:text-[clamp(9.5px,0.72vw,12.5px)] font-semibold uppercase tracking-[0.2em] text-[#222020] leading-[1.65]">
                    <span className="block whitespace-nowrap">
                      {slide.curatedLine1}
                    </span>
                    <span className="block whitespace-nowrap">
                      {slide.curatedLine2}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
