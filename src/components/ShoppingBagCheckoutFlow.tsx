import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Check,
  Copy,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { BagItem } from '../data/heroSlides';
import { getAssetUrl } from '../utils/assetPath';
import { NavItemKey } from './Header';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface PlacedOrderRecord {
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  items: BagItem[];
  subtotal: number;
  discountTotal: number;
  shippingCharge: number;
  finalTotal: number;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: string;
  address: ShippingAddress;
}

interface ShoppingBagCheckoutFlowProps {
  mode?: 'bag' | 'checkout' | 'confirmation';
  initialStage?: 'bag' | 'checkout' | 'confirmation';
  onChangeMode?: (mode: 'bag' | 'checkout' | 'confirmation') => void;
  onCloseOrContinueShopping?: () => void;
  onContinueShopping?: () => void;
  bagItems: BagItem[];
  onUpdateBagQuantity: (id: string, delta: number) => void;
  onRemoveBagItem: (id: string) => void;
  onClearBag?: () => void;
  onClearAllBag?: () => void;
  onAddSampleBagItem?: () => void;
  onOrderPlaced?: (order: PlacedOrderRecord) => void;
  lastPlacedOrder?: PlacedOrderRecord | null;
  onOpenProduct?: (slug: string) => void;
  onNavigate?: (page: NavItemKey) => void;
  onOpenSignIn?: () => void;
  wishlistIds?: string[];
  wishlistActive?: boolean;
  onToggleHeaderWishlist?: () => void;
  onToggleWishlistItem?: (id: string) => void;
}

const DEFAULT_SAVED_ADDRESSES: ShippingAddress[] = [
  {
    fullName: 'Raaj Armaani',
    phone: '+91 98765 43210',
    email: 'raajarmaani18@gmail.com',
    house: '123, Green Park',
    street: 'Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '500034',
  },
  {
    fullName: 'Raaj Armaani',
    phone: '+91 98765 43210',
    email: 'raajarmaani18@gmail.com',
    house: '42, Residency Road',
    street: 'Regal Chowk',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    pinCode: '190001',
  },
];

export const ShoppingBagCheckoutFlow: React.FC<
  ShoppingBagCheckoutFlowProps
> = ({
  mode,
  initialStage,
  onChangeMode,
  onCloseOrContinueShopping,
  onContinueShopping,
  bagItems,
  onUpdateBagQuantity,
  onRemoveBagItem,
  onClearBag,
  onClearAllBag,
  onAddSampleBagItem: _onAddSampleBagItem,
  onOrderPlaced,
  lastPlacedOrder,
  onOpenProduct,
  onNavigate: _onNavigate,
  onOpenSignIn: _onOpenSignIn,
  wishlistIds: _wishlistIds,
  wishlistActive: _wishlistActive,
  onToggleHeaderWishlist: _onToggleHeaderWishlist,
  onToggleWishlistItem: _onToggleWishlistItem,
}) => {
  const [internalMode, setInternalMode] = useState<'bag' | 'checkout' | 'confirmation'>(
    mode ?? initialStage ?? 'bag'
  );

  useEffect(() => {
    if (mode) {
      setInternalMode(mode);
    } else if (initialStage) {
      setInternalMode(initialStage);
    }
  }, [mode, initialStage]);

  const activeMode = mode ?? internalMode;

  const handleModeChange = (nextMode: 'bag' | 'checkout' | 'confirmation') => {
    setInternalMode(nextMode);
    onChangeMode?.(nextMode);
  };

  const handleContinueShopping = () => {
    if (onContinueShopping) onContinueShopping();
    else if (onCloseOrContinueShopping) onCloseOrContinueShopping();
  };

  const handleClearBag = () => {
    if (onClearBag) onClearBag();
    if (onClearAllBag) onClearAllBag();
  };
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>(
    DEFAULT_SAVED_ADDRESSES
  );
  const [selectedAddressIdx, setSelectedAddressIdx] = useState<number>(0);
  const [editingAddress, setEditingAddress] = useState<boolean>(false);
  const [addressForm, setAddressForm] = useState<ShippingAddress>(
    DEFAULT_SAVED_ADDRESSES[0]
  );
  const [addressError, setAddressError] = useState<string>('');

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>(
    'standard'
  );
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'atelier_invoice'>(
    'cod'
  );
  const [copiedOrderNum, setCopiedOrderNum] = useState(false);
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);

  const activeAddress =
    savedAddresses[selectedAddressIdx] ?? savedAddresses[0];

  const totalItemCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = bagItems.reduce((sum, item) => {
    const unit =
      item.numericPrice ??
      (Number(String(item.price).replace(/[^0-9.]/g, '')) || 0);
    return sum + unit * item.quantity;
  }, 0);

  const originalTotal = bagItems.reduce((sum, item) => {
    const unit =
      item.numericPrice ??
      (Number(String(item.price).replace(/[^0-9.]/g, '')) || 0);
    const orig = item.originalNumericPrice ?? unit;
    return sum + orig * item.quantity;
  }, 0);

  const discountTotal = Math.max(0, originalTotal - subtotal);
  const shippingCharge = deliveryMethod === 'standard' ? 0 : 149;
  const finalTotal = subtotal + shippingCharge;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addressForm.fullName.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.email.trim() ||
      !addressForm.house.trim() ||
      !addressForm.street.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !/^\d{5,6}$/.test(addressForm.pinCode.trim())
    ) {
      setAddressError(
        'Please fill in all address fields and a valid 6-digit PIN code.'
      );
      return;
    }
    setAddressError('');
    setSavedAddresses((prev) => {
      const updated = [...prev];
      updated[selectedAddressIdx] = { ...addressForm };
      return updated;
    });
    setEditingAddress(false);
  };

  const handlePlaceOrder = () => {
    if (bagItems.length === 0) return;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const randomSuffix = String(Math.floor(1000 + Math.random() * 9000));
    const orderNumber = `SHF-${y}${m}${d}-${randomSuffix}`;

    const orderRecord: PlacedOrderRecord = {
      orderNumber,
      orderDate: now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      estimatedDelivery:
        deliveryMethod === 'standard'
          ? '5-7 Business Days'
          : '2-3 Business Days',
      items: [...bagItems],
      subtotal,
      discountTotal,
      shippingCharge,
      finalTotal,
      deliveryMethod,
      paymentMethod:
        paymentMethod === 'cod'
          ? 'Cash / Pay on Delivery (Verified Dispatch)'
          : 'Atelier Direct Invoice & Concierge Confirmation',
      address: activeAddress,
    };

    onOrderPlaced?.(orderRecord);
    handleModeChange('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyOrderNumber = (orderNum: string) => {
    navigator.clipboard?.writeText(orderNum);
    setCopiedOrderNum(true);
    window.setTimeout(() => setCopiedOrderNum(false), 1800);
  };

  // ===========================================================================
  // SCREEN 8 — SHOPPING BAG ("My Bag")
  // ===========================================================================
  if (activeMode === 'bag') {
    return (
      <div className="min-h-screen w-full bg-[#fcf9f5] flex flex-col justify-between">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-5 pb-32 flex-1">
          {/* Top Header Row: Back + My Bag (X items) + Clear All */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ece3da]">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleContinueShopping}
                aria-label="Back to shopping"
                className="w-9 h-9 rounded-full bg-white border border-[#e6ddd3] flex items-center justify-center text-[#141824] hover:text-[#f81d5c] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141824]">
                My Bag{' '}
                <span className="font-ui text-base sm:text-lg font-medium text-[#57524e]">
                  ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                </span>
              </h1>
            </div>

            {bagItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearBag}
                className="font-ui text-xs sm:text-sm font-semibold text-[#f81d5c] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {bagItems.length === 0 ? (
            <div className="mt-12 rounded-3xl bg-white border border-[#ece3da] p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#fdecef] text-[#f81d5c] mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#141824]">
                Your Shopping Bag is Empty
              </h2>
              <p className="font-ui text-xs sm:text-sm text-[#6e6862] max-w-sm mx-auto">
                Explore our handcrafted Kashmiri kurtas, silk suits, and Aari
                embroidered ensembles to add your favourites.
              </p>
              <button
                type="button"
                onClick={handleContinueShopping}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f81d5c] hover:bg-[#e0144f] text-white font-ui text-xs sm:text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List matching Screen 8 */}
              <div className="mt-4 space-y-3.5">
                {bagItems.map((item) => {
                  const unitPrice =
                    item.numericPrice ??
                    (Number(String(item.price).replace(/[^0-9.]/g, '')) || 0);
                  const origPrice = item.originalNumericPrice;
                  const maxStock = item.stockQuantity ?? 15;
                  const variantDisplay =
                    item.colour && item.size
                      ? `${item.colour} | ${item.size}`
                      : item.variant;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white border border-[#ece3da] p-3 sm:p-4 flex items-center gap-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                    >
                      {/* Thumbnail */}
                      <button
                        type="button"
                        onClick={() => {
                          if (item.productSlug && onOpenProduct) {
                            onOpenProduct(item.productSlug);
                          }
                        }}
                        className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-[#f4ede6] shrink-0 border border-[#ebe2d8] cursor-pointer"
                      >
                        <img
                          src={getAssetUrl(item.image)}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </button>

                      {/* Product Info & Controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-ui text-xs sm:text-sm font-bold text-[#141824] line-clamp-2 leading-snug">
                              {item.name}
                            </h3>
                            <p className="font-ui text-[11px] sm:text-xs text-[#6e6862] mt-0.5">
                              {variantDisplay}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          {/* Selling Price + Strikethrough Original Price */}
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-ui text-sm sm:text-base font-extrabold text-[#121829] tabular-nums">
                              ₹{unitPrice.toLocaleString('en-IN')}
                            </span>
                            {origPrice && origPrice > unitPrice && (
                              <span className="font-ui text-[11px] text-[#9a948e] line-through tabular-nums">
                                ₹{origPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {/* Quantity Stepper + Remove Icon matching Screen 8 */}
                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center h-7 sm:h-8 rounded-lg bg-[#fcf9f5] border border-[#e2dad1]">
                              <button
                                type="button"
                                onClick={() => onUpdateBagQuantity(item.id, -1)}
                                aria-label="Decrease quantity"
                                className="w-7 h-full flex items-center justify-center text-[#3a3633] hover:text-[#f81d5c] cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-ui text-xs font-bold text-[#141824] tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateBagQuantity(item.id, 1)}
                                disabled={item.quantity >= maxStock}
                                aria-label="Increase quantity"
                                className="w-7 h-full flex items-center justify-center text-[#3a3633] hover:text-[#f81d5c] disabled:opacity-35 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveBagItem(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#78726d] hover:text-[#f81d5c] hover:bg-[#fdecef] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown Card */}
              <div className="mt-6 rounded-2xl bg-white border border-[#ece3da] p-4 sm:p-5 space-y-2.5 font-ui text-xs sm:text-sm">
                {discountTotal > 0 && (
                  <>
                    <div className="flex justify-between text-[#6e6862]">
                      <span>Total MRP</span>
                      <span className="tabular-nums">
                        ₹{originalTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#15803d] font-medium">
                      <span>Bag Discount</span>
                      <span className="tabular-nums">
                        −₹{discountTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-[#6e6862]">
                  <span>Shipping Charge</span>
                  <span className="text-[#15803d] font-semibold">FREE</span>
                </div>
                <div className="pt-2.5 border-t border-[#efe6dd] flex items-baseline justify-between">
                  <span className="font-bold text-[#141824]">
                    Subtotal{' '}
                    <span className="font-normal text-[#6e6862]">
                      ({totalItemCount}{' '}
                      {totalItemCount === 1 ? 'item' : 'items'})
                    </span>
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-[#121829] tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Bottom Proceed to Checkout Bar matching Screen 8 */}
        {bagItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8dfd5] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                  Subtotal{' '}
                  <span className="font-normal text-[#6e6862]">
                    ({totalItemCount}{' '}
                    {totalItemCount === 1 ? 'item' : 'items'})
                  </span>
                </span>
                <span className="font-ui text-base sm:text-lg font-extrabold text-[#121829] tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep(1);
                  handleModeChange('checkout');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] hover:from-[#e0144f] hover:to-[#eb1e5c] text-white font-ui text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(248,29,92,0.3)] transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===========================================================================
  // SCREEN 9 — STEP-BASED CHECKOUT (1 Address -> 2 Payment -> 3 Review)
  // ===========================================================================
  if (activeMode === 'checkout') {
    return (
      <div className="min-h-screen w-full bg-[#fcf9f5] flex flex-col justify-between">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-5 pb-32 flex-1">
          {/* Checkout Top Bar */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#ece3da]">
            <button
              type="button"
              onClick={() => {
                if (checkoutStep > 1) {
                  setCheckoutStep((prev) => (prev - 1) as 1 | 2 | 3);
                } else {
                  handleModeChange('bag');
                }
              }}
              aria-label="Back"
              className="w-9 h-9 rounded-full bg-white border border-[#e6ddd3] flex items-center justify-center text-[#141824] hover:text-[#f81d5c] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141824]">
              Checkout
            </h1>
          </div>

          {/* 3-Step Indicator Bar matching Screen 9: (1) Address - (2) Payment - (3) Review */}
          <div className="mt-4 mb-6 rounded-2xl bg-white border border-[#ece3da] px-4 py-3 flex items-center justify-between">
            {[
              { step: 1 as const, label: 'Address' },
              { step: 2 as const, label: 'Payment' },
              { step: 3 as const, label: 'Review' },
            ].map((s, idx) => {
              const isCurrent = checkoutStep === s.step;
              const isCompleted = checkoutStep > s.step;
              return (
                <React.Fragment key={s.step}>
                  <button
                    type="button"
                    onClick={() => {
                      if (s.step <= checkoutStep) setCheckoutStep(s.step);
                    }}
                    className="inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                        isCurrent || isCompleted
                          ? 'bg-[#f81d5c] text-white'
                          : 'bg-[#f1eae2] text-[#78726d]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.step}
                    </span>
                    <span
                      className={`font-ui text-xs sm:text-sm ${
                        isCurrent
                          ? 'font-bold text-[#141824]'
                          : isCompleted
                          ? 'font-semibold text-[#f81d5c]'
                          : 'font-medium text-[#8a837c]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {idx < 2 && (
                    <span className="flex-1 h-[1px] bg-[#e5dcd2] mx-2 sm:mx-4" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* STEP 1: ADDRESS & DELIVERY METHOD */}
          {checkoutStep === 1 && (
            <div className="space-y-5">
              {/* Shipping Address Header */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h2 className="font-ui text-sm font-bold text-[#141824]">
                    Shipping Address
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setAddressForm(activeAddress);
                      setEditingAddress((prev) => !prev);
                    }}
                    className="font-ui text-xs font-semibold text-[#f81d5c] hover:underline cursor-pointer"
                  >
                    {editingAddress ? 'Cancel' : 'Change'}
                  </button>
                </div>

                {!editingAddress ? (
                  <div className="space-y-2.5">
                    <div className="rounded-2xl bg-white border border-[#ece3da] p-4 shadow-2xs">
                      <p className="font-ui text-sm font-bold text-[#141824]">
                        {activeAddress.fullName}
                      </p>
                      <p className="font-ui text-xs text-[#57524e] mt-1 leading-relaxed">
                        {activeAddress.house}, {activeAddress.street}
                        <br />
                        {activeAddress.city}, {activeAddress.state}{' '}
                        {activeAddress.pinCode}
                      </p>
                      <p className="font-ui text-xs text-[#57524e] mt-1">
                        {activeAddress.phone} · {activeAddress.email}
                      </p>
                    </div>

                    {/* Saved Address Switcher */}
                    {savedAddresses.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {savedAddresses.map((addr, idx) => (
                          <button
                            key={`${addr.city}-${idx}`}
                            type="button"
                            onClick={() => setSelectedAddressIdx(idx)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap shrink-0 cursor-pointer ${
                              selectedAddressIdx === idx
                                ? 'bg-[#fdecef] border-[#f81d5c] text-[#f81d5c] font-semibold'
                                : 'bg-white border-[#e2dad1] text-[#57524e]'
                            }`}
                          >
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {addr.city} ({addr.pinCode})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={handleSaveAddress}
                    className="rounded-2xl bg-white border border-[#ece3da] p-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-ui text-[11px] font-semibold text-[#4a4542] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={addressForm.fullName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl border border-[#dfd7ce] text-xs text-[#141824] focus:outline-none focus:border-[#f81d5c]"
                        />
                      </div>
                      <div>
                        <label className="block font-ui text-[11px] font-semibold text-[#4a4542] mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl border border-[#dfd7ce] text-xs text-[#141824] focus:outline-none focus:border-[#f81d5c]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-ui text-[11px] font-semibold text-[#4a4542] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={addressForm.email}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-[#dfd7ce] text-xs text-[#141824] focus:outline-none focus:border-[#f81d5c]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-ui text-[11px] font-semibold text-[#4a4542] mb-1">
                          House / Apartment *
                        </label>
                        <input
                          type="text"
                          value={addressForm.house}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              house: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl border border-[#dfd7ce] text-xs text-[#141824] focus:outline-none focus:border-[#f81d5c]"
                        />
                      </div>
                      <div>
                        <label className="block font-ui text-[11px] font-semibold text-[#4a4542] mb-1">
                          Street / Locality *
                        </label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              street: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl border border-[#dfd7ce] text-xs text-[#141824] focus:outline-none focus:border-[#f81d5c]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block font-ui text-[11px] font-semibold text-[#4a4542] mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl border border-[#dfd7ce] text-xs text-[#141824] focus:outline-none focus:border-[#f81d5c]"
                        />
                      </div>
                      <div>
                        <label className="block font-ui text-[11px] font-semibold text-[#4a4542] mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              state: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl border border-[#dfd7ce] text-xs text-[#141824] focus:outline-none focus:border-[#f81d5c]"
                        />
                      </div>
                      <div>
                        <label className="block font-ui text-[11px] font-semibold text-[#4a4542] mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={addressForm.pinCode}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              pinCode: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-xl border border-[#dfd7ce] text-xs text-[#141824] focus:outline-none focus:border-[#f81d5c]"
                        />
                      </div>
                    </div>

                    {addressError && (
                      <p className="font-ui text-xs font-semibold text-[#e11d48]">
                        {addressError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full h-10 rounded-full bg-[#f81d5c] text-white font-ui text-xs font-semibold hover:bg-[#e0144f] transition-colors cursor-pointer"
                    >
                      Save Shipping Address
                    </button>
                  </form>
                )}
              </div>

              {/* Delivery Method matching Screen 9 */}
              <div>
                <h2 className="font-ui text-sm font-bold text-[#141824] mb-2.5">
                  Delivery Method
                </h2>
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('standard')}
                    className={`w-full rounded-2xl p-3.5 flex items-center justify-between border text-left transition-all cursor-pointer ${
                      deliveryMethod === 'standard'
                        ? 'bg-[#fff5f7] border-[#f81d5c] shadow-2xs'
                        : 'bg-white border-[#ece3da]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          deliveryMethod === 'standard'
                            ? 'border-[#f81d5c]'
                            : 'border-[#b5ada5]'
                        }`}
                      >
                        {deliveryMethod === 'standard' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f81d5c]" />
                        )}
                      </span>
                      <div>
                        <p className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                          Free Shipping
                        </p>
                        <p className="font-ui text-[11px] text-[#6e6862]">
                          5–7 business days
                        </p>
                      </div>
                    </div>
                    <span className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                      ₹0
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('express')}
                    className={`w-full rounded-2xl p-3.5 flex items-center justify-between border text-left transition-all cursor-pointer ${
                      deliveryMethod === 'express'
                        ? 'bg-[#fff5f7] border-[#f81d5c] shadow-2xs'
                        : 'bg-white border-[#ece3da]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          deliveryMethod === 'express'
                            ? 'border-[#f81d5c]'
                            : 'border-[#b5ada5]'
                        }`}
                      >
                        {deliveryMethod === 'express' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f81d5c]" />
                        )}
                      </span>
                      <div>
                        <p className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                          Priority Insured Air Dispatch
                        </p>
                        <p className="font-ui text-[11px] text-[#6e6862]">
                          2–3 business days
                        </p>
                      </div>
                    </div>
                    <span className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                      ₹149
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {checkoutStep === 2 && (
            <div className="space-y-4">
              <h2 className="font-ui text-sm font-bold text-[#141824]">
                Select Payment Method
              </h2>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full rounded-2xl p-4 flex items-start gap-3 border text-left transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-[#fff5f7] border-[#f81d5c] shadow-2xs'
                      : 'bg-white border-[#ece3da]'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMethod === 'cod'
                        ? 'border-[#f81d5c]'
                        : 'border-[#b5ada5]'
                    }`}
                  >
                    {paymentMethod === 'cod' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f81d5c]" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                        Cash / Pay on Delivery (COD)
                      </p>
                      <ShieldCheck className="w-4 h-4 text-[#f81d5c]" />
                    </div>
                    <p className="font-ui text-[11px] text-[#57524e] mt-1 leading-relaxed">
                      Place your confirmed order now and pay via Cash or UPI
                      upon doorstep delivery. No online card charge is simulated.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('atelier_invoice')}
                  className={`w-full rounded-2xl p-4 flex items-start gap-3 border text-left transition-all cursor-pointer ${
                    paymentMethod === 'atelier_invoice'
                      ? 'bg-[#fff5f7] border-[#f81d5c] shadow-2xs'
                      : 'bg-white border-[#ece3da]'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMethod === 'atelier_invoice'
                        ? 'border-[#f81d5c]'
                        : 'border-[#b5ada5]'
                    }`}
                  >
                    {paymentMethod === 'atelier_invoice' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f81d5c]" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                        Srinagar Atelier Direct Reservation
                      </p>
                      <CreditCard className="w-4 h-4 text-[#f81d5c]" />
                    </div>
                    <p className="font-ui text-[11px] text-[#57524e] mt-1 leading-relaxed">
                      Reserve your handcrafted pieces immediately; our team will
                      share an official invoice link on {activeAddress.email}.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW ORDER */}
          {checkoutStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-[#ece3da] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-ui text-xs font-bold text-[#141824]">
                    Delivering To
                  </span>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="font-ui text-xs font-semibold text-[#f81d5c] cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-ui text-xs text-[#4a4542]">
                  <strong>{activeAddress.fullName}</strong> ·{' '}
                  {activeAddress.house}, {activeAddress.street},{' '}
                  {activeAddress.city}, {activeAddress.state}{' '}
                  {activeAddress.pinCode} ({activeAddress.phone})
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#ece3da] p-4 space-y-3">
                <h3 className="font-ui text-xs font-bold text-[#141824]">
                  Items in Order ({totalItemCount})
                </h3>
                {bagItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 pt-2 border-t border-[#f3ece4] first:border-t-0 first:pt-0"
                  >
                    <img
                      src={getAssetUrl(item.image)}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 rounded-lg object-cover object-top shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-ui text-xs font-bold text-[#141824] truncate">
                        {item.name}
                      </p>
                      <p className="font-ui text-[11px] text-[#6e6862]">
                        {item.colour && item.size
                          ? `Colour: ${item.colour} · Size: ${item.size}`
                          : item.variant}{' '}
                        · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-ui text-xs font-bold text-[#121829] tabular-nums">
                      ₹
                      {(
                        (item.numericPrice ??
                          (Number(String(item.price).replace(/[^0-9.]/g, '')) ||
                            0)) * item.quantity
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary Block matching Screen 9 */}
          <div className="mt-6 rounded-2xl bg-white border border-[#ece3da] p-4 space-y-2 font-ui text-xs sm:text-sm">
            <h3 className="font-bold text-[#141824] pb-1">Order Summary</h3>
            <div className="flex justify-between text-[#57524e]">
              <span>Items ({totalItemCount})</span>
              <span className="tabular-nums font-medium text-[#141824]">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-[#15803d]">
                <span>Sale Savings</span>
                <span className="tabular-nums font-medium">
                  −₹{discountTotal.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[#57524e]">
              <span>Shipping</span>
              <span className="tabular-nums font-medium text-[#141824]">
                ₹{shippingCharge}
              </span>
            </div>
            <div className="pt-2.5 border-t border-[#efe6dd] flex justify-between text-sm sm:text-base font-extrabold text-[#121829]">
              <span>Total</span>
              <span className="tabular-nums">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Step Action Button matching Screen 9 */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8dfd5] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="max-w-2xl mx-auto">
            {checkoutStep === 1 && (
              <button
                type="button"
                onClick={() => {
                  if (editingAddress) {
                    setAddressError(
                      'Please save your shipping address before continuing.'
                    );
                    return;
                  }
                  setCheckoutStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] hover:from-[#e0144f] hover:to-[#eb1e5c] text-white font-ui text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(248,29,92,0.3)] transition-all cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {checkoutStep === 2 && (
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep(3);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] hover:from-[#e0144f] hover:to-[#eb1e5c] text-white font-ui text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(248,29,92,0.3)] transition-all cursor-pointer"
              >
                <span>Review Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {checkoutStep === 3 && (
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] hover:from-[#e0144f] hover:to-[#eb1e5c] text-white font-ui text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(248,29,92,0.3)] transition-all cursor-pointer"
              >
                <span>Place Order · ₹{finalTotal.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // SCREEN 10 — ORDER CONFIRMATION ("Order Placed Successfully!")
  // ===========================================================================
  const order: PlacedOrderRecord = lastPlacedOrder ?? {
    orderNumber: 'SHF-20251030-0014',
    orderDate: 'October 30, 2025',
    estimatedDelivery: '5-7 Business Days',
    items:
      bagItems.length > 0
        ? bagItems
        : [
            {
              id: 'sample-order-item',
              name: 'Women Cotton Silk Kurta Salwar Dupatta Set',
              variant: 'Black / M',
              price: '₹808',
              image: getAssetUrl('assets/aistudio/plp_card_1_black.png'),
              quantity: 1,
              colour: 'Black',
              size: 'M',
            },
          ],
    subtotal: subtotal || 808,
    discountTotal: discountTotal || 0,
    shippingCharge: 0,
    finalTotal: finalTotal || 808,
    deliveryMethod: 'standard',
    paymentMethod: 'Cash / Pay on Delivery (Verified Dispatch)',
    address: activeAddress,
  };

  return (
    <div className="min-h-screen w-full bg-[#fcf9f5] flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#ece3da] shadow-[0_12px_40px_rgba(24,24,27,0.06)] p-6 sm:p-8 text-center overflow-hidden">
        {/* Decorative Pastel Confetti Petals matching Screen 10 */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none flex justify-center gap-6 mb-2 opacity-80"
        >
          <Sparkles className="w-4 h-4 text-[#f89bb4] -rotate-12" />
          <Sparkles className="w-3.5 h-3.5 text-[#f81d5c] rotate-12" />
          <Sparkles className="w-4 h-4 text-[#f89bb4] rotate-45" />
        </div>

        {/* Green Checkmark Circle */}
        <div className="w-16 h-16 rounded-full bg-[#16a34a] text-white mx-auto flex items-center justify-center shadow-[0_8px_24px_rgba(22,163,74,0.32)]">
          <Check className="w-8 h-8 stroke-[2.8]" />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="mt-5 font-editorial text-2xl sm:text-3xl font-bold text-[#141824]">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 font-ui text-xs sm:text-sm text-[#57524e] leading-relaxed">
          Thank you for shopping with Shafiya
          <br />
          Kashmiri Designs.
        </p>

        {/* Order Number & Estimated Delivery Card matching Screen 10 */}
        {order && (
          <div className="mt-6 rounded-2xl bg-[#fcf9f5] border border-[#ece3da] p-4 text-left space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebe2d9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#e5ddd4] flex items-center justify-center text-[#141824]">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-ui text-[11px] text-[#78726d]">
                    Order Number
                  </p>
                  <p className="font-ui text-xs sm:text-sm font-bold text-[#141824] tabular-nums">
                    {order.orderNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyOrderNumber(order.orderNumber)}
                aria-label="Copy order number"
                className="p-2 rounded-lg text-[#6e6862] hover:text-[#f81d5c] hover:bg-white transition-colors cursor-pointer"
              >
                {copiedOrderNum ? (
                  <Check className="w-4 h-4 text-[#16a34a]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#e5ddd4] flex items-center justify-center text-[#141824]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-ui text-[11px] text-[#78726d]">
                    Estimated Delivery
                  </p>
                  <p className="font-ui text-xs sm:text-sm font-bold text-[#141824]">
                    {order.estimatedDelivery}
                  </p>
                </div>
              </div>
              <span className="font-ui text-[11px] text-[#78726d]">
                {order.orderDate}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons matching Screen 10 */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => setOrderDetailsModalOpen(true)}
            className="w-full h-11 rounded-full bg-white hover:bg-[#fff2f6] text-[#f81d5c] border border-[#f81d5c] font-ui text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            View Order Details
          </button>

          <button
            type="button"
            onClick={handleContinueShopping}
            className="w-full h-11 rounded-full bg-gradient-to-r from-[#f81d5c] to-[#ff2e6c] hover:from-[#e0144f] hover:to-[#eb1e5c] text-white font-ui text-xs sm:text-sm font-semibold shadow-[0_6px_18px_rgba(248,29,92,0.28)] transition-all cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* View Order Details Centred Modal */}
      {orderDetailsModalOpen && order && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Order Details"
          onClick={() => setOrderDetailsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-[380px] max-h-[80dvh] rounded-3xl bg-[#fcf9f5] border border-[#eadfd5] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-5 py-3.5 bg-white border-b border-[#efe6dd] flex items-center justify-between shrink-0">
              <div>
                <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-[#f81d5c]">
                  ORDER RECEIPT
                </p>
                <h3 className="font-editorial text-xl font-bold text-[#141824]">
                  {order.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOrderDetailsModalOpen(false)}
                aria-label="Close order details"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6e6862] hover:bg-[#f4ece4] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 font-ui text-xs">
              <div className="rounded-2xl bg-white border border-[#ece3da] p-3.5 space-y-1">
                <p className="font-bold text-[#141824]">Shipping Address</p>
                <p className="text-[#57524e]">
                  {order.address.fullName} · {order.address.phone}
                </p>
                <p className="text-[#57524e]">
                  {order.address.house}, {order.address.street},{' '}
                  {order.address.city}, {order.address.state}{' '}
                  {order.address.pinCode}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#ece3da] p-3.5 space-y-2.5">
                <p className="font-bold text-[#141824]">
                  Ordered Ensembles ({order.items.length})
                </p>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2.5 pt-2 border-t border-[#f3ece4] first:border-t-0 first:pt-0"
                  >
                    <img
                      src={getAssetUrl(item.image)}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 rounded-lg object-cover object-top shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#141824] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#6e6862]">
                        {item.variant} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#141824] tabular-nums">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white border border-[#ece3da] p-3.5 space-y-1.5">
                <div className="flex justify-between text-[#57524e]">
                  <span>Payment Method</span>
                  <span className="font-semibold text-[#141824]">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-[#57524e]">
                  <span>Delivery</span>
                  <span className="font-semibold text-[#15803d]">
                    {order.shippingCharge === 0
                      ? 'FREE'
                      : `₹${order.shippingCharge}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#efe6dd] flex justify-between text-sm font-extrabold text-[#121829]">
                  <span>Total Paid / Payable</span>
                  <span className="tabular-nums">
                    ₹{order.finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
