import React, { useState } from 'react';
import { Sparkles, Feather, Compass, ArrowRight } from 'lucide-react';
import { Header, NavItemKey } from './Header';
import { Footer } from './Footer';
import { BagItem } from '../data/heroSlides';
import { getAssetUrl } from '../utils/assetPath';

interface OurStoryPageProps {
  onOpenSignIn: () => void;
  onNavigate: (page: NavItemKey) => void;
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

const CRAFT_CHAPTERS = [
  {
    index: '01',
    title: 'Sozni & Aari Floral Threadwork',
    subtitle: 'GENERATIONS OF MASTER NEEDLEWORK',
    body: 'Every Shafiya ensemble begins in the sun-drenched courtyards of Srinagar, where master artisans trace Chinar leaves, saffron blossoms, and badam motifs by hand before embroidering thousands of silk knots.',
    highlight: 'Up to 320 artisan hours per heirloom shawl',
  },
  {
    index: '02',
    title: 'Pure Changthangi Pashmina & Mulberry Silk',
    subtitle: 'FEATHERLIGHT VALLEY TEXTILES',
    body: 'We source ethically combed Ladakhi Pashmina and breathable Kashmiri mulberry silk, creating drapes that feel weightless against the skin while holding luminous natural dyes.',
    highlight: '100% hand-spun & loom-woven in Kashmir',
  },
  {
    index: '03',
    title: 'From Kashmir to Your Everyday Story',
    subtitle: 'CONTEMPORARY SILHOUETTES',
    body: 'Rooted in centuries-old Kashmiri royal silhouettes yet tailored for the modern woman — effortless pherans, fluid stoles, and statement ensembles designed to be lived in and loved.',
    highlight: 'Bespoke tailoring & worldwide atelier delivery',
  },
];

const EMBROIDERY_TRADITIONS = [
  {
    title: 'Hand-Knotted Floral Aari',
    eyebrow: 'CHAIN-STITCH FLORAL RELIEF',
    description:
      'Worked with a fine hooked needle known as the aari, artisans create vibrant, dimensional blooms of rose pink, turquoise, and saffron yellow across soft Pashmina and silk bases.',
    image: getAssetUrl('assets/aistudio/contact_embroidery_tall.png'),
    bgColor: '#fdd0d3',
  },
  {
    title: 'Fine Sozni Needlework',
    eyebrow: 'SATIN-STITCH HEIRLOOM MOTIFS',
    description:
      'Delicate, reversible needlepoint inspired by Kashmir’s Chinar foliage and almond blossoms — so finely executed that the motif flows seamlessly across the drape.',
    image: getAssetUrl('assets/aistudio/cat_1_shawls.png'),
    bgColor: '#c0f2e9',
  },
  {
    title: 'Contemporary Kashmiri Silhouettes',
    eyebrow: 'HERITAGE REIMAGINED',
    description:
      'Traditional pherans, fluid stoles, and tailored suits balanced with modern proportions and pastel palettes for effortless everyday and festive elegance.',
    image: getAssetUrl('assets/aistudio/cat_4_stoles.png'),
    bgColor: '#fef1b9',
  },
];

export const OurStoryPage: React.FC<OurStoryPageProps> = ({
  onOpenSignIn,
  onNavigate,
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
  const [activeChapter, setActiveChapter] = useState(0);

  return (
    <div className="min-h-screen w-full bg-[#fcf8f3] flex flex-col justify-between overflow-x-hidden">
      {/* =====================================================================
          1. NEW FULL-VIEWPORT-WIDTH EDITORIAL "OUR STORY" HERO BANNER
          ===================================================================== */}
      <section
        aria-labelledby="our-story-hero-heading"
        className="relative w-full bg-[#fcf8f3] overflow-hidden select-none border-b border-[#f0e6dc]"
      >
        {/* Shared Website Header Integrated into Top of Hero */}
        <div className="relative z-30 w-full">
          <Header
            activePage="Our Story"
            onNavigate={onNavigate}
            onOpenSignIn={onOpenSignIn}
            onSelectCategory={onSelectCategory}
            bagItems={bagItems}
            onAddSampleBagItem={onAddSampleBagItem}
            onRemoveBagItem={onRemoveBagItem}
            onOpenBagPage={onOpenBagPage}
            wishlistIds={wishlistIds}
            wishlistActive={wishlistActive}
            onToggleHeaderWishlist={onToggleHeaderWishlist}
            onToggleWishlistItem={onToggleWishlistItem}
          />
        </div>

        {/* MOBILE & TABLET COMPOSITION (< lg) — Compact Horizontal Landscape Banner */}
        <div className="lg:hidden relative w-full aspect-[16/6.2] sm:aspect-[16/5.5] md:aspect-[1312/472] max-h-[380px] overflow-hidden bg-[#fcf8f3] select-none">
          <img
            src={getAssetUrl('assets/aistudio/contact_hero_visual.png')}
            alt="Kashmiri fashion model wearing embroidered floral attire"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          />
          <div className="absolute left-[4.8%] top-[12%] sm:top-[16%] z-20 w-[52%] sm:w-[42%] pointer-events-auto">
            <p className="font-ui text-[clamp(6.5px,1.8vw,11.5px)] font-semibold uppercase tracking-[0.24em] text-[#f42a60] leading-[1.3]">
              THE ART OF KASHMIR · OUR STORY
            </p>
            <div className="relative mt-[0.5vw]">
              <h1
                id="our-story-hero-heading"
                className="font-editorial text-[clamp(18px,4.8vw,42px)] font-normal text-[#141416] leading-[0.96] tracking-[-0.02em]"
              >
                A Legacy Woven With Love
              </h1>
              <p className="font-script text-[#f82a62] text-[clamp(16px,4.2vw,36px)] leading-none block -rotate-2 mt-1">
                From Kashmir, With Grace
              </p>
            </div>
            <p className="mt-[0.5vw] font-ui text-[clamp(7px,1.5vw,11.5px)] font-normal text-[#262423] leading-[1.35] line-clamp-2 max-w-[260px]">
              Rooted in the timeless artistry of Kashmir, Shafiya brings generations of textile heritage.
            </p>
          </div>
        </div>

        {/* DESKTOP COMPOSITION (lg and up) */}
        <div className="hidden lg:block relative">
        {/* Far-Left Decorative Botanical Line-Art Flowers */}
        <img
          src={getAssetUrl('assets/aistudio/contact_hero_left_flowers.png')}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute left-0 top-[15%] w-16 xl:w-20 h-auto object-contain pointer-events-none select-none z-10"
        />

        {/* Soft Ambient Pastel Watercolor Brush Accents Across Full Width */}
        <div
          aria-hidden="true"
          className="absolute -left-16 bottom-0 w-72 h-72 rounded-full bg-[#fdd0d3]/55 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute left-[42%] top-8 w-80 h-80 rounded-full bg-[#b5f2ec]/45 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute right-[8%] bottom-6 w-80 h-80 rounded-full bg-[#fef1b9]/55 blur-3xl pointer-events-none"
        />

        {/* Full-Width Hero Composition Grid */}
        <div className="relative z-20 w-full px-5 sm:px-8 lg:pl-[5.35%] lg:pr-[2.2%] pt-4 sm:pt-6 lg:pt-4 pb-10 lg:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* LEFT SIDE: Eyebrow, Main Serif Headline, Pink Script Accent, Supporting Description & Heritage Highlights */}
            <div className="lg:col-span-5 relative z-20">
              {/* Eyebrow */}
              <p className="font-ui text-[11px] sm:text-xs xl:text-[13.5px] font-semibold uppercase tracking-[0.28em] text-[#f42a60] leading-relaxed">
                THE ART OF KASHMIR · OUR STORY
              </p>

              {/* Main Editorial Serif Headline */}
              <h1
                id="our-story-hero-heading"
                className="mt-2 font-editorial text-5xl sm:text-6xl lg:text-[clamp(48px,4.55vw,86px)] font-normal text-[#141416] leading-[0.97] tracking-[-0.02em]"
              >
                <span className="block">A Legacy Woven</span>
                <span className="block">With Love</span>
              </h1>

              {/* Pink Handwritten Script Accent */}
              <p className="mt-2 font-script text-4xl sm:text-5xl lg:text-[clamp(38px,3.35vw,62px)] text-[#f82a62] leading-[1.08] -rotate-[2deg] origin-left">
                From Kashmir, With Grace
              </p>

              {/* Supporting Brand Introduction */}
              <p className="mt-4 font-ui text-sm sm:text-base lg:text-[clamp(13.5px,0.98vw,17.5px)] font-normal text-[#262423] leading-[1.65] max-w-xl">
                Rooted in the timeless artistry of Kashmir, Shafiya brings
                generations of textile heritage into the world of contemporary
                fashion.
              </p>

              {/* Three Editorial Heritage Highlights */}
              <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-5 pt-2 border-t border-[#eadfd5]">
                <div className="space-y-1">
                  <div className="text-[#f82a62]">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                  </div>
                  <h2 className="font-ui text-xs sm:text-[13px] font-bold text-[#141824] leading-snug">
                    Master Needlework
                  </h2>
                  <p className="font-ui text-[11px] sm:text-xs text-[#686b75] leading-snug">
                    Intricate Sozni &amp; floral Aari embroidery
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-[#f82a62]">
                    <Feather className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                  </div>
                  <h2 className="font-ui text-xs sm:text-[13px] font-bold text-[#141824] leading-snug">
                    Valley Textiles
                  </h2>
                  <p className="font-ui text-[11px] sm:text-xs text-[#686b75] leading-snug">
                    Pure Pashmina &amp; Kashmiri mulberry silk
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-[#f82a62]">
                    <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                  </div>
                  <h2 className="font-ui text-xs sm:text-[13px] font-bold text-[#141824] leading-snug">
                    Modern Grace
                  </h2>
                  <p className="font-ui text-[11px] sm:text-xs text-[#686b75] leading-snug">
                    Contemporary silhouettes for everyday wear
                  </p>
                </div>
              </div>

              {/* Bottom-Left Curated Signature Row matching Homepage Brand Language */}
              <div className="mt-7 flex items-center gap-4">
                <div className="flex items-center -space-x-2.5">
                  {[
                    getAssetUrl('assets/aistudio/avatar_1.png'),
                    getAssetUrl('assets/aistudio/avatar_2.png'),
                    getAssetUrl('assets/aistudio/avatar_3.png'),
                  ].map((src, idx) => (
                    <img
                      key={src}
                      src={src}
                      alt={`Kashmiri couture look ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                  ))}
                </div>
                <div className="font-ui text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#222020] leading-[1.75]">
                  <span className="block">WHERE VALLEY HERITAGE</span>
                  <span className="block text-[#f82a62]">
                    MEETS MODERN GRACE
                  </span>
                </div>
              </div>
            </div>

            {/* CENTRE / RIGHT SIDE: Full-Width Kashmiri Fashion Model, Dal Lake & Mountains, Overlapping Embroidery Cards & Pastel Brush Strokes */}
            <div className="lg:col-span-7 relative">
              <div className="relative w-full">
                {/* Decorative Pastel Brush Stroke Shapes Behind Composition */}
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute -top-4 left-[12%] w-64 h-64 rounded-full bg-[#b5f2ec]/65 -z-10"
                />
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute -bottom-5 left-[4%] w-72 h-48 rounded-[42px] bg-[#fef1b9]/85 -rotate-3 -z-10"
                />

                {/* Main Editorial Panorama: Kashmiri Fashion Model in Embroidered Attire + Dal Lake Houseboats + Snow-Capped Mountains + Pastel Brush Strokes + Handwritten Script */}
                <div className="relative w-full rounded-[28px] lg:rounded-[34px] overflow-hidden">
                  <img
                    src={getAssetUrl('assets/aistudio/contact_hero_visual.png')}
                    alt="Kashmiri fashion model wearing richly embroidered floral attire with scenic Dal Lake houseboats and snow-capped Himalayan mountains"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover select-none"
                  />
                </div>

                {/* Overlapping Bottom-Left Editorial Craft Card: Hand-Knotted Floral Aari Detail */}
                <div className="hidden sm:flex items-center gap-3.5 absolute -bottom-5 left-3 xl:left-6 z-20 rounded-2xl bg-[#fcf9f5]/95 backdrop-blur-xs border-2 border-white p-2.5 pr-5 shadow-[0_12px_32px_rgba(24,24,27,0.12)]">
                  <img
                    src={getAssetUrl('assets/aistudio/contact_embroidery_tall.png')}
                    alt="Macro detail of hand-knotted Kashmiri floral Aari embroidery"
                    referrerPolicy="no-referrer"
                    className="w-14 h-16 xl:w-16 xl:h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <p className="font-ui text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#f82a62]">
                      ARTISAN NEEDLEWORK
                    </p>
                    <p className="font-editorial text-lg xl:text-xl font-bold text-[#141416] leading-tight">
                      Floral Aari &amp; Sozni
                    </p>
                    <p className="font-ui text-[11px] text-[#57524e]">
                      Handcrafted in Srinagar, Kashmir
                    </p>
                  </div>
                </div>

                {/* Overlapping Top-Left Editorial Silhouette Card: Contemporary Kashmiri Pheran */}
                <div className="hidden xl:flex items-center gap-3 absolute -top-3 left-4 z-20 rounded-2xl bg-[#fcf9f5]/95 backdrop-blur-xs border-2 border-white p-2 pr-4 shadow-[0_10px_28px_rgba(24,24,27,0.1)]">
                  <img
                    src={getAssetUrl('assets/aistudio/cat_3_pherans.png')}
                    alt="Contemporary Kashmiri embroidered pheran silhouette"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <p className="font-editorial text-base font-bold text-[#141416] leading-tight">
                      Valley Couture
                    </p>
                    <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-[#57524e]">
                      SHAWLS · SUITS · PHERANS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* =====================================================================
          2. PRESERVED & IMPROVED FULL-WIDTH STORYTELLING SECTION:
             "Where Valley Heritage Meets Modern Grace"
          ===================================================================== */}
      <section
        id="our-story"
        aria-labelledby="art-of-kashmir-heading"
        className="relative w-full py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-[3.5%] xl:px-[4%]"
      >
        {/* Decorative Right-Edge Floral Line Illustration */}
        <img
          src={getAssetUrl('assets/aistudio/collections_flower_right.png')}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="hidden lg:block absolute top-6 right-0 w-44 xl:w-56 h-auto object-contain pointer-events-none select-none opacity-90"
        />

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left Visual Collage: The Art of Kashmir & Valley Landscape */}
          <div className="lg:col-span-6 relative">
            {/* Layered Pastel Organic Backdrop Shapes matching Hero Language */}
            <div
              aria-hidden="true"
              className="absolute -top-6 -left-6 w-72 h-72 rounded-full bg-[#fdd0d3] opacity-75 -z-10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-6 right-4 w-80 h-60 rounded-[48px] bg-[#fef1b9] rotate-3 opacity-85 -z-10"
            />
            <div
              aria-hidden="true"
              className="absolute top-12 right-8 w-56 h-56 rounded-full bg-[#c0f2e9] opacity-70 -z-10"
            />

            <div className="grid grid-cols-12 gap-4 sm:gap-5 items-center">
              {/* Primary Embroidery Close-up Card */}
              <div className="col-span-7 rounded-[28px] overflow-hidden shadow-lg border-4 border-white bg-[#fcf8f3]">
                <img
                  src={getAssetUrl('assets/aistudio/collage_embroidery.png')}
                  alt="Intricate Kashmiri floral Aari and Sozni hand embroidery"
                  referrerPolicy="no-referrer"
                  className="w-full h-[340px] sm:h-[440px] xl:h-[480px] object-cover"
                />
                <div className="p-4 sm:p-5 bg-[#fdd0d3]/65">
                  <p className="font-editorial text-xl sm:text-2xl font-bold text-[#141416]">
                    Hand-Knotted Floral Aari
                  </p>
                  <p className="font-ui text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#3a3330] mt-0.5">
                    ARTISAN ATELIER · SRINAGAR
                  </p>
                </div>
              </div>

              {/* Right Column: Dal Lake Landscape + Handwritten Quote Card */}
              <div className="col-span-5 space-y-4 sm:space-y-5">
                <div className="rounded-[26px] overflow-hidden shadow-md border-4 border-white bg-[#fcf8f3]">
                  <img
                    src={getAssetUrl('assets/aistudio/collage_kashmir.png')}
                    alt="Dal Lake houseboats and snow-capped Zabarwan mountains in Kashmir"
                    referrerPolicy="no-referrer"
                    className="w-full h-52 sm:h-64 xl:h-72 object-cover"
                  />
                </div>

                <div className="rounded-[26px] bg-[#fef1b9] p-5 sm:p-6 border border-[#f5e49c] shadow-xs">
                  <p className="font-handwritten text-2xl sm:text-3xl xl:text-4xl text-[#17171a] leading-tight">
                    &ldquo;Threads of a Brighter Tomorrow&rdquo;
                  </p>
                  <p className="font-ui text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#4a4542] mt-2">
                    FROM KASHMIR TO YOU
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Storytelling Content */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#f43f70]">
                THE ART OF KASHMIR · OUR STORY
              </p>
              <div className="relative mt-2">
                <h2
                  id="art-of-kashmir-heading"
                  className="font-editorial text-4xl sm:text-5xl xl:text-[58px] font-normal text-[#141416] leading-[1.03]"
                >
                  Where Valley Heritage Meets Modern Grace
                </h2>
              </div>
              <p className="font-ui text-sm sm:text-base xl:text-[17px] text-[#2c2826] leading-relaxed mt-4">
                Born from the tranquil waters of Dal Lake and the vibrant
                gardens of Nishat, Shafiya celebrates the living legacy of
                Kashmiri textile artistry — preserving centuries-old needlework
                in joyful, contemporary silhouettes.
              </p>
            </div>

            {/* Interactive Craftsmanship Chapters */}
            <div className="space-y-3.5 pt-2">
              {CRAFT_CHAPTERS.map((chap, idx) => {
                const isOpen = activeChapter === idx;
                return (
                  <div
                    key={chap.index}
                    className={`rounded-2xl transition-all duration-200 border ${
                      isOpen
                        ? 'bg-white border-[#f4d4dc] shadow-sm p-5 sm:p-6'
                        : 'bg-[#f7f1ea]/70 border-transparent hover:bg-[#f7f1ea] p-4 sm:p-5'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveChapter(idx)}
                      aria-expanded={isOpen}
                      className="w-full text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-ui text-xs sm:text-sm font-bold text-[#f83a6b] tabular-nums">
                          {chap.index}.
                        </span>
                        <div>
                          <h3 className="font-editorial text-xl sm:text-2xl xl:text-[26px] font-bold text-[#141416]">
                            {chap.title}
                          </h3>
                          <p className="font-ui text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#736b65]">
                            {chap.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-3 pl-7 space-y-2">
                        <p className="font-ui text-xs sm:text-sm xl:text-[15px] text-[#3a3532] leading-relaxed">
                          {chap.body}
                        </p>
                        <p className="font-ui text-xs sm:text-sm font-semibold text-[#f83a6b]">
                          {chap.highlight}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('Collections')}
                className="px-6 py-3.5 rounded-full bg-[#17171a] hover:bg-[#2c2a29] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Explore Our Collections
              </button>
              <button
                type="button"
                onClick={() => onNavigate('Contact')}
                className="px-6 py-3.5 rounded-full bg-[#f83a6b] hover:bg-[#e02858] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
              >
                Enquire About Custom Designs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. FULL-WIDTH EDITORIAL SECTION: THE ART OF KASHMIRI EMBROIDERY
          ===================================================================== */}
      <section
        aria-labelledby="art-of-embroidery-heading"
        className="relative w-full py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-[3.5%] xl:px-[4%] bg-[#fcfaf6] border-t border-[#f0e6dc] overflow-hidden"
      >
        <img
          src={getAssetUrl('assets/aistudio/collections_flower_left.png')}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="hidden sm:block absolute top-0 left-0 w-40 lg:w-52 h-auto object-contain pointer-events-none select-none opacity-85"
        />

        <div className="relative z-10 text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#f43f70] mb-1.5">
            GENERATIONS OF CRAFTSMANSHIP
          </p>
          <h2
            id="art-of-embroidery-heading"
            className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-normal text-[#141416] leading-tight"
          >
            The Art of Kashmiri Embroidery
          </h2>
          <span
            aria-hidden="true"
            className="block w-12 h-[1.5px] bg-[#1e1e22] mx-auto mt-3 mb-3.5"
          />
          <p className="font-ui text-xs sm:text-sm lg:text-[15px] text-[#3a3532] leading-relaxed">
            Every stitch carries the poetry of the valley — from vibrant floral
            Aari relief work to whisper-fine Sozni needlepoint and contemporary
            Kashmiri tailoring.
          </p>
        </div>

        {/* Full-Width 3-Column Craftsmanship Showcase */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
          {EMBROIDERY_TRADITIONS.map((item) => (
            <article
              key={item.title}
              className="rounded-[26px] overflow-hidden bg-white border border-[#efe6dd] shadow-[0_6px_24px_rgba(24,24,27,0.04)] flex flex-col"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#f4ede6]">
                <img
                  src={getAssetUrl(item.image)}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div
                style={{ backgroundColor: `${item.bgColor}65` }}
                className="p-6 sm:p-7 xl:p-8 flex-1 flex flex-col justify-between"
              >
                <div>
                  <p className="font-ui text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#f42a60]">
                    {item.eyebrow}
                  </p>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141416] mt-1.5">
                    {item.title}
                  </h3>
                  <p className="font-ui text-xs sm:text-sm text-[#373a47] leading-relaxed mt-2.5">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. FULL-WIDTH EDITORIAL SECTION: OUR DESIGN PHILOSOPHY
          ===================================================================== */}
      <section
        aria-labelledby="design-philosophy-heading"
        className="relative w-full py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-[3.5%] xl:px-[4%] bg-[#fcf8f3] border-t border-[#f0e6dc]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-5 space-y-5">
            <p className="font-ui text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#f43f70]">
              OUR DESIGN PHILOSOPHY
            </p>
            <h2
              id="design-philosophy-heading"
              className="font-editorial text-4xl sm:text-5xl xl:text-[52px] font-normal text-[#141416] leading-[1.04]"
            >
              From Kashmir to Your Everyday Story
            </h2>
            <p className="font-script text-3xl sm:text-4xl text-[#f82a62] -rotate-1">
              Colours, Culture &amp; Contemporary Style
            </p>
            <p className="font-ui text-sm sm:text-base text-[#2c2826] leading-relaxed">
              We believe handcrafted Kashmiri textiles belong not only in
              heirloom trunks, but in the joyful moments of modern life. By
              pairing authentic valley embroidery with luminous pastel palettes
              and fluid silhouettes, each Shafiya creation honours tradition
              while feeling effortlessly contemporary.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('Contact')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#f82a62] hover:bg-[#df1950] text-white text-xs sm:text-sm font-semibold shadow-[0_6px_18px_rgba(248,42,98,0.25)] transition-all cursor-pointer"
              >
                <span>Start a Custom Design Conversation</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Right Lookbook Triptych Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="rounded-[24px] overflow-hidden bg-[#dcd0f5] shadow-sm flex flex-col">
              <img
                src={getAssetUrl('assets/aistudio/cat_2_suits.png')}
                alt="Handcrafted Kashmiri Suits"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-4">
                <p className="font-editorial text-xl font-bold text-[#141416]">
                  Pastel Silk Suits
                </p>
                <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2c2826] mt-0.5">
                  DELICATE FLORAL THREADWORK
                </p>
              </div>
            </div>

            <div className="rounded-[24px] overflow-hidden bg-[#c0f2e9] shadow-sm flex flex-col">
              <img
                src={getAssetUrl('assets/aistudio/cat_3_pherans.png')}
                alt="Handcrafted Kashmiri Pherans"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-4">
                <p className="font-editorial text-xl font-bold text-[#141416]">
                  Modern Pherans
                </p>
                <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2c2826] mt-0.5">
                  VALLEY SILHOUETTES
                </p>
              </div>
            </div>

            <div className="rounded-[24px] overflow-hidden bg-[#bfeaf5] shadow-sm flex flex-col">
              <img
                src={getAssetUrl('assets/aistudio/cat_6_custom.png')}
                alt="Bespoke Kashmiri Custom Designs"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-4">
                <p className="font-editorial text-xl font-bold text-[#141416]">
                  Bespoke Couture
                </p>
                <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2c2826] mt-0.5">
                  YOUR STORY, OUR CRAFT
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. SHARED WEBSITE FOOTER (Strictly Preserved)
          ===================================================================== */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
