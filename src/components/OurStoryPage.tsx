import React from 'react';
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

/**
 * Reusable 5-petal Kashmiri Lotus outline icon matching the reference design
 */
const LotusOutlineIcon: React.FC<{ className?: string; strokeWidth?: number }> = ({
  className = 'w-8 h-6 text-[#e5195e]',
  strokeWidth = 2.1,
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 64 42"
    fill="none"
    className={className}
  >
    {/* Center petal */}
    <path
      d="M32 4 C25 14, 24 26, 32 35 C40 26, 39 14, 32 4 Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left inner petal */}
    <path
      d="M27 11 C17 14, 14 25, 29 35"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right inner petal */}
    <path
      d="M37 11 C47 14, 50 25, 35 35"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left outer petal */}
    <path
      d="M19 20 C9 21, 6 29, 25 36"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right outer petal */}
    <path
      d="M45 20 C55 21, 58 29, 39 36"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Subtle base curve */}
    <path
      d="M18 37 Q32 40 46 37"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Pink outline tilted thread spool icon for "Authentic Kashmiri Textiles"
 */
const ThreadSpoolIcon: React.FC<{ className?: string }> = ({
  className = 'w-12 h-12 text-[#e5195e]',
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 56 56"
    fill="none"
    className={className}
  >
    <g transform="rotate(-24 28 28)">
      {/* Top rim */}
      <ellipse
        cx="28"
        cy="12"
        rx="12"
        ry="4.2"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <ellipse
        cx="28"
        cy="12"
        rx="3.8"
        ry="1.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* Spool body */}
      <path
        d="M18 14.5 L18 41.5 M38 14.5 L38 41.5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      {/* Wrapped thread lines */}
      <path
        d="M18 20 Q28 23 38 19 M18 25.5 Q28 28.5 38 24.5 M18 31 Q28 34 38 30 M18 36.5 Q28 39.5 38 35.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      {/* Bottom rim */}
      <path
        d="M16 41.5 C16 44, 40 44, 40 41.5 C40 45.2, 16 45.2, 16 41.5 Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

/**
 * Pink outline boutique mannequin / dress form icon for "Boutique Craftsmanship"
 */
const MannequinIcon: React.FC<{ className?: string }> = ({
  className = 'w-12 h-12 text-[#e5195e]',
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 56 56"
    fill="none"
    className={className}
  >
    {/* Neck finial */}
    <path
      d="M25 6 H31 M28 6 V9.5"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
    {/* Dress form silhouette */}
    <path
      d="M23 9.5 L18 13.5 C19.5 18.5, 22.5 22, 22.5 26.5 C22.5 31, 18.5 36.5, 18.5 41.5 H37.5 C37.5 36.5, 33.5 31, 33.5 26.5 C33.5 22, 36.5 18.5, 38 13.5 L33 9.5 Q28 12.5 23 9.5 Z"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Waistline seam */}
    <path
      d="M22.5 26.5 Q28 28 33.5 26.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    {/* Stand pole & base */}
    <path
      d="M28 41.5 V49.5 M21 49.5 H35"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
  </svg>
);

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
  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex-1 bg-white flex flex-col justify-start overflow-x-clip select-none">
      {/* Shared Website Header */}
      <div className="w-full shrink-0 bg-[#fcf8f3] border-b border-[#f1e9e0]">
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

      {/* Main Our Story Content Wrapper */}
      <div className="w-full max-w-[2560px] mx-auto bg-white flex-1 flex flex-col">
        {/* ===================================================================
            PART A — TOP SECTION: OUR STORY HERO BANNER
            - Replicates reference top section background, cherry blossoms,
              pink wave graphics, typography, and right-side female model.
            - Explicitly omits the small "OUR STORY" eyebrow heading above
              the main headline as requested.
            =================================================================== */}
        <section
          aria-labelledby="our-story-hero-heading"
          className="relative w-full aspect-[1115/446] flex-[446_1_auto] flex flex-col justify-center overflow-hidden bg-[#fdf5f7]"
        >
          {/* Dedicated Our Story Hero Background Asset */}
          <img
            src={getAssetUrl('assets/aistudio/our_story_hero_bg.png')}
            alt="Kashmiri woman wearing traditional floral embroidered shawl and jhumka earrings surrounded by pink blossoms"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-[72%_center] sm:object-center pointer-events-none"
          />

          {/* Left-Side Hero Typography Container (begins directly with Main Headline, no "OUR STORY" eyebrow) */}
          <div className="relative z-10 w-[59%] flex-1 flex flex-col items-center justify-center text-center pl-[5.5%] pr-[2%] pb-[2.5%]">
            <h1
              id="our-story-hero-heading"
              className="font-editorial text-[clamp(15px,3.75vw,76px)] font-normal text-[#121214] leading-[1.12] tracking-[-0.01em]"
            >
              <span className="block whitespace-nowrap">
                From Kashmir&rsquo;s Heritage
              </span>
              <span className="block whitespace-nowrap mt-[0.15vw]">
                <span>to </span>
                <span className="font-script text-[#e5195e] text-[1.34em] leading-none align-baseline">
                  Your Wardrobe
                </span>
              </span>
            </h1>

            <p className="mt-[1.25vw] font-ui text-[clamp(7.5px,1.28vw,25px)] font-medium text-[#1b1a1c] leading-[1.46] tracking-[0.005em]">
              <span className="block whitespace-nowrap">
                A boutique rooted in Kashmir&rsquo;s rich textile legacy,
              </span>
              <span className="block whitespace-nowrap">
                where timeless craftsmanship meets
              </span>
              <span className="block whitespace-nowrap">
                contemporary elegance.
              </span>
            </p>
          </div>
        </section>

        {/* White Horizontal Separator Bar */}
        <div aria-hidden="true" className="w-full h-[clamp(4px,0.75vw,14px)] shrink-0 bg-white" />

        {/* ===================================================================
            PART B — SECTION 1: CRAFTSMANSHIP IMAGE STRIP
            - Three side-by-side visual panels with diagonal white separators:
              1. Hand embroidery
              2. Machine embroidery
              3. Boutique craftsmanship
            =================================================================== */}
        <section
          aria-label="Kashmiri Craftsmanship Visual Strip"
          className="relative w-full aspect-[1115/247] flex-[247_1_auto] bg-white overflow-hidden"
        >
          {/* Panel 1: Hand Embroidery (Left) */}
          <div
            style={{
              clipPath: 'polygon(0% 0%, 35.43% 0%, 27.53% 100%, 0% 100%)',
            }}
            className="absolute inset-y-0 left-0 w-full h-full overflow-hidden"
          >
            <img
              src={getAssetUrl('assets/aistudio/our_story_strip_1_hand.png')}
              alt="Close-up of a master Kashmiri artisan creating floral embroidery by hand"
              referrerPolicy="no-referrer"
              className="absolute inset-y-0 left-0 w-[35.88%] h-full object-cover object-left"
            />
          </div>

          {/* Panel 2: Machine Embroidery (Center) */}
          <div
            style={{
              clipPath: 'polygon(35.96% 0%, 72.29% 0%, 64.39% 100%, 28.07% 100%)',
            }}
            className="absolute inset-y-0 left-0 w-full h-full overflow-hidden"
          >
            <img
              src={getAssetUrl('assets/aistudio/our_story_strip_2_machine.png')}
              alt="Kashmiri artisan operating a precision embroidery machine"
              referrerPolicy="no-referrer"
              className="absolute inset-y-0 left-[27.26%] w-[45.38%] h-full object-cover object-center"
            />
          </div>

          {/* Panel 3: Boutique Craftsmanship (Right) */}
          <div
            style={{
              clipPath: 'polygon(72.83% 0%, 100% 0%, 100% 100%, 64.93% 100%)',
            }}
            className="absolute inset-y-0 left-0 w-full h-full overflow-hidden"
          >
            <img
              src={getAssetUrl('assets/aistudio/our_story_strip_3_boutique.png')}
              alt="Boutique designer arranging a handcrafted Kashmiri embroidered ensemble on a mannequin"
              referrerPolicy="no-referrer"
              className="absolute inset-y-0 left-[64.13%] w-[35.87%] h-full object-cover object-right"
            />
          </div>
        </section>

        {/* White Horizontal Separator Bar */}
        <div aria-hidden="true" className="w-full h-[clamp(3px,0.55vw,11px)] shrink-0 bg-white" />

        {/* ===================================================================
            PART B — SECTION 2: OUR CRAFT
            - Three horizontally aligned columns with pink outline icons,
              editorial serif headings, descriptions, vertical pink dividers,
              and pink wave decorations.
            =================================================================== */}
        <section
          aria-labelledby="our-craft-heading"
          className="relative w-full aspect-[1115/267] flex-[267_1_auto] flex flex-col justify-center overflow-hidden bg-[#fdeef2]"
        >
          {/* Dedicated Our Craft Background with Blush Glow & Bottom Pink Silk Waves */}
          <img
            src={getAssetUrl('assets/aistudio/our_story_craft_bg.png')}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
          />

          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pb-[1.5%] px-[3.5%]">
            {/* Top Centered Heading: — OUR CRAFT — */}
            <div className="flex items-center justify-center gap-[1.8vw] w-full">
              <span
                aria-hidden="true"
                className="h-[1.5px] w-[clamp(28px,7.8vw,150px)] bg-gradient-to-r from-transparent via-[#ec467d] to-[#e5195e]"
              />
              <h2
                id="our-craft-heading"
                className="font-ui text-[clamp(9px,1.62vw,32px)] font-bold uppercase tracking-[0.26em] text-[#e5195e] leading-none whitespace-nowrap"
              >
                OUR CRAFT
              </h2>
              <span
                aria-hidden="true"
                className="h-[1.5px] w-[clamp(28px,7.8vw,150px)] bg-gradient-to-l from-transparent via-[#ec467d] to-[#e5195e]"
              />
            </div>

            {/* Three Horizontally Aligned Craft Columns */}
            <div className="mt-[1.4vw] w-full grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
              {/* Column 1: Handcrafted Details */}
              <div className="flex flex-col items-center text-center px-[1vw]">
                <LotusOutlineIcon
                  className="w-[clamp(24px,6.4vw,126px)] h-[clamp(16px,4.2vw,82px)] text-[#e5195e]"
                  strokeWidth={2.2}
                />
                <h3 className="mt-[0.65vw] font-editorial text-[clamp(9.5px,1.78vw,35px)] font-bold text-[#121214] leading-[1.15] whitespace-nowrap">
                  Handcrafted Details
                </h3>
                <p className="mt-[0.35vw] font-ui text-[clamp(6.5px,1.12vw,22px)] font-medium text-[#1b1a1c] leading-[1.35] whitespace-nowrap">
                  Intricate embroidery by skilled artisans
                </p>
              </div>

              {/* Vertical Pink Divider 1 */}
              <div
                aria-hidden="true"
                className="w-[1.5px] h-[clamp(24px,4.8vw,94px)] bg-gradient-to-b from-transparent via-[#f04f84] to-transparent self-end mb-[0.4vw]"
              />

              {/* Column 2: Authentic Kashmiri Textiles */}
              <div className="flex flex-col items-center text-center px-[1vw]">
                <ThreadSpoolIcon className="w-[clamp(22px,4.4vw,86px)] h-[clamp(22px,4.4vw,86px)] text-[#e5195e]" />
                <h3 className="mt-[0.5vw] font-editorial text-[clamp(9.5px,1.78vw,35px)] font-bold text-[#121214] leading-[1.15] whitespace-nowrap">
                  Authentic Kashmiri Textiles
                </h3>
                <p className="mt-[0.35vw] font-ui text-[clamp(6.5px,1.12vw,22px)] font-medium text-[#1b1a1c] leading-[1.35] whitespace-nowrap">
                  Sozni, Aari and fine weaves
                </p>
              </div>

              {/* Vertical Pink Divider 2 */}
              <div
                aria-hidden="true"
                className="w-[1.5px] h-[clamp(24px,4.8vw,94px)] bg-gradient-to-b from-transparent via-[#f04f84] to-transparent self-end mb-[0.4vw]"
              />

              {/* Column 3: Boutique Craftsmanship */}
              <div className="flex flex-col items-center text-center px-[1vw]">
                <MannequinIcon className="w-[clamp(22px,4.5vw,88px)] h-[clamp(22px,4.5vw,88px)] text-[#e5195e]" />
                <h3 className="mt-[0.5vw] font-editorial text-[clamp(9.5px,1.78vw,35px)] font-bold text-[#121214] leading-[1.15] whitespace-nowrap">
                  Boutique Craftsmanship
                </h3>
                <p className="mt-[0.35vw] font-ui text-[clamp(6.5px,1.12vw,22px)] font-medium text-[#1b1a1c] leading-[1.35] whitespace-nowrap">
                  Thoughtfully designed in-house collections
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            PART B — SECTION 3: OUR BELIEF
            - Left: Boutique designer working on a garment sketch at a design table.
            - Right: "OUR BELIEF" eyebrow + lotus divider, "Tradition for Today's Woman"
              heading, supporting description, and bottom lotus floral divider.
            =================================================================== */}
        <section
          aria-labelledby="our-belief-heading"
          className="relative w-full aspect-[1115/436] flex-[436_1_auto] flex flex-col justify-center overflow-hidden bg-[#fef6f8]"
        >
          {/* Dedicated Our Belief Background Asset (Designer at Table on Left + Pink Waves on Bottom-Right) */}
          <img
            src={getAssetUrl('assets/aistudio/our_story_belief_bg.png')}
            alt="Boutique fashion designer sketching an embroidered Kashmiri garment at a design table"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-[28%_center] sm:object-center pointer-events-none"
          />

          {/* Right-Side Content Container */}
          <div className="relative z-10 ml-[53.5%] w-[44.5%] flex-1 flex flex-col items-center justify-center text-center pr-[2%] pb-[1%]">
            {/* Eyebrow: — OUR BELIEF — */}
            <div className="flex items-center justify-center gap-[1.3vw] w-full">
              <span
                aria-hidden="true"
                className="h-[1.5px] w-[clamp(18px,4.8vw,94px)] bg-gradient-to-r from-transparent via-[#ec467d] to-[#e5195e]"
              />
              <p className="font-ui text-[clamp(8.5px,1.45vw,28px)] font-bold uppercase tracking-[0.25em] text-[#e5195e] leading-none whitespace-nowrap">
                OUR BELIEF
              </p>
              <span
                aria-hidden="true"
                className="h-[1.5px] w-[clamp(18px,4.8vw,94px)] bg-gradient-to-l from-transparent via-[#ec467d] to-[#e5195e]"
              />
            </div>

            {/* Small Lotus Floral Divider under Eyebrow */}
            <div
              aria-hidden="true"
              className="mt-[0.55vw] flex items-center justify-center gap-[0.7vw]"
            >
              <span className="h-[1.2px] w-[clamp(14px,3.6vw,70px)] bg-gradient-to-r from-transparent to-[#e5195e]/75" />
              <LotusOutlineIcon
                className="w-[clamp(14px,2.5vw,48px)] h-[clamp(10px,1.7vw,32px)] text-[#e5195e]"
                strokeWidth={2.2}
              />
              <span className="h-[1.2px] w-[clamp(14px,3.6vw,70px)] bg-gradient-to-l from-transparent to-[#e5195e]/75" />
            </div>

            {/* Main Heading: "Tradition for" + "Today's Woman" */}
            <h2
              id="our-belief-heading"
              className="mt-[0.8vw] font-editorial text-[clamp(16px,3.8vw,74px)] font-normal text-[#121214] leading-[1.08] tracking-[-0.01em]"
            >
              <span className="block whitespace-nowrap">Tradition for</span>
              <span className="block font-script text-[#e5195e] text-[1.32em] leading-[1.04] whitespace-nowrap mt-[0.1vw]">
                Today&rsquo;s Woman
              </span>
            </h2>

            {/* Supporting Description */}
            <p className="mt-[1.1vw] font-ui text-[clamp(7.5px,1.32vw,26px)] font-medium text-[#1b1a1c] leading-[1.46] tracking-[0.005em]">
              <span className="block whitespace-nowrap">
                To preserve Kashmir&rsquo;s artistry while
              </span>
              <span className="block whitespace-nowrap">
                creating elegant, wearable designs
              </span>
              <span className="block whitespace-nowrap">
                for the modern woman.
              </span>
            </p>

            {/* Bottom Lotus Floral Divider */}
            <div
              aria-hidden="true"
              className="mt-[1.6vw] flex items-center justify-center gap-[0.9vw]"
            >
              <span className="h-[1.3px] w-[clamp(24px,6.8vw,132px)] bg-gradient-to-r from-transparent to-[#e5195e]/80" />
              <LotusOutlineIcon
                className="w-[clamp(16px,2.9vw,56px)] h-[clamp(11px,1.95vw,38px)] text-[#e5195e]"
                strokeWidth={2.2}
              />
              <span className="h-[1.3px] w-[clamp(24px,6.8vw,132px)] bg-gradient-to-l from-transparent to-[#e5195e]/80" />
            </div>
          </div>
        </section>
      </div>

      {/* Shared Website Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
