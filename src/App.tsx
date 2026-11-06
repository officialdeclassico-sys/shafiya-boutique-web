/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HeroBanner } from './components/HeroBanner';
import { OurStoryPage } from './components/OurStoryPage';
import { ContactPage } from './components/ContactPage';
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { ShoppingBagCheckoutFlow } from './components/ShoppingBagCheckoutFlow';
import { SignInModal } from './components/SignInModal';
import { NavItemKey } from './components/Header';
import { BagItem } from './data/heroSlides';
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
  SizeOption,
} from './data/productsData';

type AppView =
  | NavItemKey
  | 'ProductDetails'
  | 'Bag'
  | 'Checkout'
  | 'OrderConfirmation';

const BAG_STORAGE_KEY = 'shafiya_bag_items_v1';
const WISHLIST_STORAGE_KEY = 'shafiya_wishlist_ids_v1';

// Default initial bag items matching Screen 8 (Subtotal ₹2,556 across 3 items)
const INITIAL_REFERENCE_BAG_ITEMS: BagItem[] = [
  {
    id: `${CATALOG_PRODUCTS[0].id}__Pink__M`,
    productId: CATALOG_PRODUCTS[0].id,
    name: CATALOG_PRODUCTS[0].name,
    variant: 'Pink | M',
    price: `₹${CATALOG_PRODUCTS[0].price.toLocaleString('en-IN')}`,
    numericPrice: CATALOG_PRODUCTS[0].price,
    originalNumericPrice: CATALOG_PRODUCTS[0].originalPrice,
    stockQuantity: CATALOG_PRODUCTS[0].stockQuantity,
    size: 'M',
    colour: 'Pink',
    productSlug: CATALOG_PRODUCTS[0].slug,
    quantity: 1,
    image: CATALOG_PRODUCTS[0].colours[0].image,
  },
  {
    id: `${CATALOG_PRODUCTS[1].id}__Teal__S`,
    productId: CATALOG_PRODUCTS[1].id,
    name: CATALOG_PRODUCTS[1].name,
    variant: 'Teal | S',
    price: `₹${CATALOG_PRODUCTS[1].price.toLocaleString('en-IN')}`,
    numericPrice: CATALOG_PRODUCTS[1].price,
    originalNumericPrice: CATALOG_PRODUCTS[1].originalPrice,
    stockQuantity: CATALOG_PRODUCTS[1].stockQuantity,
    size: 'S',
    colour: 'Teal',
    productSlug: CATALOG_PRODUCTS[1].slug,
    quantity: 1,
    image: CATALOG_PRODUCTS[1].colours[0].image,
  },
  {
    id: `${CATALOG_PRODUCTS[2].id}__Lime Green__L`,
    productId: CATALOG_PRODUCTS[2].id,
    name: CATALOG_PRODUCTS[2].name,
    variant: 'Lime Green | L',
    price: `₹${CATALOG_PRODUCTS[2].price.toLocaleString('en-IN')}`,
    numericPrice: CATALOG_PRODUCTS[2].price,
    originalNumericPrice: CATALOG_PRODUCTS[2].originalPrice,
    stockQuantity: CATALOG_PRODUCTS[2].stockQuantity,
    size: 'L',
    colour: 'Lime Green',
    productSlug: CATALOG_PRODUCTS[2].slug,
    quantity: 1,
    image: CATALOG_PRODUCTS[2].colours[0].image,
  },
];

function parseRouteFromLocation(): {
  page: AppView;
  productSlug?: string;
} {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  let path = window.location.pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  const cleanPath = path.replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const route = cleanPath || hash;

  if (route === 'our-story' || route.startsWith('our-story')) {
    return { page: 'Our Story' };
  }
  if (route === 'custom-designs' || route.startsWith('custom-designs')) {
    return { page: 'Custom Designs' };
  }
  if (
    route === 'contact' ||
    route === 'contact-us' ||
    route.startsWith('contact')
  ) {
    return { page: 'Contact' };
  }
  if (route === 'collections' || route.startsWith('collections')) {
    return { page: 'Collections' };
  }
  if (route === 'bag' || route === 'cart') {
    return { page: 'Bag' };
  }
  if (route === 'checkout') {
    return { page: 'Checkout' };
  }
  if (route.startsWith('product/')) {
    const rawSlug = route.replace('product/', '');
    const mappedSlug =
      rawSlug === 'women-cotton-silk-kurta-salwar-dupatta-set'
        ? CATALOG_PRODUCTS[0].slug
        : rawSlug === 'women-silk-blend-kurti-palazzo-attached-dupatta-set'
        ? CATALOG_PRODUCTS[1].slug
        : rawSlug === 'women-pure-silk-kurta-palazzo-set'
        ? CATALOG_PRODUCTS[2].slug
        : rawSlug === 'women-georgette-kurta-pant-dupatta-set'
        ? CATALOG_PRODUCTS[3].slug
        : rawSlug === 'nishat-lavender-silk-kurta-set'
        ? CATALOG_PRODUCTS[4].slug
        : rawSlug === 'verinag-emerald-chinar-kurta-set'
        ? CATALOG_PRODUCTS[5].slug
        : rawSlug === 'shalimar-ivory-botanical-pheran-set'
        ? CATALOG_PRODUCTS[6].slug
        : rawSlug === 'pahalgam-peach-organza-zari-palazzo-set'
        ? CATALOG_PRODUCTS[7].slug
        : rawSlug === 'midnight-tilla-velvet-pant-set'
        ? CATALOG_PRODUCTS[8].slug
        : rawSlug === 'kokernag-sapphire-georgette-pant-set'
        ? CATALOG_PRODUCTS[9].slug
        : rawSlug;
    const validSlug = CATALOG_PRODUCTS.some((p) => p.slug === mappedSlug)
      ? mappedSlug
      : CATALOG_PRODUCTS[0].slug;
    return { page: 'ProductDetails', productSlug: validSlug };
  }
  return { page: 'Home' };
}

function getPathForPage(page: AppView, productSlug?: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  let subpath = '';
  switch (page) {
    case 'Our Story':
      subpath = '/our-story';
      break;
    case 'Custom Designs':
      subpath = '/custom-designs';
      break;
    case 'Contact':
      subpath = '/contact';
      break;
    case 'Collections':
      subpath = '/collections';
      break;
    case 'Bag':
      subpath = '/bag';
      break;
    case 'Checkout':
      subpath = '/checkout';
      break;
    case 'OrderConfirmation':
      subpath = '/checkout';
      break;
    case 'ProductDetails':
      subpath = productSlug ? `/product/${productSlug}` : '/collections';
      break;
    case 'Home':
    default:
      subpath = '/';
      break;
  }
  return `${base}${subpath}` || '/';
}

export default function App() {
  const initialRoute = parseRouteFromLocation();
  const [currentPage, setCurrentPage] = useState<AppView>(initialRoute.page);
  const [signInOpen, setSignInOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        const mapped = parsed
          .map((id) =>
            id === 'women-cotton-silk-kurta-salwar-dupatta-set'
              ? CATALOG_PRODUCTS[0].id
              : id === 'women-silk-blend-kurti-palazzo-attached-dupatta-set'
              ? CATALOG_PRODUCTS[1].id
              : id === 'women-pure-silk-kurta-palazzo-set'
              ? CATALOG_PRODUCTS[2].id
              : id === 'women-georgette-kurta-pant-dupatta-set'
              ? CATALOG_PRODUCTS[3].id
              : id === 'nishat-lavender-silk-kurta-set'
              ? CATALOG_PRODUCTS[4].id
              : id === 'verinag-emerald-chinar-kurta-set'
              ? CATALOG_PRODUCTS[5].id
              : id === 'shalimar-ivory-botanical-pheran-set'
              ? CATALOG_PRODUCTS[6].id
              : id === 'pahalgam-peach-organza-zari-palazzo-set'
              ? CATALOG_PRODUCTS[7].id
              : id === 'midnight-tilla-velvet-pant-set'
              ? CATALOG_PRODUCTS[8].id
              : id === 'kokernag-sapphire-georgette-pant-set'
              ? CATALOG_PRODUCTS[9].id
              : id
          )
          .filter((id) => CATALOG_PRODUCTS.some((p) => p.id === id));
        return Array.from(new Set(mapped));
      }
    } catch {
      // ignore storage errors
    }
    return [CATALOG_PRODUCTS[0].id, CATALOG_PRODUCTS[1].id];
  });

  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(BAG_STORAGE_KEY);
      if (saved) {
        const parsed: BagItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          if (
            item.productId === 'women-cotton-silk-kurta-salwar-dupatta-set' ||
            item.productSlug === 'women-cotton-silk-kurta-salwar-dupatta-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[0].id}__Pink__${item.size || 'M'}`,
              productId: CATALOG_PRODUCTS[0].id,
              name: CATALOG_PRODUCTS[0].name,
              variant: `Pink | ${item.size || 'M'}`,
              colour: 'Pink',
              productSlug: CATALOG_PRODUCTS[0].slug,
              image: CATALOG_PRODUCTS[0].colours[0].image,
            };
          }
          if (
            item.productId ===
              'women-silk-blend-kurti-palazzo-attached-dupatta-set' ||
            item.productSlug ===
              'women-silk-blend-kurti-palazzo-attached-dupatta-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[1].id}__Teal__${item.size || 'S'}`,
              productId: CATALOG_PRODUCTS[1].id,
              name: CATALOG_PRODUCTS[1].name,
              variant: `Teal | ${item.size || 'S'}`,
              colour: 'Teal',
              productSlug: CATALOG_PRODUCTS[1].slug,
              image: CATALOG_PRODUCTS[1].colours[0].image,
            };
          }
          if (
            item.productId === 'women-pure-silk-kurta-palazzo-set' ||
            item.productSlug === 'women-pure-silk-kurta-palazzo-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[2].id}__Lime Green__${item.size || 'L'}`,
              productId: CATALOG_PRODUCTS[2].id,
              name: CATALOG_PRODUCTS[2].name,
              variant: `Lime Green | ${item.size || 'L'}`,
              colour: 'Lime Green',
              productSlug: CATALOG_PRODUCTS[2].slug,
              image: CATALOG_PRODUCTS[2].colours[0].image,
            };
          }
          if (
            item.productId === 'women-georgette-kurta-pant-dupatta-set' ||
            item.productSlug === 'women-georgette-kurta-pant-dupatta-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[3].id}__Royal Pink__${item.size || 'M'}`,
              productId: CATALOG_PRODUCTS[3].id,
              name: CATALOG_PRODUCTS[3].name,
              variant: `Royal Pink | ${item.size || 'M'}`,
              colour: 'Royal Pink',
              productSlug: CATALOG_PRODUCTS[3].slug,
              image: CATALOG_PRODUCTS[3].colours[0].image,
            };
          }
          if (
            item.productId === 'nishat-lavender-silk-kurta-set' ||
            item.productSlug === 'nishat-lavender-silk-kurta-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[4].id}__Mustard Yellow__${item.size || 'M'}`,
              productId: CATALOG_PRODUCTS[4].id,
              name: CATALOG_PRODUCTS[4].name,
              variant: `Mustard Yellow | ${item.size || 'M'}`,
              colour: 'Mustard Yellow',
              productSlug: CATALOG_PRODUCTS[4].slug,
              image: CATALOG_PRODUCTS[4].colours[0].image,
            };
          }
          if (
            item.productId === 'verinag-emerald-chinar-kurta-set' ||
            item.productSlug === 'verinag-emerald-chinar-kurta-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[5].id}__Midnight Black__${item.size || 'M'}`,
              productId: CATALOG_PRODUCTS[5].id,
              name: CATALOG_PRODUCTS[5].name,
              variant: `Midnight Black | ${item.size || 'M'}`,
              colour: 'Midnight Black',
              productSlug: CATALOG_PRODUCTS[5].slug,
              image: CATALOG_PRODUCTS[5].colours[0].image,
            };
          }
          if (
            item.productId === 'shalimar-ivory-botanical-pheran-set' ||
            item.productSlug === 'shalimar-ivory-botanical-pheran-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[6].id}__Teal & Gold__${item.size || 'M'}`,
              productId: CATALOG_PRODUCTS[6].id,
              name: CATALOG_PRODUCTS[6].name,
              variant: `Teal & Gold | ${item.size || 'M'}`,
              colour: 'Teal & Gold',
              productSlug: CATALOG_PRODUCTS[6].slug,
              image: CATALOG_PRODUCTS[6].colours[0].image,
            };
          }
          if (
            item.productId === 'pahalgam-peach-organza-zari-palazzo-set' ||
            item.productSlug === 'pahalgam-peach-organza-zari-palazzo-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[7].id}__Maroon & Gold__${item.size || 'S'}`,
              productId: CATALOG_PRODUCTS[7].id,
              name: CATALOG_PRODUCTS[7].name,
              variant: `Maroon & Gold | ${item.size || 'S'}`,
              colour: 'Maroon & Gold',
              productSlug: CATALOG_PRODUCTS[7].slug,
              image: CATALOG_PRODUCTS[7].colours[0].image,
            };
          }
          if (
            item.productId === 'midnight-tilla-velvet-pant-set' ||
            item.productSlug === 'midnight-tilla-velvet-pant-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[8].id}__Taupe & Silver__${item.size || 'L'}`,
              productId: CATALOG_PRODUCTS[8].id,
              name: CATALOG_PRODUCTS[8].name,
              variant: `Taupe & Silver | ${item.size || 'L'}`,
              colour: 'Taupe & Silver',
              productSlug: CATALOG_PRODUCTS[8].slug,
              image: CATALOG_PRODUCTS[8].colours[0].image,
            };
          }
          if (
            item.productId === 'kokernag-sapphire-georgette-pant-set' ||
            item.productSlug === 'kokernag-sapphire-georgette-pant-set'
          ) {
            return {
              ...item,
              id: `${CATALOG_PRODUCTS[9].id}__Mauve Lavender__${item.size || 'M'}`,
              productId: CATALOG_PRODUCTS[9].id,
              name: CATALOG_PRODUCTS[9].name,
              variant: `Mauve Lavender | ${item.size || 'M'}`,
              colour: 'Mauve Lavender',
              productSlug: CATALOG_PRODUCTS[9].slug,
              image: CATALOG_PRODUCTS[9].colours[0].image,
            };
          }
          return item;
        }).filter((item) =>
          CATALOG_PRODUCTS.some(
            (p) => p.id === item.productId || p.slug === item.productSlug
          )
        );
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_REFERENCE_BAG_ITEMS;
  });

  // Persist bag and wishlist changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems));
    } catch {
      // ignore storage errors
    }
  }, [bagItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistIds)
      );
    } catch {
      // ignore storage errors
    }
  }, [wishlistIds]);

  // Active Product Details Page state
  const [activeProductSlug, setActiveProductSlug] = useState<string>(
    initialRoute.productSlug || CATALOG_PRODUCTS[0].slug
  );
  const [activeProductColourIdx, setActiveProductColourIdx] =
    useState<number>(0);
  const [activeProductSize, setActiveProductSize] = useState<
    SizeOption | undefined
  >(CATALOG_PRODUCTS[0].defaultSize);
  const [scrollToReviewsRequest, setScrollToReviewsRequest] =
    useState<number>(0);

  // Synchronize route on browser back/forward and hash changes
  useEffect(() => {
    const handlePopState = () => {
      const current = parseRouteFromLocation();
      setCurrentPage(current.page);
      if (current.productSlug) {
        setActiveProductSlug(current.productSlug);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleToggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleHeaderWishlist = () => {
    setWishlistIds((prev) =>
      prev.length > 0 ? [] : [CATALOG_PRODUCTS[0].id]
    );
  };

  const handleAddVariantToBag = (
    product: CatalogProduct,
    colourName: string,
    size: SizeOption,
    quantity: number,
    variantImage: string
  ) => {
    const compositeId = `${product.id}__${colourName}__${size}`;
    setBagItems((prev) => {
      const existing = prev.find((item) => item.id === compositeId);
      if (existing) {
        return prev.map((item) =>
          item.id === compositeId
            ? {
                ...item,
                quantity: Math.min(
                  product.stockQuantity,
                  item.quantity + quantity
                ),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: compositeId,
          productId: product.id,
          name: product.name,
          variant: `${colourName} | ${size}`,
          price: `₹${product.price.toLocaleString('en-IN')}`,
          numericPrice: product.price,
          originalNumericPrice: product.originalPrice,
          stockQuantity: product.stockQuantity,
          size,
          colour: colourName,
          productSlug: product.slug,
          quantity,
          image: variantImage,
        },
      ];
    });
  };

  const handleUpdateBagQuantity = (id: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const maxStock = item.stockQuantity ?? 99;
          const nextQty = Math.min(maxStock, item.quantity + delta);
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleAddSampleBagItem = () => {
    const defaultProd = CATALOG_PRODUCTS[0];
    handleAddVariantToBag(
      defaultProd,
      defaultProd.colours[0].name,
      defaultProd.defaultSize,
      1,
      defaultProd.colours[0].image
    );
  };

  const handleRemoveBagItem = (id: string) => {
    setBagItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllBag = () => {
    setBagItems([]);
  };

  const handleNavigate = (page: NavItemKey) => {
    setCurrentPage(page);
    const newPath = getPathForPage(page);
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBagPage = () => {
    setCurrentPage('Bag');
    const newPath = getPathForPage('Bag');
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckoutPage = () => {
    setCurrentPage('Checkout');
    const newPath = getPathForPage('Checkout');
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (
    productSlug: string,
    colourIdx = 0,
    size?: SizeOption,
    scrollToReviews = false
  ) => {
    setActiveProductSlug(productSlug);
    setActiveProductColourIdx(colourIdx);
    setActiveProductSize(size);
    if (scrollToReviews) {
      setScrollToReviewsRequest((prev) => prev + 1);
    } else {
      setScrollToReviewsRequest(0);
    }
    setCurrentPage('ProductDetails');
    const newPath = getPathForPage('ProductDetails', productSlug);
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    if (!scrollToReviews) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-[#fcfaf6] overflow-x-clip">
      {currentPage === 'Bag' ||
      currentPage === 'Checkout' ||
      currentPage === 'OrderConfirmation' ? (
        <ShoppingBagCheckoutFlow
          initialStage={
            currentPage === 'Checkout'
              ? 'checkout'
              : currentPage === 'OrderConfirmation'
              ? 'confirmation'
              : 'bag'
          }
          bagItems={bagItems}
          onUpdateBagQuantity={handleUpdateBagQuantity}
          onRemoveBagItem={handleRemoveBagItem}
          onClearAllBag={handleClearAllBag}
          onAddSampleBagItem={handleAddSampleBagItem}
          onOpenProduct={(slug) => handleOpenProduct(slug)}
          onContinueShopping={() => {
            handleNavigate('Collections');
          }}
          onNavigate={handleNavigate}
          onOpenSignIn={() => setSignInOpen(true)}
          wishlistIds={wishlistIds}
          onToggleHeaderWishlist={handleToggleHeaderWishlist}
          onToggleWishlistItem={handleToggleWishlist}
        />
      ) : currentPage === 'Contact' || currentPage === 'Custom Designs' ? (
        <ContactPage
          isCustomDesigns={currentPage === 'Custom Designs'}
          onOpenSignIn={() => setSignInOpen(true)}
          onNavigate={handleNavigate}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (cat === 'Custom Designs') {
              handleNavigate('Custom Designs');
            } else {
              handleNavigate('Collections');
            }
          }}
          bagItems={bagItems}
          onAddSampleBagItem={handleAddSampleBagItem}
          onRemoveBagItem={handleRemoveBagItem}
          onOpenBagPage={handleOpenBagPage}
          wishlistIds={wishlistIds}
          wishlistActive={wishlistIds.length > 0}
          onToggleHeaderWishlist={handleToggleHeaderWishlist}
          onToggleWishlistItem={handleToggleWishlist}
          initialEnquiryType={
            currentPage === 'Custom Designs' ? 'Custom Design Enquiry' : ''
          }
        />
      ) : currentPage === 'Our Story' ? (
        <OurStoryPage
          onOpenSignIn={() => setSignInOpen(true)}
          onNavigate={handleNavigate}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (cat === 'Custom Designs') {
              handleNavigate('Custom Designs');
            } else {
              handleNavigate('Collections');
            }
          }}
          bagItems={bagItems}
          onAddSampleBagItem={handleAddSampleBagItem}
          onRemoveBagItem={handleRemoveBagItem}
          onOpenBagPage={handleOpenBagPage}
          wishlistIds={wishlistIds}
          wishlistActive={wishlistIds.length > 0}
          onToggleHeaderWishlist={handleToggleHeaderWishlist}
          onToggleWishlistItem={handleToggleWishlist}
        />
      ) : currentPage === 'Collections' ? (
        <ProductListingPage
          onOpenSignIn={() => setSignInOpen(true)}
          onNavigate={handleNavigate}
          onOpenProduct={handleOpenProduct}
          selectedCollectionCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          bagItems={bagItems}
          onAddVariantToBag={handleAddVariantToBag}
          onRemoveBagItem={handleRemoveBagItem}
          onUpdateBagQuantity={handleUpdateBagQuantity}
          onOpenBagPage={handleOpenBagPage}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onToggleHeaderWishlist={handleToggleHeaderWishlist}
        />
      ) : currentPage === 'ProductDetails' ? (
        <ProductDetailsPage
          productSlug={activeProductSlug}
          initialColourIdx={activeProductColourIdx}
          initialSize={activeProductSize}
          scrollToReviewsRequest={scrollToReviewsRequest}
          onClearScrollToReviews={() => setScrollToReviewsRequest(0)}
          onOpenSignIn={() => setSignInOpen(true)}
          onNavigate={handleNavigate}
          onBackToListing={(cat) => {
            if (cat) setSelectedCategory(cat);
            handleNavigate('Collections');
          }}
          onOpenProduct={handleOpenProduct}
          onSelectCategory={setSelectedCategory}
          bagItems={bagItems}
          onAddVariantToBag={handleAddVariantToBag}
          onRemoveBagItem={handleRemoveBagItem}
          onUpdateBagQuantity={handleUpdateBagQuantity}
          onOpenBagPage={handleOpenBagPage}
          onBuyNowProceedToCheckout={handleOpenCheckoutPage}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onToggleHeaderWishlist={handleToggleHeaderWishlist}
        />
      ) : (
        <>
          {/* Section 1: Existing Homepage Hero Banner */}
          <HeroBanner
            activePage="Home"
            onNavigate={handleNavigate}
            onOpenSignIn={() => setSignInOpen(true)}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              if (cat === 'Custom Designs') {
                handleNavigate('Custom Designs');
              } else {
                document
                  .getElementById('collection-catalog-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            bagItems={bagItems}
            onAddSampleBagItem={handleAddSampleBagItem}
            onRemoveBagItem={handleRemoveBagItem}
            onOpenBagPage={handleOpenBagPage}
            wishlistIds={wishlistIds}
            wishlistActive={wishlistIds.length > 0}
            onToggleHeaderWishlist={handleToggleHeaderWishlist}
            onToggleWishlistItem={handleToggleWishlist}
          />

          {/* Section 2: Product Collection Listing (Shared with Collections Page) + Shared Footer */}
          <ProductListingPage
            embeddedInHomepage={true}
            onOpenSignIn={() => setSignInOpen(true)}
            onNavigate={handleNavigate}
            onOpenProduct={handleOpenProduct}
            selectedCollectionCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            bagItems={bagItems}
            onAddVariantToBag={handleAddVariantToBag}
            onRemoveBagItem={handleRemoveBagItem}
            onUpdateBagQuantity={handleUpdateBagQuantity}
            onOpenBagPage={handleOpenBagPage}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onToggleHeaderWishlist={handleToggleHeaderWishlist}
          />
        </>
      )}

      {/* Sign In Modal */}
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
    </main>
  );
}
