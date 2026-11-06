import React, { useState } from 'react';
import { getAssetUrl } from '../utils/assetPath';

interface BrandLogoProps {
  onClick?: () => void;
  compact?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ onClick, compact = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      aria-label="Shafiya Kashmiri Designs — Home"
      className="group inline-flex flex-col items-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f83a6b] rounded-md shrink-0"
    >
      {/* Floral Pink Emblem above brand name */}
      <div className={compact ? 'h-5 flex items-center justify-center -mb-1' : 'h-[26px] flex items-center justify-center -mb-1.5'}>
        {!imgError ? (
          <img
            src={getAssetUrl('assets/aistudio/logo_flower.png')}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={compact ? 'h-5 w-auto object-contain' : 'h-[26px] w-auto object-contain transition-transform duration-300 group-hover:scale-105'}
          />
        ) : (
          <svg
            viewBox="0 0 64 34"
            className={compact ? 'h-5 w-auto text-[#f83a6b]' : 'h-[26px] w-auto text-[#f83a6b]'}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M32 4C28 11 27 19 32 28C37 19 36 11 32 4Z" />
            <path d="M21 10C20 17 23 23 30 28C27 20 25 14 21 10Z" opacity="0.85" />
            <path d="M43 10C44 17 41 23 34 28C37 20 39 14 43 10Z" opacity="0.85" />
            <path d="M12 18C15 24 21 27 29 29C23 24 18 20 12 18Z" opacity="0.7" />
            <path d="M52 18C49 24 43 27 35 29C41 24 46 20 52 18Z" opacity="0.7" />
          </svg>
        )}
      </div>

      {/* Main Brand Wordmark: Shafiya */}
      <span
        className={
          compact
            ? 'font-editorial text-[32px] font-medium tracking-[-0.02em] text-[#17171a] leading-[1.02] block'
            : 'font-editorial text-[42px] xl:text-[48px] font-medium tracking-[-0.025em] text-[#17171a] leading-[0.96] block'
        }
      >
        Shafiya
      </span>

      {/* Subtitle: KASHMIRI DESIGNS — positioned cleanly below 'y' descender with zero overlap */}
      <span
        className={
          compact
            ? 'font-ui text-[7.5px] font-semibold uppercase tracking-[0.34em] text-[#222226] mt-1.5 pl-[0.34em] block whitespace-nowrap'
            : 'font-ui text-[8.5px] xl:text-[9.5px] font-semibold uppercase tracking-[0.38em] text-[#222226] mt-2 pl-[0.38em] block whitespace-nowrap'
        }
      >
        KASHMIRI DESIGNS
      </span>
    </a>
  );
};
