import { getAssetUrl } from '../utils/assetPath';

export interface HeroSlide {
  id: number;
  numberLabel: string;
  eyebrowLine1: string;
  eyebrowLine2: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  scriptWord: string;
  useReferenceScriptAsset?: boolean;
  description: string[];
  pillars: string[];
  curatedLine1: string;
  curatedLine2: string;
  embroideryCaption: string;
  landscapeCaption: string;
  embroideryFilter?: string;
  landscapeFilter?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    numberLabel: '01',
    eyebrowLine1: 'KASHMIRI CRAFTSMANSHIP',
    eyebrowLine2: 'MODERN EXPRESSIONS',
    headlineLine1: 'Tradition',
    headlineLine2: 'Looks',
    headlineLine3: 'on You',
    scriptWord: 'Beautiful',
    useReferenceScriptAsset: true,
    description: [
      'Handcrafted Kashmiri designs reimagined',
      'for the modern woman — where heritage',
      'meets your everyday story.',
    ],
    pillars: ['COLOURS', 'CULTURE', 'CRAFTSMANSHIP', 'CONTEMPORARY', 'STYLE'],
    curatedLine1: 'CURATED WITH LOVE',
    curatedLine2: 'FROM KASHMIR TO YOU',
    embroideryCaption: 'Hand-knotted Aari floral embroidery',
    landscapeCaption: 'Dal Lake houseboats & Zabarwan peaks',
    embroideryFilter: 'none',
    landscapeFilter: 'none',
  },
  {
    id: 1,
    numberLabel: '02',
    eyebrowLine1: 'HERITAGE AARI EMBROIDERY',
    eyebrowLine2: 'ARTISANAL ELEGANCE',
    headlineLine1: 'Heritage',
    headlineLine2: 'Blooms',
    headlineLine3: 'in Silk',
    scriptWord: 'Timeless',
    useReferenceScriptAsset: false,
    description: [
      'Intricate floral motifs hand-embroidered',
      'by master Kashmiri artisans — crafted to',
      'illuminate every celebration.',
    ],
    pillars: ['HERITAGE', 'ARTISTRY', 'PASHMINA', 'SILHOUETTES', 'GRACE'],
    curatedLine1: 'HANDWOVEN IN SRINAGAR',
    curatedLine2: 'PURE ARTISANAL LUXURY',
    embroideryCaption: 'Sozni & Aari silk threadwork detail',
    landscapeCaption: 'Morning mist over Srinagar valley',
    embroideryFilter: 'saturate(1.12) contrast(1.03)',
    landscapeFilter: 'saturate(1.08) brightness(1.02)',
  },
  {
    id: 2,
    numberLabel: '03',
    eyebrowLine1: 'VALLEY INSPIRED PALETTES',
    eyebrowLine2: 'CONTEMPORARY SILHOUETTES',
    headlineLine1: 'Stories',
    headlineLine2: 'Woven',
    headlineLine3: 'for You',
    scriptWord: 'Radiant',
    useReferenceScriptAsset: false,
    description: [
      'Vibrant blooms of Dal Lake and saffron',
      'meadows translated into effortless,',
      'heirloom-worthy silhouettes.',
    ],
    pillars: ['PASSION', 'TEXTURES', 'FLORALS', 'CELEBRATION', 'POETRY'],
    curatedLine1: 'AUTHENTIC KASHMIRI WEAVES',
    curatedLine2: 'CRAFTED FOR TODAY',
    embroideryCaption: 'Heirloom Kashmiri floral tapestry',
    landscapeCaption: 'Timeless reflections on Dal Lake',
    embroideryFilter: 'hue-rotate(-6deg) saturate(1.08)',
    landscapeFilter: 'contrast(1.05) saturate(1.06)',
  },
];

export interface CollectionCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
  hoverBgColor: string;
  description: string;
}

export const COLLECTION_CATEGORIES: CollectionCategory[] = [
  {
    id: 'Shawls',
    title: 'Shawls',
    subtitle: '120+ DESIGNS',
    image: getAssetUrl('assets/aistudio/cat_1_shawls.png'),
    bgColor: '#fdd0d3',
    hoverBgColor: '#fcc2c6',
    description: 'Heirloom Pashmina & Aari floral embroidered shawls handwoven in Srinagar.',
  },
  {
    id: 'Suits',
    title: 'Suits',
    subtitle: '80+ DESIGNS',
    image: getAssetUrl('assets/aistudio/cat_2_suits.png'),
    bgColor: '#e8ddfe',
    hoverBgColor: '#ddd0fc',
    description: 'Pastel silk & organza three-piece ensembles with delicate Sozni & Tilla work.',
  },
  {
    id: 'Pherans',
    title: 'Pherans',
    subtitle: '60+ DESIGNS',
    image: getAssetUrl('assets/aistudio/cat_3_pherans.png'),
    bgColor: '#c0f2e9',
    hoverBgColor: '#aeece1',
    description: 'Modern relaxed Kashmiri pherans adorned with botanical Chinar &badam motifs.',
  },
  {
    id: 'Stoles',
    title: 'Stoles',
    subtitle: '100+ DESIGNS',
    image: getAssetUrl('assets/aistudio/cat_4_stoles.png'),
    bgColor: '#fef1b9',
    hoverBgColor: '#fdeba1',
    description: 'Lightweight Kani & Jamawar stoles crafted for effortless everyday layering.',
  },
  {
    id: 'Accessories',
    title: 'Accessories',
    subtitle: '50+ DESIGNS',
    image: getAssetUrl('assets/aistudio/cat_5_accessories.png'),
    bgColor: '#fce2e2',
    hoverBgColor: '#fad4d4',
    description: 'Hand-embroidered Kashmiri velvet & silk potli bags and artisanal jewellery.',
  },
  {
    id: 'Custom Designs',
    title: 'Custom Designs',
    subtitle: 'YOUR STORY, OUR CRAFT',
    image: getAssetUrl('assets/aistudio/cat_6_custom.png'),
    bgColor: '#c5edfe',
    hoverBgColor: '#b2e6fd',
    description: 'Bespoke bridal trousseaus and made-to-measure silhouettes tailored to your story.',
  },
];

export interface FeaturedPiece {
  id: string;
  name: string;
  category: string;
  craftNote: string;
  price: string;
  numericPrice: number;
  image: string;
  pastelBg: string;
  accentColor: string;
}

export const FEATURED_PIECES: FeaturedPiece[] = [
  {
    id: 'gulmarg-floral-shawl',
    name: 'Gulmarg Blossom Aari Shawl',
    category: 'Shawls',
    craftNote: 'Pure Pashmina · Hand-Knotted Floral Aari',
    price: '₹24,500',
    numericPrice: 24500,
    image: getAssetUrl('assets/aistudio/cat_1_shawls.png'),
    pastelBg: '#fdd0d3',
    accentColor: '#f83a6b',
  },
  {
    id: 'nishat-lavender-suit',
    name: 'Nishat Garden Lavender Silk Suit',
    category: 'Suits',
    craftNote: 'Mulberry Silk · Delicate Sozni Threadwork',
    price: '₹19,800',
    numericPrice: 19800,
    image: getAssetUrl('assets/aistudio/cat_2_suits.png'),
    pastelBg: '#e8ddfe',
    accentColor: '#7c4dff',
  },
  {
    id: 'shalimar-ivory-pheran',
    name: 'Shalimar Ivory Botanical Pheran',
    category: 'Pherans',
    craftNote: 'Fine Cashmere Blend · Multicolour Aari',
    price: '₹16,400',
    numericPrice: 16400,
    image: getAssetUrl('assets/aistudio/cat_3_pherans.png'),
    pastelBg: '#c0f2e9',
    accentColor: '#0d9488',
  },
  {
    id: 'zabarwan-kani-stole',
    name: 'Zabarwan Paisley Kani Stole',
    category: 'Stoles',
    craftNote: 'Handloom Kani Weave · Heritage Palette',
    price: '₹12,900',
    numericPrice: 12900,
    image: getAssetUrl('assets/aistudio/cat_4_stoles.png'),
    pastelBg: '#fef1b9',
    accentColor: '#b45309',
  },
  {
    id: 'chinar-rose-potli',
    name: 'Chinar Rose Embroidered Potli',
    category: 'Accessories',
    craftNote: 'Raw Silk · Handcrafted Floral Crest',
    price: '₹6,800',
    numericPrice: 6800,
    image: getAssetUrl('assets/aistudio/cat_5_accessories.png'),
    pastelBg: '#fce2e2',
    accentColor: '#e11d48',
  },
  {
    id: 'midnight-bloom-bespoke',
    name: 'Midnight Bloom Bespoke Ensemble',
    category: 'Custom Designs',
    craftNote: 'Made-to-Measure · Custom Motif Placement',
    price: '₹28,500',
    numericPrice: 28500,
    image: getAssetUrl('assets/aistudio/cat_6_custom.png'),
    pastelBg: '#c5edfe',
    accentColor: '#0284c7',
  },
];

export interface CollectionItem {
  name: string;
  subtitle: string;
  category: string;
}

export const COLLECTION_ITEMS: CollectionItem[] = [
  {
    name: 'Aari Floral Pherans',
    subtitle: 'Hand-embroidered heritage silhouettes',
    category: 'Pherans',
  },
  {
    name: 'Pure Pashmina Shawls',
    subtitle: 'Authentic Sozni & Kaniloom weaves',
    category: 'Shawls',
  },
  {
    name: 'Festive Tilla Suits',
    subtitle: 'Metallic threadwork on Mulberry silk',
    category: 'Suits',
  },
  {
    name: 'Chinar Blossom Stoles',
    subtitle: 'Vibrant botanical Kashmiri motifs',
    category: 'Stoles',
  },
];

export interface BagItem {
  id: string;
  productId?: string;
  name: string;
  variant: string;
  price: string;
  numericPrice?: number;
  originalNumericPrice?: number;
  stockQuantity?: number;
  size?: string;
  colour?: string;
  productSlug?: string;
  quantity: number;
  image: string;
}


