import React, { useState } from 'react';
import {
  MessageSquareText,
  Heart,
  Gem,
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
  isCustomDesigns?: boolean;
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
  isCustomDesigns = false,
}) => {
  const [scriptImgError, setScriptImgError] = useState(false);

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
      nextErrors.message = 'Please provide a few more details (at least 10 characters).';
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
    <div className="min-h-screen w-full bg-[#fcfbf9] flex flex-col justify-between overflow-x-hidden">
      {/* =====================================================================
          1. SECTION A — FULL-VIEWPORT-WIDTH EDITORIAL CONTACT HERO
          ===================================================================== */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative w-full bg-[#fcfbf9] overflow-hidden select-none"
      >
        {/* DESKTOP FULL-WIDTH HERO COMPOSITION (lg and up) — Edge-to-Edge like Homepage Hero */}
        <div className="hidden lg:block relative w-full aspect-[1312/472] bg-[#fcfbf9] overflow-hidden">
          {/* Full-Viewport Background Canvas: Left Botanical Flowers + Right Kashmir Dal Lake, Mountains, Model, Brush Strokes & Handwritten Script */}
          <img
            src={getAssetUrl('assets/aistudio/contact_hero_clean_canvas.png')}
            alt="Kashmir Dal Lake houseboats and snow-capped mountains alongside a fashion model wearing a colourful floral embroidered Kashmiri shawl"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          />

          {/* Shared Desktop Header Integrated Seamlessly into Top Band */}
          <div className="absolute top-0 left-0 right-0 z-30">
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

          {/* Left Editorial Hero Content Block */}
          <div className="absolute left-[6.6%] top-[18.2%] z-20 w-[37.5%] pointer-events-auto">
            {/* Small Pink Uppercase Eyebrow */}
            <p className="font-ui text-[clamp(9.5px,0.78vw,14px)] font-semibold uppercase tracking-[0.26em] text-[#f42a60] leading-snug">
              {isCustomDesigns ? 'BESPOKE COUTURE · CUSTOM DESIGNS' : "WE'D LOVE TO HEAR FROM YOU"}
            </p>

            {/* Large Elegant Serif Headline */}
            <h1
              id="contact-hero-heading"
              className="mt-[0.35vw] font-editorial text-[clamp(42px,4.5vw,84px)] font-normal text-[#121829] leading-[0.98] tracking-[-0.02em]"
            >
              {isCustomDesigns ? 'Custom Designs' : 'Get In Touch'}
            </h1>

            {/* Pink Handwritten Script */}
            <div className="mt-[0.15vw] mb-[0.75vw]">
              {isCustomDesigns ? (
                <p className="font-script text-[clamp(34px,3.4vw,62px)] text-[#f82a62] leading-tight -rotate-2">
                  Your Vision, Our Craft
                </p>
              ) : !scriptImgError ? (
                <div>
                  <span className="sr-only">
                    Let&apos;s Create Something Beautiful
                  </span>
                  <img
                    src={getAssetUrl('assets/aistudio/contact_script_lets_create.png')}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    onError={() => setScriptImgError(true)}
                    className="w-[88%] max-w-[560px] h-auto object-contain -ml-1 select-none pointer-events-none"
                  />
                </div>
              ) : (
                <p className="font-script text-[clamp(34px,3.4vw,62px)] text-[#f82a62] leading-tight -rotate-2">
                  Let&apos;s Create Something Beautiful
                </p>
              )}
            </div>

            {/* Welcoming Description */}
            <p className="font-ui text-[clamp(11.5px,0.96vw,17.5px)] font-normal text-[#262936] leading-[1.58] max-w-[92%]">
              {isCustomDesigns
                ? 'Commission a bespoke Kashmiri outfit or bridal shawl tailored with master Sozni and Aari embroidery to your exact measurements.'
                : "Whether you have a question, a custom design idea, or simply want to know more about our collections, we're here to help."}
            </p>

            {/* Three Feature Highlights Row */}
            <div className="mt-[1.65vw] grid grid-cols-3 gap-[1.2vw] pr-[2%]">
              {/* 1. Quick Response */}
              <div className="space-y-[0.3vw]">
                <div className="text-[#f82a62]">
                  <MessageSquareText className="w-[clamp(18px,1.55vw,28px)] h-[clamp(18px,1.55vw,28px)] stroke-[1.8]" />
                </div>
                <h2 className="font-ui text-[clamp(10.5px,0.82vw,15px)] font-bold text-[#141824] leading-snug">
                  Quick Response
                </h2>
                <p className="font-ui text-[clamp(9.5px,0.72vw,13px)] text-[#686b75] leading-[1.45]">
                  We aim to respond as soon as possible
                </p>
              </div>

              {/* 2. Personalised Support */}
              <div className="space-y-[0.3vw]">
                <div className="text-[#f82a62]">
                  <Heart className="w-[clamp(18px,1.55vw,28px)] h-[clamp(18px,1.55vw,28px)] stroke-[1.8]" />
                </div>
                <h2 className="font-ui text-[clamp(10.5px,0.82vw,15px)] font-bold text-[#141824] leading-snug">
                  Personalised Support
                </h2>
                <p className="font-ui text-[clamp(9.5px,0.72vw,13px)] text-[#686b75] leading-[1.45]">
                  Guidance for your unique requirements
                </p>
              </div>

              {/* 3. Custom Design Enquiries */}
              <div className="space-y-[0.3vw]">
                <div className="text-[#f82a62]">
                  <Gem className="w-[clamp(18px,1.55vw,28px)] h-[clamp(18px,1.55vw,28px)] stroke-[1.8]" />
                </div>
                <h2 className="font-ui text-[clamp(10.5px,0.82vw,15px)] font-bold text-[#141824] leading-snug">
                  Custom Design Enquiries
                </h2>
                <p className="font-ui text-[clamp(9.5px,0.72vw,13px)] text-[#686b75] leading-[1.45]">
                  Let&apos;s bring your vision to life
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TABLET & MOBILE COMPOSITION (< lg) — Horizontal Landscape Banner matching Homepage */}
        <div className="lg:hidden relative w-full bg-[#fcfbf9] overflow-hidden">
          <Header
            activePage={isCustomDesigns ? 'Custom Designs' : 'Contact'}
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

          <div className="relative w-full aspect-[16/6.2] sm:aspect-[16/5.5] md:aspect-[1312/472] max-h-[380px] overflow-hidden bg-[#fcfbf9] select-none">
            <img
              src={getAssetUrl('assets/aistudio/contact_hero_clean_canvas.png')}
              alt="Kashmir Dal Lake houseboats and snow-capped mountains alongside a fashion model wearing a colourful floral embroidered Kashmiri shawl"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            />

            <div className="absolute left-[4.8%] top-[12%] sm:top-[16%] z-20 w-[52%] sm:w-[42%] pointer-events-auto">
              <p className="font-ui text-[clamp(6.5px,1.8vw,11.5px)] font-semibold uppercase tracking-[0.24em] text-[#f42a60] leading-[1.3]">
                {isCustomDesigns ? 'BESPOKE COUTURE' : "WE'D LOVE TO HEAR"}
              </p>
              <div className="relative mt-[0.5vw]">
                <h1 className="font-editorial text-[clamp(18px,4.8vw,42px)] font-normal text-[#121829] leading-[0.96] tracking-[-0.02em]">
                  {isCustomDesigns ? 'Custom Designs' : 'Get In Touch'}
                </h1>
                <div className="mt-[0.2vw]">
                  {isCustomDesigns ? (
                    <span className="font-script text-[#f82a62] text-[clamp(15px,3.8vw,32px)] leading-none block -rotate-2">
                      Your Vision, Our Craft
                    </span>
                  ) : !scriptImgError ? (
                    <img
                      src={getAssetUrl('assets/aistudio/contact_script_lets_create.png')}
                      alt="Let's Create Something Beautiful"
                      referrerPolicy="no-referrer"
                      onError={() => setScriptImgError(true)}
                      className="w-[90%] max-w-[140px] sm:max-w-[180px] h-auto object-contain -ml-0.5 select-none pointer-events-none"
                    />
                  ) : (
                    <span className="font-script text-[#f82a62] text-[clamp(16px,4.2vw,36px)] leading-none block -rotate-2">
                      Let&apos;s Create
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-[0.5vw] font-ui text-[clamp(7px,1.5vw,11.5px)] font-normal text-[#262936] leading-[1.35] line-clamp-2 max-w-[260px]">
                {isCustomDesigns ? 'Commission a bespoke Kashmiri outfit tailored to your measurements.' : "Whether you have a question or a custom design idea, we're here to help."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FULL-WIDTH CONTACT PAGE SECTIONS BELOW HERO
          ===================================================================== */}
      <div className="w-full px-4 sm:px-6 lg:px-[2.9%] xl:px-[3.2%] pt-3 pb-14 space-y-6 lg:space-y-8">
        {/* MIDDLE ROW — SECTION B (REACH US DIRECTLY) + SECTION C (EMBROIDERY IMAGE) + SECTION D (CUSTOMER ENQUIRY FORM) */}
        <section
          id="contact-enquiry"
          aria-label="Contact Information and Customer Enquiry Form"
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">
            {/* SECTION B — REACH US DIRECTLY (Blush-Pink Card, height: auto) */}
            <div className="lg:col-span-4 h-auto self-start relative rounded-[24px] bg-[#fdecef] border border-[#fadadd] p-6 sm:p-7 overflow-hidden shadow-[0_6px_24px_rgba(24,24,27,0.03)]">
              {/* Decorative Pink Floral Corner Illustration in Bottom-Right */}
              <img
                src={getAssetUrl('assets/aistudio/contact_reach_flower.png')}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute right-0 bottom-0 w-24 sm:w-28 h-auto object-contain pointer-events-none select-none opacity-95"
              />

              <div className="relative z-10">
                <p className="font-ui text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f42a60] mb-1">
                  CONTACT INFORMATION
                </p>
                <h2 className="font-editorial text-3xl sm:text-[36px] font-normal text-[#121829] leading-tight">
                  Reach Us Directly
                </h2>
                <p className="font-ui text-xs sm:text-[13.5px] text-[#373a47] leading-relaxed mt-2 max-w-md">
                  Have a question or a special request? Feel free to reach out
                  through any of the following channels.
                </p>

                {/* Three Contact Options */}
                <div className="mt-5 space-y-3.5">
                  {/* 1. Email Us */}
                  <a
                    href="mailto:atelier@shafiyakashmir.com"
                    className="group flex items-center gap-3.5 rounded-2xl p-1 -ml-1 hover:bg-white/45 transition-colors"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#f82a62] flex items-center justify-center shadow-[0_4px_12px_rgba(248,42,98,0.1)] shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="font-ui text-sm sm:text-[15px] font-bold text-[#121829] group-hover:text-[#f82a62] transition-colors">
                        Email Us
                      </h3>
                      <p className="font-ui text-xs text-[#6e717c] mt-0.5">
                        For general enquiries, orders and support
                      </p>
                      <p className="font-ui text-[11px] font-medium text-[#373a47] mt-0.5">
                        atelier@shafiyakashmir.com
                      </p>
                    </div>
                  </a>

                  {/* 2. Call / WhatsApp */}
                  <a
                    href="tel:+911942458910"
                    className="group flex items-center gap-3.5 rounded-2xl p-1 -ml-1 hover:bg-white/45 transition-colors"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#f82a62] flex items-center justify-center shadow-[0_4px_12px_rgba(248,42,98,0.1)] shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="font-ui text-sm sm:text-[15px] font-bold text-[#121829] group-hover:text-[#f82a62] transition-colors">
                        Call / WhatsApp
                      </h3>
                      <p className="font-ui text-xs text-[#6e717c] mt-0.5">
                        For quick assistance
                      </p>
                      <p className="font-ui text-[11px] font-medium text-[#373a47] mt-0.5 tabular-nums">
                        +91 (194) 245-8910
                      </p>
                    </div>
                  </a>

                  {/* 3. Our Location */}
                  <div className="flex items-center gap-3.5 p-1 -ml-1">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#f82a62] flex items-center justify-center shadow-[0_4px_12px_rgba(248,42,98,0.1)] shrink-0">
                      <MapPin className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="font-ui text-sm sm:text-[15px] font-bold text-[#121829]">
                        Our Location
                      </h3>
                      <p className="font-ui text-xs text-[#6e717c] mt-0.5">
                        We operate from India
                      </p>
                      <p className="font-ui text-[11px] font-medium text-[#373a47] mt-0.5">
                        Boulevard Road, Dal Lake, Srinagar, Kashmir 190001
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C — EMBROIDERY IMAGE (Natural, balanced aspect ratio, no forced height stretching) */}
            <div className="lg:col-span-3 h-auto self-start rounded-[24px] overflow-hidden shadow-[0_6px_24px_rgba(24,24,27,0.05)] bg-[#f5ece2]">
              <img
                src={getAssetUrl('assets/aistudio/contact_embroidery_tall.png')}
                alt="Handcrafted Kashmiri floral embroidered fabric"
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[380px] sm:max-h-[410px] object-cover object-center block"
              />
            </div>

            {/* SECTION D — CUSTOMER ENQUIRY FORM (height: auto, ends shortly below Send Message button) */}
            <div className="lg:col-span-5 h-auto self-start relative rounded-[24px] bg-[#fffdfb] border border-[#f2e8df] p-6 sm:p-7 shadow-[0_6px_24px_rgba(24,24,27,0.03)] overflow-hidden">
              {/* Top-Right Decorative Pink Floral Illustration */}
              <img
                src={getAssetUrl('assets/aistudio/contact_form_flower.png')}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute top-0 right-0 w-24 sm:w-28 h-auto object-contain pointer-events-none select-none"
              />

              <div className="relative z-10">
                <p className="font-ui text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f42a60] mb-1">
                  SEND US A MESSAGE
                </p>
                <h2 className="font-editorial text-3xl sm:text-[36px] font-normal text-[#121829] leading-tight">
                  Customer Enquiry Form
                </h2>
                <p className="font-ui text-xs sm:text-[13.5px] text-[#373a47] mt-1">
                  Fill in your details and we&apos;ll get back to you as soon as
                  possible.
                </p>

                {submittedData ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-5 rounded-2xl bg-[#fdecef]/75 border border-[#f9ced8] p-5 text-center space-y-2.5"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f82a62] text-white flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-editorial text-2xl font-bold text-[#121829]">
                      Enquiry Recorded, {submittedData.fullName}
                    </h3>
                    <p className="font-ui text-xs sm:text-sm text-[#373a47] leading-relaxed max-w-md mx-auto">
                      Thank you for reaching out regarding{' '}
                      <span className="font-semibold text-[#f82a62]">
                        {submittedData.enquiryType}
                      </span>
                      . Your message details for{' '}
                      <span className="font-medium">{submittedData.email}</span>{' '}
                      have been saved in this session. For immediate dispatch or
                      atelier correspondence, you can also email{' '}
                      <a
                        href="mailto:atelier@shafiyakashmir.com"
                        className="underline font-medium text-[#f82a62]"
                      >
                        atelier@shafiyakashmir.com
                      </a>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="mt-1 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#f82a62] hover:bg-[#df1950] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFormSubmit}
                    noValidate
                    className="mt-4 space-y-3.5"
                  >
                    {/* Row 1: Full Name + Email Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label
                          htmlFor="enquiry-full-name"
                          className="block font-ui text-xs font-bold text-[#141824] mb-1"
                        >
                          Full Name <span className="text-[#f82a62]">*</span>
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
                          className={`w-full h-10 rounded-xl bg-[#fcfaf8] border px-3.5 text-xs sm:text-[13px] text-[#141824] placeholder-[#a9a4a0] focus:outline-none focus:bg-white transition-colors ${
                            errors.fullName
                              ? 'border-[#e11d48] focus:border-[#e11d48]'
                              : 'border-[#e7dfd8] focus:border-[#f82a62]'
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
                          Email Address <span className="text-[#f82a62]">*</span>
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
                          className={`w-full h-10 rounded-xl bg-[#fcfaf8] border px-3.5 text-xs sm:text-[13px] text-[#141824] placeholder-[#a9a4a0] focus:outline-none focus:bg-white transition-colors ${
                            errors.email
                              ? 'border-[#e11d48] focus:border-[#e11d48]'
                              : 'border-[#e7dfd8] focus:border-[#f82a62]'
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
                          className={`w-full h-10 rounded-xl bg-[#fcfaf8] border px-3.5 text-xs sm:text-[13px] text-[#141824] placeholder-[#a9a4a0] focus:outline-none focus:bg-white transition-colors ${
                            errors.phone
                              ? 'border-[#e11d48] focus:border-[#e11d48]'
                              : 'border-[#e7dfd8] focus:border-[#f82a62]'
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
                            className="w-full h-10 appearance-none rounded-xl bg-[#fcfaf8] border border-[#e7dfd8] pl-3.5 pr-9 text-xs sm:text-[13px] text-[#141824] focus:outline-none focus:bg-white focus:border-[#f82a62] transition-colors cursor-pointer"
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
                        Your Message <span className="text-[#f82a62]">*</span>
                      </label>
                      <textarea
                        id="enquiry-message"
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) {
                            setErrors((prev) => ({ ...prev, message: '' }));
                          }
                        }}
                        placeholder="Tell us about your enquiry, custom design idea, product question or any other details..."
                        aria-invalid={Boolean(errors.message)}
                        className={`w-full rounded-xl bg-[#fcfaf8] border p-3 text-xs sm:text-[13px] text-[#141824] placeholder-[#a9a4a0] focus:outline-none focus:bg-white transition-colors resize-y ${
                          errors.message
                            ? 'border-[#e11d48] focus:border-[#e11d48]'
                            : 'border-[#e7dfd8] focus:border-[#f82a62]'
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
                      className="w-full h-11 rounded-full bg-gradient-to-r from-[#f81d5c] to-[#f42a64] hover:from-[#e0144f] hover:to-[#dc1f56] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(248,29,92,0.28)] transition-all cursor-pointer"
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

        {/* BOTTOM ROW — SECTION E (MAP) + SECTION F (QUICK ANSWERS) */}
        <section
          aria-label="Our Location Map and Quick Answers FAQ"
          className="w-full pt-1"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
            {/* SECTION E — INTERACTIVE MAP */}
            <div
              className={`${
                mapExpanded ? 'lg:col-span-12' : 'lg:col-span-5'
              } transition-all duration-300`}
            >
              <div
                onPointerDown={handleMapPointerDown}
                onPointerMove={handleMapPointerMove}
                onPointerUp={handleMapPointerUp}
                onPointerLeave={handleMapPointerUp}
                className={`relative w-full ${
                  mapExpanded ? 'h-[440px]' : 'h-[280px] sm:h-[310px]'
                } rounded-[26px] overflow-hidden border border-[#e3ece9] bg-[#c5f0ec] shadow-[0_6px_24px_rgba(24,24,27,0.05)] select-none ${
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
                    className="w-full h-full object-cover object-center pointer-events-none"
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
                    <span className="block w-8 h-8 rounded-full bg-[#f81d5c]/20 animate-ping" />
                  </button>
                </div>

                {/* Verified Location Badge & Open Directions Link (Bottom-Left) */}
                {showPinDetails && (
                  <div className="absolute left-3.5 bottom-3.5 z-20 max-w-[270px] rounded-2xl bg-white/95 backdrop-blur-xs border border-[#e6efed] px-3.5 py-2.5 shadow-md">
                    <p className="font-ui text-[11px] font-bold text-[#121829]">
                      Shafiya — Kashmiri Designs
                    </p>
                    <p className="font-ui text-[10.5px] text-[#4a4f5c] leading-snug mt-0.5">
                      Boulevard Road, Dal Lake, Srinagar, Kashmir 190001, India
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Boulevard+Road+Dal+Lake+Srinagar+Kashmir+190001+India"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#f81d5c] hover:underline"
                    >
                      <span>Open Directions in Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Top-Right Fullscreen/Expand Button matching Reference */}
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

                {/* Bottom-Right Interactive Zoom + / - Controls matching Reference */}
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

            {/* SECTION F — QUICK ANSWERS */}
            <div
              className={`${
                mapExpanded ? 'lg:col-span-12' : 'lg:col-span-7'
              } relative pt-1`}
            >
              {/* Top-Right Decorative Botanical Leaf Line Art matching Reference */}
              <img
                src={getAssetUrl('assets/aistudio/contact_faq_leaf.png')}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="hidden sm:block absolute -top-2 right-0 w-24 lg:w-28 xl:w-32 h-auto object-contain pointer-events-none select-none"
              />

              <div className="relative z-10 pr-0 sm:pr-28">
                <p className="font-ui text-[11px] xl:text-xs font-semibold uppercase tracking-[0.24em] text-[#f42a60] mb-1">
                  FREQUENT TOPICS
                </p>
                <h2 className="font-editorial text-3xl sm:text-4xl xl:text-[42px] font-normal text-[#121829] leading-tight">
                  Quick Answers
                </h2>
                <p className="font-ui text-xs sm:text-sm xl:text-[15px] text-[#373a47] mt-1">
                  Looking for something specific? Here are a few common topics
                  our customers ask about.
                </p>
              </div>

              {/* Six Clickable FAQ Items in 2-Column Grid */}
              <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {FAQ_ITEMS.map((item) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition-all duration-200 ${
                        isOpen
                          ? 'bg-white border-[#f82a62] shadow-md'
                          : 'bg-[#fffdfb] border-[#fad2dc] hover:border-[#f82a62]/60 shadow-[0_2px_10px_rgba(248,42,98,0.03)]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(item.id)}
                        aria-expanded={isOpen}
                        className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[#f82a62] shrink-0">
                            {item.icon}
                          </span>
                          <span className="font-ui text-xs sm:text-sm font-medium text-[#141824] truncate">
                            {item.title}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-[#f82a62] stroke-[2] shrink-0 transition-transform duration-200 ${
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
                            <div className="px-4 pb-4 pt-1 border-t border-[#fce8ee] space-y-1.5">
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
          </div>
        </section>
      </div>

      {/* =====================================================================
          3. EXISTING SHARED WEBSITE FOOTER (Strictly Preserved)
          ===================================================================== */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
