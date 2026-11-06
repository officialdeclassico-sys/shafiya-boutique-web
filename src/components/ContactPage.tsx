import React, { useState } from 'react';
import {
  MessageSquareText,
  Heart,
  Gem,
  Headset,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronDown,
  ChevronRight,
  Truck,
  Sparkles,
  RotateCcw,
  ShoppingBag,
  Scissors,
  Users,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header, NavItemKey } from './Header';
import { Footer } from './Footer';
import { BagItem } from '../data/heroSlides';
import { getAssetUrl } from '../utils/assetPath';

interface ContactPageProps {
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
  initialEnquiryType?: string;
}

const ENQUIRY_TYPES = [
  'General Enquiry',
  'Order Enquiry',
  'Product Information',
  'Custom Design Enquiry',
  'Shipping and Delivery',
  'Returns and Exchanges',
  'Other',
];

interface FaqItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'orders-shipping',
    title: 'Orders & Shipping',
    icon: <Truck className="w-[18px] h-[18px] stroke-[1.8]" />,
    question: 'How are orders packaged and dispatched from your atelier?',
    answer:
      'All handcrafted Shafiya orders are carefully prepared at our Srinagar flagship atelier (Boulevard Road, Dal Lake). For specific dispatch schedules, destination coverage, or tracking assistance on an existing order, please select "Shipping and Delivery" in our Customer Enquiry Form above or contact atelier@shafiyakashmir.com.',
  },
  {
    id: 'product-care',
    title: 'Product Care',
    icon: <Sparkles className="w-[18px] h-[18px] stroke-[1.8]" />,
    question: 'How should I care for hand-embroidered Pashmina and silk pieces?',
    answer:
      'Handcrafted Kashmiri Pashmina shawls, Sozni stoles, and Aari-embroidered silk ensembles should be specialist dry-cleaned only. Store folded in breathable muslin away from direct sunlight and moisture, and avoid spraying perfume directly onto delicate Zari or silk threadwork.',
  },
  {
    id: 'returns-exchanges',
    title: 'Returns & Exchanges',
    icon: <RotateCcw className="w-[18px] h-[18px] stroke-[1.8]" />,
    question: 'How do I request a return or exchange?',
    answer:
      'If you need assistance with a return, size exchange, or order adjustment, please reach out to our support team using the Customer Enquiry Form with "Returns and Exchanges" selected, or email atelier@shafiyakashmir.com with your order details so our team can guide you through the applicable policy for your piece.',
  },
  {
    id: 'availability-stock',
    title: 'Availability & Stock',
    icon: <ShoppingBag className="w-[18px] h-[18px] stroke-[1.8]" />,
    question: 'Can I enquire about a piece that is crafted in small batches?',
    answer:
      'Because our shawls, suits, and pherans are hand-embroidered by master Kashmiri artisans, many designs are produced in limited artisanal runs. Contact our team with the design name to verify current availability at our Srinagar atelier or enquire about a made-to-order commission.',
  },
  {
    id: 'custom-design-process',
    title: 'Custom Design Process',
    icon: <Scissors className="w-[18px] h-[18px] stroke-[1.8]" />,
    question: 'How does commissioning a bespoke Kashmiri outfit or bridal shawl work?',
    answer:
      'Select "Custom Design Enquiry" in the form above and share your preferred silhouette, colour palette, and embroidery style (such as floral Aari, Sozni, or Tilla work). Our design specialists will respond to discuss fabric options, motif placement, and bespoke measurements.',
  },
  {
    id: 'wholesale-enquiries',
    title: 'Wholesale Enquiries',
    icon: <Users className="w-[18px] h-[18px] stroke-[1.8]" />,
    question: 'Do you partner with boutiques, stylists, or curated exhibitions?',
    answer:
      'For boutique curation, stylist pulls, or wholesale partnership discussions, please reach out directly via our Customer Enquiry Form or email atelier@shafiyakashmir.com with details about your showcase or organisation.',
  },
];

/**
 * Boutique Mannequin / Dress-Form outline icon matching Reference Image 2's 3rd hero feature item
 */
const HeroMannequinIcon: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6 text-[#f41f60]',
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 36 36"
    fill="none"
    className={className}
  >
    <path
      d="M15.5 4.5 H20.5 M18 4.5 V7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14.5 7 L11 10 C12 13.5, 14 16, 14 19 C14 22.2, 11.2 26, 11.2 29.5 H24.8 C24.8 26, 22 22.2, 22 19 C22 16, 24 13.5, 25 10 L21.5 7 Q18 9.2 14.5 7 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.2 19 Q18 20.2 21.8 19 M14 33 H22 M18 29.5 V33"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

export const ContactPage: React.FC<ContactPageProps> = ({
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
  initialEnquiryType = '',
}) => {
  // Customer Enquiry Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiryType, setEnquiryType] = useState(initialEnquiryType);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    email: string;
    enquiryType: string;
  } | null>(null);

  // Interactive Map state
  const [mapZoom, setMapZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showPinDetails, setShowPinDetails] = useState(true);

  // Interactive Quick Answers FAQ state
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (!email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (phone.trim()) {
      const cleaned = phone.replace(/[\s()-]/g, '');
      if (!/^\+?[0-9]{7,15}$/.test(cleaned)) {
        nextErrors.phone = 'Please enter a valid phone number (7–15 digits).';
      }
    }
    if (!message.trim()) {
      nextErrors.message = 'Please enter your message.';
    } else if (message.trim().length < 10) {
      nextErrors.message =
        'Please provide a few more details (at least 10 characters).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({
        fullName: fullName.trim(),
        email: email.trim(),
        enquiryType: enquiryType || 'General Enquiry',
      });
    }, 250);
  };

  const handleResetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setEnquiryType('');
    setMessage('');
    setErrors({});
    setSubmittedData(null);
  };

  const handleZoomIn = () => {
    setMapZoom((z) => Math.min(2.2, Number((z + 0.3).toFixed(2))));
  };

  const handleZoomOut = () => {
    setMapZoom((z) => {
      const next = Math.max(1, Number((z - 0.3).toFixed(2)));
      if (next === 1) setMapOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMapPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    setIsDraggingMap(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
  };

  const handleMapPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingMap) return;
    const maxPan = 90 * mapZoom;
    const nx = Math.max(-maxPan, Math.min(maxPan, e.clientX - dragStart.x));
    const ny = Math.max(-maxPan, Math.min(maxPan, e.clientY - dragStart.y));
    setMapOffset({ x: nx, y: ny });
  };

  const handleMapPointerUp = () => {
    setIsDraggingMap(false);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full min-h-screen min-h-[100dvh] flex-1 bg-gradient-to-b from-[#fff9fb] via-[#fdf0f5] to-[#fcebf2] flex flex-col justify-between overflow-x-clip select-none">
      {/* Shared Website Header */}
      <div className="w-full bg-[#fcf8f3] border-b border-[#f1e9e0]">
        <Header
          activePage="Contact"
          onNavigate={onNavigate}
          onOpenSignIn={onOpenSignIn}
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
          1. HERO BANNER — EXACT REPLICATION OF REFERENCE IMAGE 2
             (Elegant_Kashmiri_Contact_Hero__1__c220c811.png)
          ===================================================================== */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative w-full bg-[#fffaf8] border-b border-[#f7dce6] overflow-hidden"
      >
        <div className="relative w-full aspect-[2095/638] max-w-[2560px] mx-auto overflow-hidden">
          {/* Reference Image 2 Clean Background Canvas:
              - Kashmiri female fashion model on the right
              - Dal Lake scenery, snow-capped mountains & traditional houseboats
              - Pink cherry blossom branches & soft pink brushstroke accents
              - Left-edge botanical floral line art */}
          <img
            src={getAssetUrl('assets/aistudio/contact_hero_ref2_bg.png')}
            alt="Kashmiri woman wearing traditional floral embroidered outfit beside Dal Lake houseboats, snow-capped Himalayan mountains, and pink cherry blossoms"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Left Editorial Hero Content Block */}
          <div className="relative z-20 h-full flex flex-col justify-center pl-[7.4%] pr-[2%] py-[2%] w-[56%] sm:w-[50%] pointer-events-auto">
            {/* 1. Eyebrow + Tapered Pink Line */}
            <div className="flex items-center gap-[0.9vw]">
              <p className="font-ui text-[clamp(7px,0.86vw,18px)] font-bold uppercase tracking-[0.22em] text-[#ee1d5e] leading-none whitespace-nowrap">
                GET IN TOUCH
              </p>
              <span
                aria-hidden="true"
                className="h-[1.5px] w-[clamp(18px,3.1vw,64px)] bg-gradient-to-r from-[#ee1d5e] to-transparent"
              />
            </div>

            {/* 2. Headline: "Let's Create" / "Something Beautiful" with Animated Pink Script */}
            <h1
              id="contact-hero-heading"
              className="mt-[0.75vw] font-editorial text-[clamp(16px,4.25vw,88px)] font-normal text-[#121621] leading-[1.03] tracking-[-0.015em]"
            >
              <span className="block whitespace-nowrap">
                Let&rsquo;s Create
              </span>
              <span className="relative block w-fit whitespace-nowrap">
                <span>Something </span>
                <motion.span
                  key="script-beautiful"
                  initial={{ opacity: 0, x: -6, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.48,
                    delay: 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block font-script text-[#ee1d5e] text-[1.24em] leading-[0.88] ml-[0.06em] align-baseline select-none"
                >
                  Beautiful
                </motion.span>
              </span>
            </h1>

            {/* 3. Supporting Description */}
            <p className="mt-[0.95vw] font-ui text-[clamp(7px,1.08vw,22px)] font-normal text-[#18191e] leading-[1.48] tracking-[0.004em]">
              <span className="block whitespace-nowrap">
                Have a question, a custom design idea, or simply want to
              </span>
              <span className="block whitespace-nowrap">
                know more about our collections? We&rsquo;re here to help.
              </span>
            </p>

            {/* 4. Three Feature Items with Vertical Pink Dividers (Desktop & Tablet sm:grid, compact on mobile) */}
            <div className="hidden sm:grid mt-[1.7vw] grid-cols-[auto_1px_auto_1px_auto] items-start gap-x-[1.5vw] w-fit">
              {/* Item 1: Quick Response */}
              <div className="flex flex-col items-start">
                <MessageSquareText className="w-[clamp(14px,1.85vw,38px)] h-[clamp(14px,1.85vw,38px)] text-[#ee1d5e] stroke-[1.9]" />
                <h2 className="mt-[0.45vw] font-ui text-[clamp(8.5px,0.88vw,18px)] font-bold text-[#121621] leading-snug whitespace-nowrap">
                  Quick Response
                </h2>
                <p className="mt-[0.15vw] font-ui text-[clamp(7.5px,0.72vw,14.5px)] text-[#2a2c34] leading-snug whitespace-nowrap">
                  We reply at the earliest
                </p>
              </div>

              {/* Divider 1 */}
              <div
                aria-hidden="true"
                className="w-[1px] h-[clamp(32px,4.4vw,90px)] bg-gradient-to-b from-transparent via-[#f386a9]/75 to-transparent self-center"
              />

              {/* Item 2: Personalised Support */}
              <div className="flex flex-col items-start">
                <Heart className="w-[clamp(14px,1.85vw,38px)] h-[clamp(14px,1.85vw,38px)] text-[#ee1d5e] stroke-[1.9]" />
                <h2 className="mt-[0.45vw] font-ui text-[clamp(8.5px,0.88vw,18px)] font-bold text-[#121621] leading-snug whitespace-nowrap">
                  Personalised Support
                </h2>
                <p className="mt-[0.15vw] font-ui text-[clamp(7.5px,0.72vw,14.5px)] text-[#2a2c34] leading-snug whitespace-nowrap">
                  Guidance for your unique requirements
                </p>
              </div>

              {/* Divider 2 */}
              <div
                aria-hidden="true"
                className="w-[1px] h-[clamp(32px,4.4vw,90px)] bg-gradient-to-b from-transparent via-[#f386a9]/75 to-transparent self-center"
              />

              {/* Item 3: Custom Design Enquiry */}
              <div className="flex flex-col items-start">
                <HeroMannequinIcon className="w-[clamp(14px,1.85vw,38px)] h-[clamp(14px,1.85vw,38px)] text-[#ee1d5e]" />
                <h2 className="mt-[0.45vw] font-ui text-[clamp(8.5px,0.88vw,18px)] font-bold text-[#121621] leading-snug whitespace-nowrap">
                  Custom Design Enquiry
                </h2>
                <p className="mt-[0.15vw] font-ui text-[clamp(7.5px,0.72vw,14.5px)] text-[#2a2c34] leading-snug whitespace-nowrap">
                  Let&rsquo;s bring your vision to life
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Only (<640px) Clean 3-Column Feature Row Beneath Hero Image so text is never cramped */}
        <div className="sm:hidden grid grid-cols-3 divide-x divide-[#f5cbd9] bg-[#fff7fa] border-t border-[#f7dce6] px-2 py-2.5">
          <div className="flex flex-col items-center text-center px-1.5">
            <MessageSquareText className="w-4 h-4 text-[#ee1d5e] stroke-[1.9]" />
            <h2 className="mt-1 font-ui text-[10.5px] font-bold text-[#121621] leading-tight">
              Quick Response
            </h2>
            <p className="mt-0.5 font-ui text-[9.5px] text-[#4a4d57] leading-tight">
              We reply at the earliest
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-1.5">
            <Heart className="w-4 h-4 text-[#ee1d5e] stroke-[1.9]" />
            <h2 className="mt-1 font-ui text-[10.5px] font-bold text-[#121621] leading-tight">
              Personalised Support
            </h2>
            <p className="mt-0.5 font-ui text-[9.5px] text-[#4a4d57] leading-tight">
              Guidance for your requirements
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-1.5">
            <HeroMannequinIcon className="w-4 h-4 text-[#ee1d5e]" />
            <h2 className="mt-1 font-ui text-[10.5px] font-bold text-[#121621] leading-tight">
              Custom Design Enquiry
            </h2>
            <p className="mt-0.5 font-ui text-[9.5px] text-[#4a4d57] leading-tight">
              Let&rsquo;s bring your vision to life
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. MAIN CONTACT CONTENT — EXACT REPLICATION OF REFERENCE IMAGE 1
             (Elegant_Pink_Contact___Collaboration_Page_b229e071.png)
          ===================================================================== */}
      <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-6 sm:py-8 lg:py-10 space-y-6 lg:space-y-7">
        {/* ===================================================================
            TOP ROW — TWO EQUALLY ALIGNED CARDS
            - Left: Reach Us Directly (Mobile #2)
            - Right: Customer Enquiry Form (Mobile #3)
            =================================================================== */}
        <section
          id="contact-enquiry"
          aria-label="Contact Information and Customer Enquiry Form"
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-7 items-stretch">
            {/* LEFT CARD — REACH US DIRECTLY */}
            <div className="h-full flex flex-col justify-between relative rounded-[24px] bg-gradient-to-br from-[#fdebf0] via-[#fce6ee] to-[#fbe1eb] border border-[#f7cedc] p-6 sm:p-7 xl:p-8 overflow-hidden shadow-[0_8px_28px_rgba(238,29,94,0.05)]">
              {/* Decorative Pink Floral Corner Illustration in Bottom-Right */}
              <img
                src={getAssetUrl('assets/aistudio/contact_reach_flower.png')}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute right-1 bottom-0 w-32 sm:w-40 lg:w-44 h-auto object-contain pointer-events-none select-none opacity-95"
              />

              <div className="relative z-10">
                <p className="font-ui text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#ee1d5e] mb-1">
                  CONTACT INFORMATION
                </p>
                <h2 className="font-editorial text-3xl sm:text-[38px] font-normal text-[#121829] leading-[1.08]">
                  Reach Us Directly
                </h2>
                <p className="font-ui text-xs sm:text-[13.5px] text-[#282b36] leading-relaxed mt-1.5">
                  Have a question or a special request? Feel free to reach out
                  through any of the following channels.
                </p>

                {/* Three Contact Channels */}
                <div className="mt-6 space-y-4 sm:space-y-5 pr-12 sm:pr-24">
                  {/* 1. Email Us */}
                  <a
                    href="mailto:atelier@shafiyakashmir.com"
                    className="group flex items-center gap-3.5 sm:gap-4 rounded-2xl p-1 -ml-1 hover:bg-white/45 transition-colors"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#ee1d5e] border border-[#fad5e1] flex items-center justify-center shadow-[0_4px_12px_rgba(238,29,94,0.1)] shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5 stroke-[1.9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-ui text-sm sm:text-[15.5px] font-bold text-[#121829] group-hover:text-[#ee1d5e] transition-colors">
                        Email Us
                      </h3>
                      <p className="font-ui text-xs sm:text-[13px] text-[#5e626e] mt-0.5 leading-snug">
                        <span>For general enquiries, orders and support </span>
                        <span className="font-bold text-[#121829] sm:ml-1 break-all sm:break-normal">
                          atelier@shafiyakashmir.com
                        </span>
                      </p>
                    </div>
                  </a>

                  {/* 2. Call / WhatsApp */}
                  <a
                    href="tel:+911942458910"
                    className="group flex items-center gap-3.5 sm:gap-4 rounded-2xl p-1 -ml-1 hover:bg-white/45 transition-colors"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#ee1d5e] border border-[#fad5e1] flex items-center justify-center shadow-[0_4px_12px_rgba(238,29,94,0.1)] shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5 stroke-[1.9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-ui text-sm sm:text-[15.5px] font-bold text-[#121829] group-hover:text-[#ee1d5e] transition-colors">
                        Call / WhatsApp
                      </h3>
                      <p className="font-ui text-xs sm:text-[13px] text-[#5e626e] mt-0.5 leading-snug">
                        <span>For quick assistance </span>
                        <span className="font-bold text-[#121829] sm:ml-1 tabular-nums whitespace-nowrap">
                          +91 (194) 245-8910
                        </span>
                      </p>
                    </div>
                  </a>

                  {/* 3. Our Location */}
                  <div className="flex items-center gap-3.5 sm:gap-4 p-1 -ml-1">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#ee1d5e] border border-[#fad5e1] flex items-center justify-center shadow-[0_4px_12px_rgba(238,29,94,0.1)] shrink-0">
                      <MapPin className="w-5 h-5 stroke-[1.9]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-ui text-sm sm:text-[15.5px] font-bold text-[#121829]">
                        Our Location
                      </h3>
                      <p className="font-ui text-xs sm:text-[13px] text-[#5e626e] mt-0.5 leading-snug">
                        <span>We operate from India </span>
                        <span className="font-bold text-[#121829] sm:ml-1">
                          Boulevard Road, Dal Lake, Srinagar, Kashmir 190001
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CARD — CUSTOMER ENQUIRY FORM */}
            <div className="h-full flex flex-col justify-between relative rounded-[24px] bg-[#fffcfd] border border-[#f6d2df] p-6 sm:p-7 xl:p-8 shadow-[0_8px_28px_rgba(238,29,94,0.05)] overflow-hidden">
              {/* Top-Right Decorative Pink Floral Illustration */}
              <img
                src={getAssetUrl('assets/aistudio/contact_form_flower.png')}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute top-0 right-0 w-28 sm:w-32 lg:w-36 h-auto object-contain pointer-events-none select-none"
              />

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-ui text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#ee1d5e] mb-1">
                    SEND US A MESSAGE
                  </p>
                  <h2 className="font-editorial text-3xl sm:text-[38px] font-normal text-[#121829] leading-[1.08]">
                    Customer Enquiry Form
                  </h2>
                  <p className="font-ui text-xs sm:text-[13.5px] text-[#282b36] mt-1">
                    Fill in your details and we&apos;ll get back to you as soon
                    as possible.
                  </p>
                </div>

                {submittedData ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-5 rounded-2xl bg-[#fdecef]/75 border border-[#f9ced8] p-5 text-center space-y-2.5 my-auto"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#ee1d5e] text-white flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-editorial text-2xl font-bold text-[#121829]">
                      Enquiry Recorded, {submittedData.fullName}
                    </h3>
                    <p className="font-ui text-xs sm:text-sm text-[#373a47] leading-relaxed max-w-md mx-auto">
                      Thank you for reaching out regarding{' '}
                      <span className="font-semibold text-[#ee1d5e]">
                        {submittedData.enquiryType}
                      </span>
                      . Your message details for{' '}
                      <span className="font-medium">{submittedData.email}</span>{' '}
                      have been saved in this session. For immediate dispatch or
                      atelier correspondence, you can also email{' '}
                      <a
                        href="mailto:atelier@shafiyakashmir.com"
                        className="underline font-medium text-[#ee1d5e]"
                      >
                        atelier@shafiyakashmir.com
                      </a>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="mt-1 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#ee1d5e] hover:bg-[#d81450] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFormSubmit}
                    noValidate
                    className="mt-4 space-y-3"
                  >
                    {/* Row 1: Full Name + Email Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="enquiry-full-name"
                          className="block font-ui text-xs font-bold text-[#141824] mb-1"
                        >
                          Full Name <span className="text-[#ee1d5e]">*</span>
                        </label>
                        <input
                          id="enquiry-full-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) {
                              setErrors((prev) => ({ ...prev, fullName: '' }));
                            }
                          }}
                          placeholder="Your name"
                          aria-invalid={Boolean(errors.fullName)}
                          className={`w-full h-10 rounded-xl bg-[#f9f7f8] border px-3.5 text-base sm:text-[13px] text-[#141824] placeholder-[#8f8a8e] focus:outline-none focus:bg-white transition-colors ${
                            errors.fullName
                              ? 'border-[#e11d48] focus:border-[#e11d48]'
                              : 'border-[#e5dfe2] focus:border-[#ee1d5e]'
                          }`}
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-[11px] text-[#e11d48] flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.fullName}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="enquiry-email"
                          className="block font-ui text-xs font-bold text-[#141824] mb-1"
                        >
                          Email Address <span className="text-[#ee1d5e]">*</span>
                        </label>
                        <input
                          id="enquiry-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                              setErrors((prev) => ({ ...prev, email: '' }));
                            }
                          }}
                          placeholder="your@email.com"
                          aria-invalid={Boolean(errors.email)}
                          className={`w-full h-10 rounded-xl bg-[#f9f7f8] border px-3.5 text-base sm:text-[13px] text-[#141824] placeholder-[#8f8a8e] focus:outline-none focus:bg-white transition-colors ${
                            errors.email
                              ? 'border-[#e11d48] focus:border-[#e11d48]'
                              : 'border-[#e5dfe2] focus:border-[#ee1d5e]'
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-[11px] text-[#e11d48] flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Phone Number + Enquiry Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="enquiry-phone"
                          className="block font-ui text-xs font-bold text-[#141824] mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          id="enquiry-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) {
                              setErrors((prev) => ({ ...prev, phone: '' }));
                            }
                          }}
                          placeholder="+91 98765 43210"
                          aria-invalid={Boolean(errors.phone)}
                          className={`w-full h-10 rounded-xl bg-[#f9f7f8] border px-3.5 text-base sm:text-[13px] text-[#141824] placeholder-[#8f8a8e] focus:outline-none focus:bg-white transition-colors ${
                            errors.phone
                              ? 'border-[#e11d48] focus:border-[#e11d48]'
                              : 'border-[#e5dfe2] focus:border-[#ee1d5e]'
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-[11px] text-[#e11d48] flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="enquiry-type"
                          className="block font-ui text-xs font-bold text-[#141824] mb-1"
                        >
                          Enquiry Type
                        </label>
                        <div className="relative">
                          <select
                            id="enquiry-type"
                            value={enquiryType}
                            onChange={(e) => setEnquiryType(e.target.value)}
                            className="w-full h-10 appearance-none rounded-xl bg-[#f9f7f8] border border-[#e5dfe2] pl-3.5 pr-9 text-base sm:text-[13px] text-[#141824] focus:outline-none focus:bg-white focus:border-[#ee1d5e] transition-colors cursor-pointer"
                          >
                            <option value="">Select an option</option>
                            {ENQUIRY_TYPES.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            aria-hidden="true"
                            className="w-4 h-4 text-[#262936] stroke-[2] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Your Message */}
                    <div>
                      <label
                        htmlFor="enquiry-message"
                        className="block font-ui text-xs font-bold text-[#141824] mb-1"
                      >
                        Your Message <span className="text-[#ee1d5e]">*</span>
                      </label>
                      <textarea
                        id="enquiry-message"
                        required
                        rows={2}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) {
                            setErrors((prev) => ({ ...prev, message: '' }));
                          }
                        }}
                        placeholder="Tell us about your enquiry, custom design idea, product question or any other details..."
                        aria-invalid={Boolean(errors.message)}
                        className={`w-full rounded-xl bg-[#f9f7f8] border p-3 text-base sm:text-[13px] text-[#141824] placeholder-[#8f8a8e] focus:outline-none focus:bg-white transition-colors resize-y ${
                          errors.message
                            ? 'border-[#e11d48] focus:border-[#e11d48]'
                            : 'border-[#e5dfe2] focus:border-[#ee1d5e]'
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1 text-[11px] text-[#e11d48] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Send Message Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-full bg-gradient-to-r from-[#f50d56] to-[#ec1358] hover:from-[#de094c] hover:to-[#d40d4d] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(238,29,94,0.28)] transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4 stroke-[2]" />
                      <span>
                        {isSubmitting ? 'Sending Message...' : 'Send Message'}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            MIDDLE SECTION — SIGNATURE PINK FEATURE STRIP (Mobile #4)
            - Preserves Custom Design Support, Quick Assistance, Trusted & Secure
            - Flowing silk-like pink and white wave effects & original bright-pink colour
            =================================================================== */}
        <section
          aria-label="Boutique Support Highlights"
          className="relative w-full rounded-[20px] sm:rounded-[22px] overflow-hidden bg-[#eb1d64] shadow-[0_10px_28px_rgba(235,29,100,0.22)]"
        >
          {/* Flowing Silk-Like Pink & White Wave Artwork from Reference Image 1 */}
          <img
            src={getAssetUrl('assets/aistudio/contact_pink_strip_bg.png')}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />

          <div className="relative z-10 max-w-5xl mx-auto px-5 py-4 sm:py-4.5 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-y-3.5 sm:gap-y-0">
            {/* Feature 1: Custom Design Support */}
            <div className="flex items-center sm:justify-center gap-3.5 px-2 sm:px-4">
              <Gem className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[1.8] shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]" />
              <div>
                <h3 className="font-ui text-sm sm:text-[15.5px] font-bold text-white leading-tight">
                  Custom Design Support
                </h3>
                <p className="font-ui text-xs sm:text-[12.5px] text-white/95 leading-snug mt-0.5">
                  Bring your unique vision to life
                </p>
              </div>
            </div>

            {/* Vertical White Divider 1 */}
            <div
              aria-hidden="true"
              className="hidden sm:block w-[1px] h-9 bg-white/55"
            />

            {/* Feature 2: Quick Assistance */}
            <div className="flex items-center sm:justify-center gap-3.5 px-2 sm:px-4 border-t border-white/20 pt-3 sm:border-t-0 sm:pt-0">
              <Headset className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[1.8] shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]" />
              <div>
                <h3 className="font-ui text-sm sm:text-[15.5px] font-bold text-white leading-tight">
                  Quick Assistance
                </h3>
                <p className="font-ui text-xs sm:text-[12.5px] text-white/95 leading-snug mt-0.5">
                  We&rsquo;re here to help you promptly
                </p>
              </div>
            </div>

            {/* Vertical White Divider 2 */}
            <div
              aria-hidden="true"
              className="hidden sm:block w-[1px] h-9 bg-white/55"
            />

            {/* Feature 3: Trusted & Secure */}
            <div className="flex items-center sm:justify-center gap-3.5 px-2 sm:px-4 border-t border-white/20 pt-3 sm:border-t-0 sm:pt-0">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[1.8] shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]" />
              <div>
                <h3 className="font-ui text-sm sm:text-[15.5px] font-bold text-white leading-tight">
                  Trusted &amp; Secure
                </h3>
                <p className="font-ui text-xs sm:text-[12.5px] text-white/95 leading-snug mt-0.5">
                  Your enquiries are always safe
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            BOTTOM ROW — DESKTOP SIDE-BY-SIDE & MOBILE VERTICAL ORDER
            - Desktop: LEFT = Quick Answers / FAQ, RIGHT = Interactive Location Map
            - Mobile: #5 = Quick Answers / FAQ, #6 = Interactive Location Map (ALWAYS LAST)
            =================================================================== */}
        <section
          aria-label="Quick Answers FAQ and Our Location Map"
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-7 items-stretch">
            {/* LEFT (Desktop) / #5 (Mobile): QUICK ANSWERS / FREQUENT TOPICS CARD */}
            <div
              className={`${
                mapExpanded ? 'lg:col-span-2' : ''
              } h-full rounded-[24px] bg-[#fff9fb] border border-[#f6d2df] p-6 sm:p-7 xl:p-8 shadow-[0_8px_28px_rgba(238,29,94,0.05)] relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Top-Right Decorative Botanical Leaf Line Art */}
              <img
                src={getAssetUrl('assets/aistudio/contact_faq_leaf.png')}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="hidden sm:block absolute top-1 right-2 w-24 lg:w-28 h-auto object-contain pointer-events-none select-none"
              />

              <div className="relative z-10 pr-0 sm:pr-24">
                <p className="font-ui text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#ee1d5e] mb-1">
                  FREQUENT TOPICS
                </p>
                <h2 className="font-editorial text-3xl sm:text-[38px] font-normal text-[#121829] leading-[1.08]">
                  Quick Answers
                </h2>
                <p className="font-ui text-xs sm:text-[13.5px] text-[#282b36] mt-1">
                  Looking for something specific? Here are a few common topics
                  our customers ask about.
                </p>
              </div>

              {/* Six Clickable FAQ Items in 2-Column Grid */}
              <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FAQ_ITEMS.map((item) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition-all duration-200 ${
                        isOpen
                          ? 'bg-white border-[#ee1d5e] shadow-md'
                          : 'bg-[#fffdfd] border-[#f9d2df] hover:border-[#ee1d5e]/60 shadow-[0_2px_10px_rgba(238,29,94,0.03)]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(item.id)}
                        aria-expanded={isOpen}
                        className="w-full px-4 py-3 flex items-center justify-between gap-2.5 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-[#ee1d5e] shrink-0">
                            {item.icon}
                          </span>
                          <span className="font-ui text-xs sm:text-[13.5px] font-bold text-[#141824] truncate">
                            {item.title}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-[#ee1d5e] stroke-[2.2] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key={`faq-panel-${item.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-3.5 pt-1 border-t border-[#fce8ee] space-y-1">
                              <p className="font-ui text-xs font-semibold text-[#141824]">
                                {item.question}
                              </p>
                              <p className="font-ui text-xs text-[#4a4f5c] leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT (Desktop) / #6 ALWAYS LAST (Mobile): INTERACTIVE LOCATION MAP CARD */}
            <div
              className={`${
                mapExpanded ? 'lg:col-span-2' : ''
              } h-full rounded-[24px] bg-[#fff9fb] border border-[#f6d2df] p-2.5 sm:p-3 shadow-[0_8px_28px_rgba(238,29,94,0.05)] flex flex-col transition-all duration-300`}
            >
              <div
                onPointerDown={handleMapPointerDown}
                onPointerMove={handleMapPointerMove}
                onPointerUp={handleMapPointerUp}
                onPointerLeave={handleMapPointerUp}
                className={`relative w-full flex-1 ${
                  mapExpanded
                    ? 'min-h-[420px]'
                    : 'min-h-[260px] sm:min-h-[290px]'
                } rounded-[18px] overflow-hidden border border-[#e3ece9] bg-[#c5f0ec] select-none ${
                  isDraggingMap ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >
                {/* Interactive Zoomable & Pannable Map Layer */}
                <div
                  style={{
                    transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapZoom})`,
                    transformOrigin: 'center center',
                  }}
                  className="w-full h-full transition-transform duration-150 ease-out relative"
                >
                  <img
                    src={getAssetUrl('assets/aistudio/contact_map_canvas.png')}
                    alt="Interactive Map showing Shafiya Kashmiri Designs operating from India"
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                  />

                  {/* Interactive Pin Button on Map */}
                  <button
                    type="button"
                    onClick={() => setShowPinDetails((prev) => !prev)}
                    aria-label="Toggle verified business location details"
                    className="absolute left-[49%] top-[39%] -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none cursor-pointer"
                  >
                    <span className="sr-only">
                      Shafiya Flagship Atelier — India
                    </span>
                    <span className="block w-8 h-8 rounded-full bg-[#ee1d5e]/20 animate-ping" />
                  </button>
                </div>

                {/* Verified Location Badge & Open Directions Link (Bottom-Left) */}
                {showPinDetails && (
                  <div className="absolute left-3.5 bottom-3.5 z-20 max-w-[265px] rounded-2xl bg-white/95 backdrop-blur-xs border border-[#e6efed] px-3.5 py-2.5 shadow-md">
                    <p className="font-ui text-xs font-bold text-[#121829]">
                      Shafiya — Kashmir Designs
                    </p>
                    <p className="font-ui text-[11px] text-[#373b47] leading-snug mt-0.5">
                      Boulevard Road, Dal Lake, Srinagar, Kashmir 190001, India
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Boulevard+Road+Dal+Lake+Srinagar+Kashmir+190001+India"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#ee1d5e] hover:underline"
                    >
                      <span>Open Directions in Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Top-Right Fullscreen/Expand Button */}
                <button
                  type="button"
                  onClick={() => setMapExpanded((prev) => !prev)}
                  aria-label={mapExpanded ? 'Collapse map' : 'Expand map'}
                  className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-xl bg-white/95 hover:bg-white text-[#262936] shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                >
                  {mapExpanded ? (
                    <Minimize2 className="w-4 h-4 stroke-[2]" />
                  ) : (
                    <Maximize2 className="w-4 h-4 stroke-[2]" />
                  )}
                </button>

                {/* Bottom-Right Interactive Zoom + / - Controls */}
                <div className="absolute bottom-3.5 right-3.5 z-20 flex flex-col rounded-xl bg-white/95 shadow-md border border-[#e8eceb] overflow-hidden">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    aria-label="Zoom in on map"
                    className="w-9 h-9 flex items-center justify-center text-[#262936] hover:bg-[#f4f7f6] border-b border-[#e8eceb] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    aria-label="Zoom out on map"
                    className="w-9 h-9 flex items-center justify-center text-[#262936] hover:bg-[#f4f7f6] transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Shared Website Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
