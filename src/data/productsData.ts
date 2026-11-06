import { getAssetUrl } from '../utils/assetPath';

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export const ALL_SIZES: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export type ProductCategoryOption =
  | 'Kurtas'
  | 'Kurta Sets'
  | 'Palazzo Sets'
  | 'Pant Sets'
  | 'Dupatta Sets'
  | 'Kashmiri Embroidered Suits'
  | 'Suits'
  | 'Pherans'
  | 'Shawls'
  | 'Stoles'
  | 'Accessories';

export const ALL_CATALOG_CATEGORIES: ProductCategoryOption[] = [
  'Kurtas',
  'Kurta Sets',
  'Palazzo Sets',
  'Pant Sets',
  'Dupatta Sets',
  'Kashmiri Embroidered Suits',
  'Pherans',
  'Shawls',
  'Stoles',
  'Accessories',
];

export interface ProductGalleryItem {
  id: string;
  url: string;
  thumbUrl?: string;
  label: string;
  isVideoPreview?: boolean;
  imageFilter?: string;
  cropClass?: string;
}

export interface ProductColourVariant {
  name: string;
  hex: string;
  filterGroup: string;
  image: string;
  imageFilter?: string;
  availableSizes: SizeOption[];
}

export interface ProductReviewItem {
  id: string;
  author: string;
  avatar?: string;
  verifiedPurchase?: boolean;
  rating: number;
  date: string;
  variantLabel: string;
  comment: string;
  photos?: string[];
  helpfulCount?: number;
}

export interface SizeMeasurementRow {
  size: SizeOption;
  bustIn: string;
  waistIn: string;
  hipIn: string;
  lengthIn: string;
  bustCm: string;
  waistCm: string;
  hipCm: string;
  lengthCm: string;
}

/**
 * Structured product model ready for Admin Panel / CMS inventory management.
 * Note: Items in DEMO_CATALOG_PRODUCTS are marked `isDemoCatalogItem: true`
 * to clearly distinguish demonstration catalogue records from live warehouse stock.
 */
export interface CatalogProduct {
  id: string;
  slug: string;
  isDemoCatalogItem?: boolean;
  brand: string;
  name: string;
  category: ProductCategoryOption;
  collectionGroup: string;
  cardCategoryLabel?: string;
  workType:
    | 'Kiran Border'
    | 'Kashmiri Aari'
    | 'Sozni Embroidery'
    | 'Zari & Gota'
    | 'Tilla Work'
    | 'Printed & Embroidered';
  fabric:
    | 'Cotton Silk'
    | 'Pure Silk'
    | 'Georgette'
    | 'Chiffon'
    | 'Wool Blend';
  price: number;
  originalPrice: number;
  discountPercent: number;
  topDiscountBadge?: string;
  assuredBadge?: boolean;
  lowStockLabel?: string;
  stockQuantity: number;
  availabilityStatus: 'In Stock' | 'Low Stock';
  rating: number;
  reviewCount: number;
  soldCount: number;
  sku: string;
  popularityRank: number;
  newestRank: number;
  defaultSize: SizeOption;
  extraColourCount: number;
  colours: ProductColourVariant[];
  gallery: ProductGalleryItem[];
  shortDescription: string;
  productDetailsSummary: string;
  specifications: { label: string; value: string }[];
  fabricAndCare: {
    fabricComposition: string;
    weaveAndEmbroidery: string;
    careInstructions: string[];
  };
  sizeAndFit: {
    fitDescription: string;
    modelInfo: string;
    garmentNote: string;
  };
  shippingAndReturns: {
    shippingNote: string;
    returnsNote: string;
    packagingNote: string;
  };
  reviews: ProductReviewItem[];
}

export const SAMPLE_SIZE_GUIDE_CHART: SizeMeasurementRow[] = [
  {
    size: 'XS',
    bustIn: '32',
    waistIn: '26',
    hipIn: '34',
    lengthIn: '44',
    bustCm: '81',
    waistCm: '66',
    hipCm: '86',
    lengthCm: '112',
  },
  {
    size: 'S',
    bustIn: '34',
    waistIn: '28',
    hipIn: '36',
    lengthIn: '44',
    bustCm: '86',
    waistCm: '71',
    hipCm: '91',
    lengthCm: '112',
  },
  {
    size: 'M',
    bustIn: '36',
    waistIn: '30',
    hipIn: '38',
    lengthIn: '45',
    bustCm: '91',
    waistCm: '76',
    hipCm: '97',
    lengthCm: '114',
  },
  {
    size: 'L',
    bustIn: '38',
    waistIn: '32',
    hipIn: '40',
    lengthIn: '45',
    bustCm: '97',
    waistCm: '81',
    hipCm: '102',
    lengthCm: '114',
  },
  {
    size: 'XL',
    bustIn: '40',
    waistIn: '34',
    hipIn: '42',
    lengthIn: '46',
    bustCm: '102',
    waistCm: '86',
    hipCm: '107',
    lengthCm: '117',
  },
  {
    size: 'XXL',
    bustIn: '42',
    waistIn: '36',
    hipIn: '44',
    lengthIn: '46',
    bustCm: '107',
    waistCm: '91',
    hipCm: '112',
    lengthCm: '117',
  },
];

// Shared default reviews helper for products 2-10 using neutral initials avatars and product gallery reference photos
function createDemoReviews(
  productId: string,
  colourName: string,
  defaultSize: SizeOption,
  galleryPhotos: [string, string, string]
): ProductReviewItem[] {
  return [
    {
      id: `${productId}-rev-1`,
      author: 'Priya S.',
      verifiedPurchase: true,
      rating: 5,
      date: '5 days ago',
      variantLabel: `Colour: ${colourName} · Size: ${defaultSize}`,
      comment:
        'Beautiful fabric and amazing quality. The Kashmiri embroidery is really elegant and finely finished. Fits perfectly!',
      photos: [
        getAssetUrl(galleryPhotos[0]),
        getAssetUrl(galleryPhotos[1]),
        getAssetUrl(galleryPhotos[2]),
      ],
      helpfulCount: 12,
    },
    {
      id: `${productId}-rev-2`,
      author: 'Ananya K.',
      verifiedPurchase: true,
      rating: 5,
      date: '2 weeks ago',
      variantLabel: `Colour: ${colourName} · Size: ${defaultSize}`,
      comment:
        'Loved the design and material. Worth the price. Wore it to a family celebration and received so many compliments on the needlework.',
      helpfulCount: 8,
    },
    {
      id: `${productId}-rev-3`,
      author: 'Meera R.',
      verifiedPurchase: true,
      rating: 4,
      date: '3 weeks ago',
      variantLabel: `Colour: ${colourName} · Size: L`,
      comment:
        'The drape and border detailing are very graceful. True to the Shafiya size guide measurements.',
      photos: [getAssetUrl(galleryPhotos[2])],
      helpfulCount: 5,
    },
    {
      id: `${productId}-rev-4`,
      author: 'Zoya H.',
      verifiedPurchase: true,
      rating: 5,
      date: '1 month ago',
      variantLabel: `Colour: ${colourName} · Size: S`,
      comment:
        'Authentic Kashmiri craftsmanship with a modern silhouette. Packaging was also very neat and protective.',
      helpfulCount: 4,
    },
  ];
}

// ============================================================================
// APPROVED PRODUCT CATALOGUE (10 PRODUCTS)
// ============================================================================
const RAW_CATALOG_PRODUCTS: CatalogProduct[] = [
  // -------------------------------------------------------------------------
  // 1. KURTAS — Pink Elegance – Embroidered Kurta Pant & Dupatta Set (Card 1)
  // -------------------------------------------------------------------------
  {
    id: 'pink-elegance-embroidered-kurta-pant-dupatta-set',
    slug: 'pink-elegance-embroidered-kurta-pant-dupatta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Pink Elegance – Embroidered Kurta Pant & Dupatta Set',
    category: 'Kurtas',
    collectionGroup: 'Kurtas',
    cardCategoryLabel: 'Ethnic Wear',
    workType: 'Kiran Border',
    fabric: 'Cotton Silk',
    price: 808,
    originalPrice: 5426,
    discountPercent: 85,
    topDiscountBadge: 'Top Discount of the Sale',
    stockQuantity: 12,
    availabilityStatus: 'In Stock',
    rating: 4.6,
    reviewCount: 124,
    soldCount: 253,
    sku: 'SHF-EJ-KB-808',
    popularityRank: 1,
    newestRank: 2,
    defaultSize: 'M',
    extraColourCount: 3,
    colours: [
      {
        name: 'Pink',
        hex: '#d81b60',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        name: 'Champagne Beige',
        hex: '#ead5bd',
        filterGroup: 'Beige',
        image: '/assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        name: 'Blush Pink',
        hex: '#eb93a4',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        name: 'Dusty Rose',
        hex: '#d49098',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'M', 'L', 'XL'],
      },
      {
        name: 'Mist Blue',
        hex: '#d5dfe4',
        filterGroup: 'Blue',
        image: '/assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png',
        imageFilter: 'none',
        availableSizes: ['M', 'L', 'XL', 'XXL'],
      },
    ],
    gallery: [
      {
        id: 'front-view',
        url: '/assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png',
        thumbUrl: '/assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png',
        label: 'Front View',
      },
      {
        id: 'seated-pose',
        url: '/assets/aistudio/Elegant_Fuchsia_Salwar_Kameez_Portrait_65bc27ab.png',
        thumbUrl: '/assets/aistudio/Elegant_Fuchsia_Salwar_Kameez_Portrait_65bc27ab.png',
        label: 'Seated Pose',
      },
      {
        id: 'side-pose',
        url: '/assets/aistudio/Elegant_Fuchsia_Salwar_Kameez_Portrait__1__944be03b.png',
        thumbUrl: '/assets/aistudio/Elegant_Fuchsia_Salwar_Kameez_Portrait__1__944be03b.png',
        label: 'Side Profile',
      },
      {
        id: 'back-pose',
        url: '/assets/aistudio/Fuchsia_Embroidered_Kurta_Ensemble_375b3b3c.png',
        thumbUrl: '/assets/aistudio/Fuchsia_Embroidered_Kurta_Ensemble_375b3b3c.png',
        label: 'Back View',
      },
      {
        id: 'detail-collage',
        url: '/assets/aistudio/Pink_Ethnic_Outfit_Detail_Collage_b0b49da6.png',
        thumbUrl: '/assets/aistudio/Pink_Ethnic_Outfit_Detail_Collage_b0b49da6.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A beautiful pink kurta set featuring intricate traditional embroidery along the neckline and elegant vertical patterns. Paired with coordinated bottoms and a matching dupatta, this ensemble brings timeless ethnic charm to your wardrobe.',
    productDetailsSummary:
      'A beautiful pink kurta set featuring intricate traditional embroidery along the neckline and elegant vertical patterns. Paired with coordinated bottoms and a matching dupatta, this ensemble brings timeless ethnic charm to your wardrobe.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Pant & Matching Dupatta' },
      { label: 'Work Type', value: 'Traditional Neckline & Vertical Pattern Embroidery' },
      { label: 'Neckline & Sleeves', value: 'Split V-Neckline · Three-Quarter Sleeves' },
      { label: 'Bottom Style', value: 'Coordinated Pant with Embroidered Ankle Border' },
    ],
    fabricAndCare: {
      fabricComposition:
        'Kurta & Pant: Breathable Cotton Silk Blend · Dupatta: Embroidered Organza-Net with Border Trim',
      weaveAndEmbroidery:
        'Intricate traditional embroidery along the neckline, sleeves, vertical panels, and pant hem.',
      careInstructions: [
        'Dry clean recommended for the first two washes to preserve embroidery finish.',
        'Gentle hand wash separately in cold water with mild liquid silk detergent.',
        'Dry in shade; steam iron on low heat from the reverse side.',
      ],
    },
    sizeAndFit: {
      fitDescription: 'Regular straight Kurta fit with coordinated tailored Pant.',
      modelInfo: 'Model is 5\'7" (170 cm) and is wearing Size M.',
      garmentNote: 'Select your standard size for a tailored ethnic silhouette.',
    },
    shippingAndReturns: {
      shippingNote: 'Eligible for Free Shipping. Dispatched in protective garment packaging.',
      returnsNote:
        'Easy returns and size exchanges supported within the applicable return window for unworn items with original tags intact.',
      packagingNote: 'Shipped with quality verification from our fulfilment partner.',
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Priya S.',
        verifiedPurchase: true,
        rating: 5,
        date: '5 days ago',
        variantLabel: 'Colour: Pink · Size: M',
        comment:
          'Beautiful fabric and amazing quality. The traditional embroidery along the neckline and vertical patterns is really elegant. Fits perfectly!',
        photos: [
          '/assets/aistudio/Elegant_Magenta_Embroidered_Ensemble_b1b5c394.png',
          '/assets/aistudio/Elegant_Fuchsia_Salwar_Kameez_Portrait_65bc27ab.png',
          '/assets/aistudio/Pink_Ethnic_Outfit_Detail_Collage_b0b49da6.png',
        ],
        helpfulCount: 12,
      },
      {
        id: 'rev-2',
        author: 'Ananya K.',
        verifiedPurchase: true,
        rating: 5,
        date: '2 weeks ago',
        variantLabel: 'Colour: Pink · Size: M',
        comment:
          'Loved the design and material. Worth the price. Wore it for an evening family gathering and received so many compliments on the embroidery and dupatta.',
        helpfulCount: 8,
      },
      {
        id: 'rev-3',
        author: 'Meera R.',
        verifiedPurchase: true,
        rating: 4,
        date: '3 weeks ago',
        variantLabel: 'Colour: Pink · Size: L',
        comment:
          'Fabric has a lovely subtle sheen and the pant border work is very neat. True to the size chart.',
        photos: ['/assets/aistudio/Pink_Ethnic_Outfit_Detail_Collage_b0b49da6.png'],
        helpfulCount: 5,
      },
      {
        id: 'rev-4',
        author: 'Farah D.',
        verifiedPurchase: true,
        rating: 5,
        date: '1 month ago',
        variantLabel: 'Colour: Pink · Size: S',
        comment:
          'Lightweight yet festive! The dupatta length is generous and the embroidery does not scratch at all.',
        photos: ['/assets/aistudio/Elegant_Fuchsia_Salwar_Kameez_Portrait__1__944be03b.png'],
        helpfulCount: 9,
      },
      {
        id: 'rev-5',
        author: 'Kavita N.',
        verifiedPurchase: true,
        rating: 4,
        date: '1 month ago',
        variantLabel: 'Colour: Pink · Size: XL',
        comment:
          'Very comfortable cotton silk blend for all-day wear. Delivery was prompt and well packed.',
        helpfulCount: 3,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 2. KURTAS — Teal Grace – Silver Embroidered Kurta Set (Card 2)
  // -------------------------------------------------------------------------
  {
    id: 'teal-grace-silver-embroidered-kurta-set',
    slug: 'teal-grace-silver-embroidered-kurta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Teal Grace – Silver Embroidered Kurta Set',
    category: 'Kurtas',
    collectionGroup: 'Kurtas',
    cardCategoryLabel: 'Traditional Collection',
    workType: 'Kiran Border',
    fabric: 'Pure Silk',
    price: 834,
    originalPrice: 3500,
    discountPercent: 76,
    topDiscountBadge: 'Festive Bestseller',
    stockQuantity: 9,
    availabilityStatus: 'In Stock',
    rating: 4.5,
    reviewCount: 98,
    soldCount: 189,
    sku: 'SHF-RIL-SB-834',
    popularityRank: 2,
    newestRank: 1,
    defaultSize: 'S',
    extraColourCount: 4,
    colours: [
      {
        name: 'Teal',
        hex: '#0f4c54',
        filterGroup: 'Blue',
        image: '/assets/aistudio/Kashmiri_Teal_Elegance_by_the_Lake__1__9172381d.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        name: 'Petal Blush',
        hex: '#d9b9ad',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Kashmiri_Teal_Elegance_by_the_Lake__1__9172381d.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L'],
      },
      {
        name: 'Dusty Mauve',
        hex: '#c8a69c',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Kashmiri_Teal_Elegance_by_the_Lake__1__9172381d.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },
      {
        name: 'Lotus Pink',
        hex: '#e89eb0',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Kashmiri_Teal_Elegance_by_the_Lake__1__9172381d.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        name: 'Rani Rose',
        hex: '#ec6988',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Kashmiri_Teal_Elegance_by_the_Lake__1__9172381d.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L'],
      },
    ],
    gallery: [
      {
        id: 'teal-front-view',
        url: '/assets/aistudio/Kashmiri_Teal_Elegance_by_the_Lake__1__9172381d.png',
        thumbUrl: '/assets/aistudio/Kashmiri_Teal_Elegance_by_the_Lake__1__9172381d.png',
        label: 'Front View',
      },
      {
        id: 'teal-seated-pose',
        url: '/assets/aistudio/Teal_Kashmiri_Portrait_by_the_Lake_e5cce688.png',
        thumbUrl: '/assets/aistudio/Teal_Kashmiri_Portrait_by_the_Lake_e5cce688.png',
        label: 'Seated Pose',
      },
      {
        id: 'teal-side-profile',
        url: '/assets/aistudio/Teal_Elegance_by_the_Mountain_Lake_9f6b339a.png',
        thumbUrl: '/assets/aistudio/Teal_Elegance_by_the_Mountain_Lake_9f6b339a.png',
        label: 'Side Profile',
      },
      {
        id: 'teal-back-view',
        url: '/assets/aistudio/Teal_Kashmiri_Elegance_by_the_Lake_cdd5271b.png',
        thumbUrl: '/assets/aistudio/Teal_Kashmiri_Elegance_by_the_Lake_cdd5271b.png',
        label: 'Back View',
      },
      {
        id: 'teal-detail-collage',
        url: '/assets/aistudio/Teal_Embroidered_Suit_Gallery_2147afa2.png',
        thumbUrl: '/assets/aistudio/Teal_Embroidered_Suit_Gallery_2147afa2.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A graceful teal kurta featuring intricate silver embroidery around the neckline and elegant vertical embroidered patterns. A timeless ethnic design that brings understated elegance to festive and everyday occasions.',
    productDetailsSummary:
      'A graceful teal kurta featuring intricate silver embroidery around the neckline and elegant vertical embroidered patterns. A timeless ethnic design that brings understated elegance to festive and everyday occasions.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Pant & Matching Dupatta' },
      { label: 'Work Type', value: 'Intricate Silver Neckline & Vertical Pattern Embroidery' },
      { label: 'Neckline & Sleeves', value: 'Split V-Neckline · Three-Quarter Sleeves' },
      { label: 'Available Sizes', value: 'XS, S, M, L, XL' },
    ],
    fabricAndCare: {
      fabricComposition: 'Lustrous Silk Blend with breathable soft inner lining and sheer embroidered dupatta.',
      weaveAndEmbroidery: 'Intricate silver threadwork along the neckline, cuffs, vertical panels, and ankle borders.',
      careInstructions: [
        'Dry clean recommended to preserve silver embroidery and rich teal hue.',
        'Store on a padded hanger or folded in muslin cloth.',
      ],
    },
    sizeAndFit: {
      fitDescription: 'Regular straight kurta fit with coordinated tailored trousers.',
      modelInfo: 'Model is 5\'6" (168 cm) and is wearing Size S.',
      garmentNote: 'Select your standard size for a graceful ethnic silhouette.',
    },
    shippingAndReturns: {
      shippingNote: 'Eligible for Free Shipping on all prepaid and standard orders.',
      returnsNote: 'Easy returns and size exchanges supported within the standard return policy.',
      packagingNote: 'Delivered in protective Shafiya festive packaging.',
    },
    reviews: createDemoReviews(
      'ril',
      'Teal',
      'S',
      [
        '/assets/aistudio/Kashmiri_Teal_Elegance_by_the_Lake__1__9172381d.png',
        '/assets/aistudio/Teal_Kashmiri_Portrait_by_the_Lake_e5cce688.png',
        '/assets/aistudio/Teal_Embroidered_Suit_Gallery_2147afa2.png',
      ]
    ),
  },

  // -------------------------------------------------------------------------
  // 3. KURTAS — Lime Grace – Embroidered Kurta Pant & Dupatta Set (Card 3)
  // -------------------------------------------------------------------------
  {
    id: 'lime-grace-embroidered-kurta-pant-dupatta-set',
    slug: 'lime-grace-embroidered-kurta-pant-dupatta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Lime Grace – Embroidered Kurta Pant & Dupatta Set',
    category: 'Kurtas',
    collectionGroup: 'Kurtas',
    cardCategoryLabel: 'Festive Wear',
    workType: 'Kiran Border',
    fabric: 'Pure Silk',
    price: 914,
    originalPrice: 3899,
    discountPercent: 76,
    assuredBadge: true,
    topDiscountBadge: 'Assured Quality Edit',
    stockQuantity: 15,
    availabilityStatus: 'In Stock',
    rating: 4.7,
    reviewCount: 162,
    soldCount: 310,
    sku: 'SHF-COE-PS-914',
    popularityRank: 3,
    newestRank: 4,
    defaultSize: 'L',
    extraColourCount: 2,
    colours: [
      {
        name: 'Lime Green',
        hex: '#9ec42b',
        filterGroup: 'Green',
        image: '/assets/aistudio/Lime_Green_Elegance_by_the_Mountain_Lake_b183fdce.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        name: 'Burnished Bronze',
        hex: '#74563c',
        filterGroup: 'Brown',
        image: '/assets/aistudio/Lime_Green_Elegance_by_the_Mountain_Lake_b183fdce.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },
      {
        name: 'Mulberry Wine',
        hex: '#54292c',
        filterGroup: 'Wine',
        image: '/assets/aistudio/Lime_Green_Elegance_by_the_Mountain_Lake_b183fdce.png',
        imageFilter: 'none',
        availableSizes: ['M', 'L', 'XL', 'XXL'],
      },
      {
        name: 'Warm Ivory',
        hex: '#e5d0cb',
        filterGroup: 'Beige',
        image: '/assets/aistudio/Lime_Green_Elegance_by_the_Mountain_Lake_b183fdce.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    gallery: [
      {
        id: 'lime-front-view',
        url: '/assets/aistudio/Lime_Green_Elegance_by_the_Mountain_Lake_b183fdce.png',
        thumbUrl: '/assets/aistudio/Lime_Green_Elegance_by_the_Mountain_Lake_b183fdce.png',
        label: 'Front View',
      },
      {
        id: 'lime-seated-pose',
        url: '/assets/aistudio/Lime_Green_Kashmiri_Fashion_Portrait_54c6546f.png',
        thumbUrl: '/assets/aistudio/Lime_Green_Kashmiri_Fashion_Portrait_54c6546f.png',
        label: 'Seated Pose',
      },
      {
        id: 'lime-side-profile',
        url: '/assets/aistudio/Profile_in_Lime_Green_Elegance__1__5c938794.png',
        thumbUrl: '/assets/aistudio/Profile_in_Lime_Green_Elegance__1__5c938794.png',
        label: 'Side Profile',
      },
      {
        id: 'lime-back-view',
        url: '/assets/aistudio/Lime-Green_Salwar_Kameez_by_the_Lake_5d8b138a.png',
        thumbUrl: '/assets/aistudio/Lime-Green_Salwar_Kameez_by_the_Lake_5d8b138a.png',
        label: 'Back View',
      },
      {
        id: 'lime-detail-collage',
        url: '/assets/aistudio/Lime_Green_Kashmiri_Embroidery_Collage_f0c253cc.png',
        thumbUrl: '/assets/aistudio/Lime_Green_Kashmiri_Embroidery_Collage_f0c253cc.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A refreshing lime-green kurta set adorned with delicate white embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a beautifully detailed dupatta, it brings effortless charm to your ethnic wardrobe.',
    productDetailsSummary:
      'A refreshing lime-green kurta set adorned with delicate white embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a beautifully detailed dupatta, it brings effortless charm to your ethnic wardrobe.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Pant & Matching Dupatta' },
      { label: 'Work Type', value: 'Delicate White Neckline, Sleeve & Vertical Panel Embroidery' },
      { label: 'Quality Badge', value: 'Shafiya Assured Quality Checked' },
      { label: 'Available Sizes', value: 'S, M, L, XL, XXL' },
    ],
    fabricAndCare: {
      fabricComposition: '100% Pure Chanderi & Mulberry Silk with breathable cotton-silk lining.',
      weaveAndEmbroidery: 'Delicate white threadwork along the neckline, sleeves, vertical panels, and ankle borders.',
      careInstructions: [
        'Dry clean only to maintain pure silk structure and delicate white embroidery.',
        'Avoid direct contact with moisture or perfumes.',
      ],
    },
    sizeAndFit: {
      fitDescription: 'Regular straight kurta fit with coordinated tailored bottoms.',
      modelInfo: 'Model is 5\'8" (173 cm) and is wearing Size L.',
      garmentNote: 'Includes internal seam allowance for minor custom adjustments.',
    },
    shippingAndReturns: {
      shippingNote: 'Eligible for Free Shipping across India.',
      returnsNote: 'Easy returns and exchanges supported on unworn items with original tags.',
      packagingNote: 'Packaged with heirloom tissue wrap.',
    },
    reviews: createDemoReviews(
      'coe',
      'Lime Green',
      'L',
      [
        '/assets/aistudio/Lime_Green_Elegance_by_the_Mountain_Lake_b183fdce.png',
        '/assets/aistudio/Lime_Green_Kashmiri_Fashion_Portrait_54c6546f.png',
        '/assets/aistudio/Lime_Green_Kashmiri_Embroidery_Collage_f0c253cc.png',
      ]
    ),
  },

  // -------------------------------------------------------------------------
  // 4. KURTAS — Royal Pink – Gold Embroidered Kurta Set (Card 4)
  // -------------------------------------------------------------------------
  {
    id: 'royal-pink-gold-embroidered-kurta-set',
    slug: 'royal-pink-gold-embroidered-kurta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Royal Pink – Gold Embroidered Kurta Set',
    category: 'Kurtas',
    collectionGroup: 'Kurtas',
    cardCategoryLabel: 'Festive Wear',
    workType: 'Kiran Border',
    fabric: 'Georgette',
    price: 761,
    originalPrice: 2999,
    discountPercent: 74,
    lowStockLabel: 'Only 1 left',
    topDiscountBadge: 'Limited Stock Deal',
    stockQuantity: 1,
    availabilityStatus: 'Low Stock',
    rating: 4.5,
    reviewCount: 87,
    soldCount: 194,
    sku: 'SHF-TF-GK-761',
    popularityRank: 4,
    newestRank: 3,
    defaultSize: 'M',
    extraColourCount: 3,
    colours: [
      {
        name: 'Royal Pink',
        hex: '#d81b60',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Fuchsia_Embroidered_Kurta_Portrait__1__5afec958.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L'],
      },
      {
        name: 'Crimson Magenta',
        hex: '#5e2129',
        filterGroup: 'Wine',
        image: '/assets/aistudio/Fuchsia_Embroidered_Kurta_Portrait__1__5afec958.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L'],
      },
      {
        name: 'Soft Peach',
        hex: '#f3dfd1',
        filterGroup: 'Beige',
        image: '/assets/aistudio/Fuchsia_Embroidered_Kurta_Portrait__1__5afec958.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M'],
      },
      {
        name: 'Rose Pink',
        hex: '#ec799a',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Fuchsia_Embroidered_Kurta_Portrait__1__5afec958.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L'],
      },
    ],
    gallery: [
      {
        id: 'royal-pink-front-view',
        url: '/assets/aistudio/Fuchsia_Embroidered_Kurta_Portrait__1__5afec958.png',
        thumbUrl: '/assets/aistudio/Fuchsia_Embroidered_Kurta_Portrait__1__5afec958.png',
        label: 'Front View',
      },
      {
        id: 'royal-pink-seated-pose',
        url: '/assets/aistudio/Pink_and_Gold_Seated_Portrait__1__3260cb1e.png',
        thumbUrl: '/assets/aistudio/Pink_and_Gold_Seated_Portrait__1__3260cb1e.png',
        label: 'Seated Pose',
      },
      {
        id: 'royal-pink-side-profile',
        url: '/assets/aistudio/Elegant_Magenta_Kurta_Portrait_6dd05350.png',
        thumbUrl: '/assets/aistudio/Elegant_Magenta_Kurta_Portrait_6dd05350.png',
        label: 'Side Profile',
      },
      {
        id: 'royal-pink-back-view',
        url: '/assets/aistudio/Elegant_Magenta_Kurta_Fashion_Portrait_c7b1e469.png',
        thumbUrl: '/assets/aistudio/Elegant_Magenta_Kurta_Fashion_Portrait_c7b1e469.png',
        label: 'Back View',
      },
      {
        id: 'royal-pink-detail-collage',
        url: '/assets/aistudio/Fuchsia_Embroidered_Suit_Lookbook_d3dc75c6.png',
        thumbUrl: '/assets/aistudio/Fuchsia_Embroidered_Suit_Lookbook_d3dc75c6.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A striking pink kurta set featuring intricate golden embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a sheer dupatta with ornate gold detailing, this ensemble brings a touch of regal elegance.',
    productDetailsSummary:
      'A striking pink kurta set featuring intricate golden embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a sheer dupatta with ornate gold detailing, this ensemble brings a touch of regal elegance.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Bottoms & Gold-Detailed Dupatta' },
      { label: 'Work Type', value: 'Intricate Golden Neckline, Sleeve & Vertical Panel Embroidery' },
      { label: 'Stock Note', value: 'Only 1 unit remaining in current artisanal batch' },
      { label: 'Available Sizes', value: 'XS, S, M, L' },
    ],
    fabricAndCare: {
      fabricComposition: 'High-twist Faux Georgette with soft santoon inner lining and sheer gold-embroidered dupatta.',
      weaveAndEmbroidery: 'Intricate golden embroidery along the neckline, sleeves, vertical panels, and ornate dupatta border.',
      careInstructions: [
        'Gentle dry clean recommended to preserve golden embroidery.',
        'Do not wring or bleach; steam press from reverse.',
      ],
    },
    sizeAndFit: {
      fitDescription: 'Tailored straight kurta with coordinated embroidered ankle bottoms.',
      modelInfo: 'Model is 5\'6" (168 cm) and is wearing Size M.',
      garmentNote: 'Maximum order quantity for this item is limited to current stock (1 unit).',
    },
    shippingAndReturns: {
      shippingNote: 'Eligible for Free Shipping. Ready for immediate dispatch.',
      returnsNote: 'Easy returns and exchanges supported within standard policy guidelines.',
      packagingNote: 'Carefully folded with acid-free tissue protection.',
    },
    reviews: createDemoReviews(
      'tf',
      'Royal Pink',
      'M',
      [
        '/assets/aistudio/Fuchsia_Embroidered_Kurta_Portrait__1__5afec958.png',
        '/assets/aistudio/Pink_and_Gold_Seated_Portrait__1__3260cb1e.png',
        '/assets/aistudio/Fuchsia_Embroidered_Suit_Lookbook_d3dc75c6.png',
      ]
    ),
  },

  // -------------------------------------------------------------------------
  // 5. KURTA SETS — Mustard Glow – Embroidered Kurta Pant & Dupatta Set (Card 5)
  // -------------------------------------------------------------------------
  {
    id: 'mustard-glow-embroidered-kurta-pant-dupatta-set',
    slug: 'mustard-glow-embroidered-kurta-pant-dupatta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Mustard Glow – Embroidered Kurta Pant & Dupatta Set',
    category: 'Kurta Sets',
    collectionGroup: 'Kurta Sets',
    cardCategoryLabel: 'Festive Wear',
    workType: 'Sozni Embroidery',
    fabric: 'Pure Silk',
    price: 1890,
    originalPrice: 4999,
    discountPercent: 62,
    assuredBadge: true,
    topDiscountBadge: 'Valley Bestseller',
    stockQuantity: 8,
    availabilityStatus: 'In Stock',
    rating: 4.8,
    reviewCount: 74,
    soldCount: 142,
    sku: 'SHF-NG-LS-1890',
    popularityRank: 5,
    newestRank: 5,
    defaultSize: 'M',
    extraColourCount: 2,
    colours: [
      {
        name: 'Mustard Yellow',
        hex: '#e0a914',
        filterGroup: 'Gold',
        image: '/assets/aistudio/Mustard_Elegance_in_a_Sunlit_Courtyard_7039f721.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        name: 'Blush Rose',
        hex: '#f4b8c8',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Mustard_Elegance_in_a_Sunlit_Courtyard_7039f721.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },
      {
        name: 'Powder Blue',
        hex: '#bdd8f2',
        filterGroup: 'Blue',
        image: '/assets/aistudio/Mustard_Elegance_in_a_Sunlit_Courtyard_7039f721.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L'],
      },
    ],
    gallery: [
      {
        id: 'mustard-front-view',
        url: '/assets/aistudio/Mustard_Elegance_in_a_Sunlit_Courtyard_7039f721.png',
        thumbUrl: '/assets/aistudio/Mustard_Elegance_in_a_Sunlit_Courtyard_7039f721.png',
        label: 'Front View',
      },
      {
        id: 'mustard-seated-pose',
        url: '/assets/aistudio/Elegant_Yellow_Salwar-Kameez_Portrait_65bee541.png',
        thumbUrl: '/assets/aistudio/Elegant_Yellow_Salwar-Kameez_Portrait_65bee541.png',
        label: 'Seated Pose',
      },
      {
        id: 'mustard-side-profile',
        url: '/assets/aistudio/Golden_Yellow_Elegance_in_a_Courtyard_e102cc8b.png',
        thumbUrl: '/assets/aistudio/Golden_Yellow_Elegance_in_a_Courtyard_e102cc8b.png',
        label: 'Side Profile',
      },
      {
        id: 'mustard-back-view',
        url: '/assets/aistudio/Elegant_Yellow_Salwar_Kameez_Courtyard_Portrait_355e5346.png',
        thumbUrl: '/assets/aistudio/Elegant_Yellow_Salwar_Kameez_Courtyard_Portrait_355e5346.png',
        label: 'Back View',
      },
      {
        id: 'mustard-detail-collage',
        url: '/assets/aistudio/mustard_yellow_kurta_collage_FINAL_1158x1341_66124970.png',
        thumbUrl: '/assets/aistudio/mustard_yellow_kurta_collage_FINAL_1158x1341_66124970.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A vibrant mustard-yellow kurta set featuring intricate light-toned embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a matching dupatta, this ensemble brings a graceful touch of traditional elegance.',
    productDetailsSummary:
      'A vibrant mustard-yellow kurta set featuring intricate light-toned embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a matching dupatta, this ensemble brings a graceful touch of traditional elegance.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Pant & Matching Dupatta' },
      { label: 'Work Type', value: 'Intricate Light-Toned Neckline, Sleeve & Vertical Panel Embroidery' },
      { label: 'Neckline & Sleeves', value: 'Round Split Neck · Three-Quarter Sleeves' },
      { label: 'Occasion', value: 'Daytime Celebrations & Festive Gatherings' },
    ],
    fabricAndCare: {
      fabricComposition: 'Pure Kashmiri Mulberry Silk Blend with breathable inner lining and matching embroidered dupatta.',
      weaveAndEmbroidery: 'Intricate light-toned threadwork along the neckline, sleeves, vertical panels, and ankle borders.',
      careInstructions: ['Dry clean only.', 'Store in breathable muslin bag.'],
    },
    sizeAndFit: {
      fitDescription: 'Comfortable straight-fit silhouette with coordinated tailored bottoms.',
      modelInfo: 'Model is 5\'7" and is wearing Size M.',
      garmentNote: 'True to standard Shafiya sizing.',
    },
    shippingAndReturns: {
      shippingNote: 'Free shipping on eligible orders.',
      returnsNote: 'Easy 14-day return and exchange policy.',
      packagingNote: 'Ships from our Srinagar atelier.',
    },
    reviews: createDemoReviews(
      'ng',
      'Mustard Yellow',
      'M',
      [
        '/assets/aistudio/Mustard_Elegance_in_a_Sunlit_Courtyard_7039f721.png',
        '/assets/aistudio/Elegant_Yellow_Salwar-Kameez_Portrait_65bee541.png',
        '/assets/aistudio/mustard_yellow_kurta_collage_FINAL_1158x1341_66124970.png',
      ]
    ),
  },

  // -------------------------------------------------------------------------
  // 6. KURTA SETS — Midnight Elegance – Silver Embroidered Kurta Set (Card 6)
  // -------------------------------------------------------------------------
  {
    id: 'midnight-elegance-silver-embroidered-kurta-set',
    slug: 'midnight-elegance-silver-embroidered-kurta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Midnight Elegance – Silver Embroidered Kurta Set',
    category: 'Kurta Sets',
    collectionGroup: 'Kurta Sets',
    cardCategoryLabel: 'Festive Wear',
    workType: 'Kashmiri Aari',
    fabric: 'Cotton Silk',
    price: 1495,
    originalPrice: 3990,
    discountPercent: 63,
    stockQuantity: 11,
    availabilityStatus: 'In Stock',
    rating: 4.7,
    reviewCount: 68,
    soldCount: 154,
    sku: 'SHF-VE-CK-1495',
    popularityRank: 6,
    newestRank: 6,
    defaultSize: 'M',
    extraColourCount: 2,
    colours: [
      {
        name: 'Midnight Black',
        hex: '#19191d',
        filterGroup: 'Black',
        image: '/assets/aistudio/Elegant_Black_Embroidered_Salwar_Suit_fe6a57b1.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        name: 'Golden Ochre',
        hex: '#c9974c',
        filterGroup: 'Gold',
        image: '/assets/aistudio/Elegant_Black_Embroidered_Salwar_Suit_fe6a57b1.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },
    ],
    gallery: [
      {
        id: 'midnight-front-view',
        url: '/assets/aistudio/Elegant_Black_Embroidered_Salwar_Suit_fe6a57b1.png',
        thumbUrl: '/assets/aistudio/Elegant_Black_Embroidered_Salwar_Suit_fe6a57b1.png',
        label: 'Front View',
      },
      {
        id: 'midnight-seated-pose',
        url: '/assets/aistudio/Elegant_Silver-Embroidered_Ensemble_4f13c62a.png',
        thumbUrl: '/assets/aistudio/Elegant_Silver-Embroidered_Ensemble_4f13c62a.png',
        label: 'Seated Pose',
      },
      {
        id: 'midnight-side-profile',
        url: '/assets/aistudio/Elegant_Black_Embroidered_Ensemble_2c94675c.png',
        thumbUrl: '/assets/aistudio/Elegant_Black_Embroidered_Ensemble_2c94675c.png',
        label: 'Side Profile',
      },
      {
        id: 'midnight-back-view',
        url: '/assets/aistudio/Elegant_Black_Embroidered_Salwar-Kameez_Portrait_e20600b6.png',
        thumbUrl: '/assets/aistudio/Elegant_Black_Embroidered_Salwar-Kameez_Portrait_e20600b6.png',
        label: 'Back View',
      },
      {
        id: 'midnight-detail-collage',
        url: '/assets/aistudio/black_silver_kurta_detail_collage_1158x1341_eb89bd44.png',
        thumbUrl: '/assets/aistudio/black_silver_kurta_detail_collage_1158x1341_eb89bd44.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A timeless black kurta set featuring intricate silver embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a matching dupatta, this ensemble creates a sophisticated look for festive and special occasions.',
    productDetailsSummary:
      'A timeless black kurta set featuring intricate silver embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a matching dupatta, this ensemble creates a sophisticated look for festive and special occasions.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Bottoms & Matching Dupatta' },
      { label: 'Work Type', value: 'Intricate Silver Neckline, Sleeve & Vertical Panel Embroidery' },
      { label: 'Neckline & Sleeves', value: 'Split V-Neckline · Three-Quarter Sleeves' },
      { label: 'Available Sizes', value: 'XS to XXL' },
    ],
    fabricAndCare: {
      fabricComposition: '80% Combed Cotton, 20% Mulberry Silk with matching silver-embroidered dupatta.',
      weaveAndEmbroidery: 'Intricate silver threadwork along the neckline, sleeves, vertical panels, and ankle borders.',
      careInstructions: ['Gentle hand wash or dry clean.', 'Steam iron on reverse.'],
    },
    sizeAndFit: {
      fitDescription: 'Tailored straight kurta with coordinated bottoms.',
      modelInfo: 'Model is 5\'7" and is wearing Size M.',
      garmentNote: 'True to size.',
    },
    shippingAndReturns: {
      shippingNote: 'Free shipping across India.',
      returnsNote: 'Easy 14-day returns and exchanges.',
      packagingNote: 'Protective garment pouch included.',
    },
    reviews: createDemoReviews(
      've',
      'Midnight Black',
      'M',
      [
        '/assets/aistudio/Elegant_Black_Embroidered_Salwar_Suit_fe6a57b1.png',
        '/assets/aistudio/Elegant_Silver-Embroidered_Ensemble_4f13c62a.png',
        '/assets/aistudio/black_silver_kurta_detail_collage_1158x1341_eb89bd44.png',
      ]
    ),
  },

  // -------------------------------------------------------------------------
  // 7. PALAZZO SETS — Teal Royale – Gold Embroidered Kurta Pant & Dupatta Set (Card 7)
  // -------------------------------------------------------------------------
  {
    id: 'teal-royale-gold-embroidered-kurta-pant-dupatta-set',
    slug: 'teal-royale-gold-embroidered-kurta-pant-dupatta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Teal Royale – Gold Embroidered Kurta Pant & Dupatta Set',
    category: 'Palazzo Sets',
    collectionGroup: 'Palazzo Sets',
    cardCategoryLabel: 'Festive Wear',
    workType: 'Kashmiri Aari',
    fabric: 'Wool Blend',
    price: 2150,
    originalPrice: 4800,
    discountPercent: 55,
    assuredBadge: true,
    stockQuantity: 6,
    availabilityStatus: 'In Stock',
    rating: 4.9,
    reviewCount: 91,
    soldCount: 176,
    sku: 'SHF-SI-BP-2150',
    popularityRank: 7,
    newestRank: 7,
    defaultSize: 'M',
    extraColourCount: 2,
    colours: [
      {
        name: 'Teal & Gold',
        hex: '#0d6e7b',
        filterGroup: 'Blue',
        image: '/assets/aistudio/Teal_Elegance_in_an_Archway_61e3e17f.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        name: 'Midnight Black',
        hex: '#19191d',
        filterGroup: 'Black',
        image: '/assets/aistudio/Teal_Elegance_in_an_Archway_61e3e17f.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },
    ],
    gallery: [
      {
        id: 'teal-royale-front-view',
        url: '/assets/aistudio/Teal_Elegance_in_an_Archway_61e3e17f.png',
        thumbUrl: '/assets/aistudio/Teal_Elegance_in_an_Archway_61e3e17f.png',
        label: 'Front View',
      },
      {
        id: 'teal-royale-seated-pose',
        url: '/assets/aistudio/Teal_Embroidered_Elegance_on_a_Stone_Ledge_098879fd.png',
        thumbUrl: '/assets/aistudio/Teal_Embroidered_Elegance_on_a_Stone_Ledge_098879fd.png',
        label: 'Seated Pose',
      },
      {
        id: 'teal-royale-side-profile',
        url: '/assets/aistudio/Teal_Elegance_in_a_Golden-Trimmed_Studio_af383db3.png',
        thumbUrl: '/assets/aistudio/Teal_Elegance_in_a_Golden-Trimmed_Studio_af383db3.png',
        label: 'Side Profile',
      },
      {
        id: 'teal-royale-back-view',
        url: '/assets/aistudio/Teal_and_Gold_Archway_Elegance_410c737d.png',
        thumbUrl: '/assets/aistudio/Teal_and_Gold_Archway_Elegance_410c737d.png',
        label: 'Back View',
      },
      {
        id: 'teal-royale-detail-collage',
        url: '/assets/aistudio/Teal_Embroidered_Suit_Editorial_Collage_3d9ef064.png',
        thumbUrl: '/assets/aistudio/Teal_Embroidered_Suit_Editorial_Collage_3d9ef064.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'An elegant teal kurta set adorned with intricate golden embroidery along the neckline, sleeves and vertical panels. Paired with coordinated bottoms and a matching dupatta, this ensemble brings a rich, graceful touch to festive dressing.',
    productDetailsSummary:
      'An elegant teal kurta set adorned with intricate golden embroidery along the neckline, sleeves and vertical panels. Paired with coordinated bottoms and a matching dupatta, this ensemble brings a rich, graceful touch to festive dressing.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Pant & Matching Dupatta' },
      { label: 'Work Type', value: 'Intricate Golden Neckline, Sleeve & Vertical Panel Embroidery' },
      { label: 'Neckline & Sleeves', value: 'Split V-Neckline · Three-Quarter Sleeves' },
      { label: 'Available Sizes', value: 'XS, S, M, L, XL, XXL' },
    ],
    fabricAndCare: {
      fabricComposition: 'Fine Cashmere-Wool & Cotton Silk Blend with matching gold-embroidered dupatta.',
      weaveAndEmbroidery: 'Intricate golden threadwork along the neckline, sleeves, vertical panels, and ankle borders.',
      careInstructions: ['Dry clean only.', 'Store flat in cool dry space.'],
    },
    sizeAndFit: {
      fitDescription: 'Tailored straight kurta with coordinated bottoms.',
      modelInfo: 'Model is 5\'7" and is wearing Size M.',
      garmentNote: 'Designed for effortless festive elegance.',
    },
    shippingAndReturns: {
      shippingNote: 'Free shipping across India.',
      returnsNote: 'Easy returns and size exchanges supported.',
      packagingNote: 'Packaged in signature Shafiya box.',
    },
    reviews: createDemoReviews(
      'si',
      'Teal & Gold',
      'M',
      [
        '/assets/aistudio/Teal_Elegance_in_an_Archway_61e3e17f.png',
        '/assets/aistudio/Teal_Embroidered_Elegance_on_a_Stone_Ledge_098879fd.png',
        '/assets/aistudio/Teal_Embroidered_Suit_Editorial_Collage_3d9ef064.png',
      ]
    ),
  },

  // -------------------------------------------------------------------------
  // 8. PALAZZO SETS — Maroon Royale – Gold Embroidered Kurta Pant & Dupatta Set (Card 8)
  // -------------------------------------------------------------------------
  {
    id: 'maroon-royale-gold-embroidered-kurta-pant-dupatta-set',
    slug: 'maroon-royale-gold-embroidered-kurta-pant-dupatta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Maroon Royale – Gold Embroidered Kurta Pant & Dupatta Set',
    category: 'Palazzo Sets',
    collectionGroup: 'Palazzo Sets',
    cardCategoryLabel: 'Festive Wear',
    workType: 'Zari & Gota',
    fabric: 'Pure Silk',
    price: 1340,
    originalPrice: 4199,
    discountPercent: 68,
    topDiscountBadge: 'Festive Edit',
    stockQuantity: 10,
    availabilityStatus: 'In Stock',
    rating: 4.6,
    reviewCount: 59,
    soldCount: 132,
    sku: 'SHF-PP-OZ-1340',
    popularityRank: 8,
    newestRank: 8,
    defaultSize: 'S',
    extraColourCount: 3,
    colours: [
      {
        name: 'Maroon & Gold',
        hex: '#69091e',
        filterGroup: 'Wine',
        image: '/assets/aistudio/Maroon_Embroidered_Salwar_Kameez_Portrait_7c1ce529.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        name: 'Champagne Gold',
        hex: '#e2c598',
        filterGroup: 'Gold',
        image: '/assets/aistudio/Maroon_Embroidered_Salwar_Kameez_Portrait_7c1ce529.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },
    ],
    gallery: [
      {
        id: 'maroon-royale-front-view',
        url: '/assets/aistudio/Maroon_Embroidered_Salwar_Kameez_Portrait_7c1ce529.png',
        thumbUrl: '/assets/aistudio/Maroon_Embroidered_Salwar_Kameez_Portrait_7c1ce529.png',
        label: 'Front View',
      },
      {
        id: 'maroon-royale-seated-pose',
        url: '/assets/aistudio/Maroon_Embroidered_Elegance_with_Gold_Accents_09619755.png',
        thumbUrl: '/assets/aistudio/Maroon_Embroidered_Elegance_with_Gold_Accents_09619755.png',
        label: 'Seated Pose',
      },
      {
        id: 'maroon-royale-side-profile',
        url: '/assets/aistudio/Maroon_Kurta_with_Golden_Embroidery_6e81bdeb.png',
        thumbUrl: '/assets/aistudio/Maroon_Kurta_with_Golden_Embroidery_6e81bdeb.png',
        label: 'Side Profile',
      },
      {
        id: 'maroon-royale-back-view',
        url: '/assets/aistudio/Maroon_Gold_Embroidered_Kurta_Ensemble_fba3ea92.png',
        thumbUrl: '/assets/aistudio/Maroon_Gold_Embroidered_Kurta_Ensemble_fba3ea92.png',
        label: 'Back View',
      },
      {
        id: 'maroon-royale-detail-collage',
        url: '/assets/aistudio/Maroon_Gold_Embroidered_Salwar_Set_c46ee554.png',
        thumbUrl: '/assets/aistudio/Maroon_Gold_Embroidered_Salwar_Set_c46ee554.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A rich maroon kurta set featuring intricate golden embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a graceful cream dupatta, this ensemble brings timeless elegance to festive occasions.',
    productDetailsSummary:
      'A rich maroon kurta set featuring intricate golden embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a graceful cream dupatta, this ensemble brings timeless elegance to festive occasions.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Pant & Cream Dupatta' },
      { label: 'Work Type', value: 'Intricate Golden Neckline, Sleeve & Vertical Panel Embroidery' },
      { label: 'Available Sizes', value: 'XS, S, M, L, XL' },
      { label: 'Lining', value: 'Soft Mulmul & Crepe Inner Lining' },
    ],
    fabricAndCare: {
      fabricComposition: 'Pure Silk Blend with breathable lining and embroidered cream dupatta.',
      weaveAndEmbroidery: 'Intricate golden threadwork along the neckline, sleeves, vertical panels, and ankle borders.',
      careInstructions: ['Dry clean recommended.', 'Steam press on low heat.'],
    },
    sizeAndFit: {
      fitDescription: 'Tailored straight kurta fit with coordinated bottoms.',
      modelInfo: 'Model is 5\'6" and is wearing Size S.',
      garmentNote: 'True to size.',
    },
    shippingAndReturns: {
      shippingNote: 'Free shipping on all orders.',
      returnsNote: 'Easy 14-day returns.',
      packagingNote: 'Protective tissue-lined box.',
    },
    reviews: createDemoReviews(
      'pp',
      'Maroon & Gold',
      'S',
      [
        '/assets/aistudio/Maroon_Embroidered_Salwar_Kameez_Portrait_7c1ce529.png',
        '/assets/aistudio/Maroon_Embroidered_Elegance_with_Gold_Accents_09619755.png',
        '/assets/aistudio/Maroon_Gold_Embroidered_Salwar_Set_c46ee554.png',
      ]
    ),
  },

  // -------------------------------------------------------------------------
  // 9. PANT SETS — Taupe Elegance – Silver Embroidered Kurta Pant & Dupatta Set (Card 9)
  // -------------------------------------------------------------------------
  {
    id: 'taupe-elegance-silver-embroidered-kurta-pant-dupatta-set',
    slug: 'taupe-elegance-silver-embroidered-kurta-pant-dupatta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Taupe Elegance – Silver Embroidered Kurta Pant & Dupatta Set',
    category: 'Pant Sets',
    collectionGroup: 'Pant Sets',
    cardCategoryLabel: 'Festive Wear',
    workType: 'Tilla Work',
    fabric: 'Chiffon',
    price: 1680,
    originalPrice: 4200,
    discountPercent: 60,
    lowStockLabel: 'Only 2 left',
    stockQuantity: 2,
    availabilityStatus: 'Low Stock',
    rating: 4.7,
    reviewCount: 64,
    soldCount: 118,
    sku: 'SHF-MB-TP-1680',
    popularityRank: 9,
    newestRank: 9,
    defaultSize: 'L',
    extraColourCount: 2,
    colours: [
      {
        name: 'Taupe & Silver',
        hex: '#a88464',
        filterGroup: 'Beige',
        image: '/assets/aistudio/Warm_Terracotta_Kurta_Portrait_bf2214ec.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },
      {
        name: 'Crimson Wine',
        hex: '#611f2a',
        filterGroup: 'Wine',
        image: '/assets/aistudio/Warm_Terracotta_Kurta_Portrait_bf2214ec.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L'],
      },
    ],
    gallery: [
      {
        id: 'taupe-elegance-front-view',
        url: '/assets/aistudio/Warm_Terracotta_Kurta_Portrait_bf2214ec.png',
        thumbUrl: '/assets/aistudio/Warm_Terracotta_Kurta_Portrait_bf2214ec.png',
        label: 'Front View',
      },
      {
        id: 'taupe-elegance-seated-pose',
        url: '/assets/aistudio/Elegant_Taupe_Embroidered_Portrait_95b04a51.png',
        thumbUrl: '/assets/aistudio/Elegant_Taupe_Embroidered_Portrait_95b04a51.png',
        label: 'Seated Pose',
      },
      {
        id: 'taupe-elegance-side-profile',
        url: '/assets/aistudio/Embroidered_Elegance_Against_Terracotta_Walls_dfd686c6.png',
        thumbUrl: '/assets/aistudio/Embroidered_Elegance_Against_Terracotta_Walls_dfd686c6.png',
        label: 'Side Profile',
      },
      {
        id: 'taupe-elegance-back-view',
        url: '/assets/aistudio/Elegant_Embroidered_Taupe_Ensemble_7122cab5.png',
        thumbUrl: '/assets/aistudio/Elegant_Embroidered_Taupe_Ensemble_7122cab5.png',
        label: 'Back View',
      },
      {
        id: 'taupe-elegance-detail-collage',
        url: '/assets/aistudio/Embroidered_Taupe_Ensemble_Catalog_Collage_32df5899.png',
        thumbUrl: '/assets/aistudio/Embroidered_Taupe_Ensemble_Catalog_Collage_32df5899.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A graceful taupe kurta set featuring delicate silver embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a matching embroidered dupatta, this ensemble offers understated sophistication for festive and special occasions.',
    productDetailsSummary:
      'A graceful taupe kurta set featuring delicate silver embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a matching embroidered dupatta, this ensemble offers understated sophistication for festive and special occasions.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Pant & Matching Dupatta' },
      { label: 'Work Type', value: 'Delicate Silver Neckline, Sleeve & Vertical Panel Embroidery' },
      { label: 'Neckline & Sleeves', value: 'Split V-Neckline · Three-Quarter Sleeves' },
      { label: 'Available Sizes', value: 'S, M, L, XL' },
    ],
    fabricAndCare: {
      fabricComposition: 'High-density Silk Blend with breathable inner lining and matching silver-embroidered dupatta.',
      weaveAndEmbroidery: 'Delicate silver threadwork along the neckline, sleeves, vertical panels, and ankle borders.',
      careInstructions: ['Dry clean only.'],
    },
    sizeAndFit: {
      fitDescription: 'Sleek straight kurta with tailored ankle-length bottoms.',
      modelInfo: 'Model is 5\'7" and is wearing Size L.',
      garmentNote: 'True to size.',
    },
    shippingAndReturns: {
      shippingNote: 'Free shipping on all orders.',
      returnsNote: 'Easy returns and exchanges.',
      packagingNote: 'Ships from Srinagar atelier.',
    },
    reviews: createDemoReviews(
      'mb',
      'Taupe & Silver',
      'L',
      [
        '/assets/aistudio/Warm_Terracotta_Kurta_Portrait_bf2214ec.png',
        '/assets/aistudio/Elegant_Taupe_Embroidered_Portrait_95b04a51.png',
        '/assets/aistudio/Embroidered_Taupe_Ensemble_Catalog_Collage_32df5899.png',
      ]
    ),
  },

  // -------------------------------------------------------------------------
  // 10. PANT SETS — Lavender Grace – Silver Embroidered Kurta Pant & Dupatta Set
  // -------------------------------------------------------------------------
  {
    id: 'lavender-grace-silver-embroidered-kurta-pant-dupatta-set',
    slug: 'lavender-grace-silver-embroidered-kurta-pant-dupatta-set',
    isDemoCatalogItem: true,
    brand: 'Shafiya Kashmiri Designs',
    name: 'Lavender Grace – Silver Embroidered Kurta Pant & Dupatta Set',
    category: 'Pant Sets',
    collectionGroup: 'Pant Sets',
    cardCategoryLabel: 'Festive Wear',
    workType: 'Sozni Embroidery',
    fabric: 'Georgette',
    price: 1120,
    originalPrice: 3499,
    discountPercent: 68,
    assuredBadge: true,
    stockQuantity: 14,
    availabilityStatus: 'In Stock',
    rating: 4.6,
    reviewCount: 53,
    soldCount: 129,
    sku: 'SHF-KS-GP-1120',
    popularityRank: 10,
    newestRank: 10,
    defaultSize: 'M',
    extraColourCount: 2,
    colours: [
      {
        name: 'Mauve Lavender',
        hex: '#8c5e85',
        filterGroup: 'Pink',
        image: '/assets/aistudio/Regal_Lilac_Courtyard_Portrait_be4fad35.png',
        imageFilter: 'none',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        name: 'Ruby Magenta',
        hex: '#6d1d3a',
        filterGroup: 'Wine',
        image: '/assets/aistudio/Regal_Lilac_Courtyard_Portrait_be4fad35.png',
        imageFilter: 'none',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },
    ],
    gallery: [
      {
        id: 'lavender-grace-front-view',
        url: '/assets/aistudio/Regal_Lilac_Courtyard_Portrait_be4fad35.png',
        thumbUrl: '/assets/aistudio/Regal_Lilac_Courtyard_Portrait_be4fad35.png',
        label: 'Front View',
      },
      {
        id: 'lavender-grace-seated-pose',
        url: '/assets/aistudio/Elegant_Lilac_Courtyard_Portrait_4341fcda.png',
        thumbUrl: '/assets/aistudio/Elegant_Lilac_Courtyard_Portrait_4341fcda.png',
        label: 'Seated Pose',
      },
      {
        id: 'lavender-grace-side-profile',
        url: '/assets/aistudio/Lavender_Elegance_in_a_Sunlit_Courtyard_b3cdfc9a.png',
        thumbUrl: '/assets/aistudio/Lavender_Elegance_in_a_Sunlit_Courtyard_b3cdfc9a.png',
        label: 'Side Profile',
      },
      {
        id: 'lavender-grace-back-view',
        url: '/assets/aistudio/Elegant_Mauve_Embroidered_Ensemble_604a9e38.png',
        thumbUrl: '/assets/aistudio/Elegant_Mauve_Embroidered_Ensemble_604a9e38.png',
        label: 'Back View',
      },
      {
        id: 'lavender-grace-detail-collage',
        url: '/assets/aistudio/Mauve_Embroidered_Salwar_Kameez_Collage_3ccc21d3.png',
        thumbUrl: '/assets/aistudio/Mauve_Embroidered_Salwar_Kameez_Collage_3ccc21d3.png',
        label: 'Product Detail Collage',
      },
    ],
    shortDescription:
      'A graceful mauve-lavender kurta set featuring intricate silver embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a flowing embroidered dupatta, this ensemble brings understated charm to festive and special occasions.',
    productDetailsSummary:
      'A graceful mauve-lavender kurta set featuring intricate silver embroidery along the neckline, sleeves and elegant vertical panels. Paired with coordinated bottoms and a flowing embroidered dupatta, this ensemble brings understated charm to festive and special occasions.',
    specifications: [
      { label: 'Set Includes', value: 'Embroidered Kurta, Coordinated Pant & Flowing Dupatta' },
      { label: 'Work Type', value: 'Intricate Silver Neckline, Sleeve & Vertical Panel Embroidery' },
      { label: 'Available Sizes', value: 'XS to XXL' },
      { label: 'Quality Check', value: 'Shafiya Assured' },
    ],
    fabricAndCare: {
      fabricComposition: 'Premium Faux Georgette with soft lining and flowing embroidered dupatta.',
      weaveAndEmbroidery: 'Intricate silver threadwork along the neckline, sleeves, vertical panels, and ankle borders.',
      careInstructions: ['Dry clean or gentle cold wash.'],
    },
    sizeAndFit: {
      fitDescription: 'Straight-fit kurta with ankle-length tapered pants.',
      modelInfo: 'Model is 5\'6" and is wearing Size M.',
      garmentNote: 'True to size.',
    },
    shippingAndReturns: {
      shippingNote: 'Free shipping on all orders.',
      returnsNote: 'Easy 14-day return window.',
      packagingNote: 'Shipped in protective garment sleeve.',
    },
    reviews: createDemoReviews(
      'ks',
      'Mauve Lavender',
      'M',
      [
        '/assets/aistudio/Regal_Lilac_Courtyard_Portrait_be4fad35.png',
        '/assets/aistudio/Elegant_Lilac_Courtyard_Portrait_4341fcda.png',
        '/assets/aistudio/Mauve_Embroidered_Salwar_Kameez_Collage_3ccc21d3.png',
      ]
    ),
  },
];

export const CATALOG_PRODUCTS: CatalogProduct[] = RAW_CATALOG_PRODUCTS.map(
  (prod) => ({
    ...prod,
    colours: prod.colours.map((col) => ({
      ...col,
      image: getAssetUrl(col.image),
    })),
    gallery: prod.gallery.map((g) => ({
      ...g,
      url: getAssetUrl(g.url),
      thumbUrl: g.thumbUrl ? getAssetUrl(g.thumbUrl) : getAssetUrl(g.url),
    })),
    reviews: prod.reviews.map((rev) => ({
      ...rev,
      avatar: rev.avatar ? getAssetUrl(rev.avatar) : undefined,
      photos: rev.photos ? rev.photos.map((p) => getAssetUrl(p)) : undefined,
    })),
  })
);

