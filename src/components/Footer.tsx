import React from 'react';
import { NavItemKey } from './Header';

export interface SocialMediaLinks {
  instagram?: string;
  youtube?: string;
  pinterest?: string;
  facebook?: string;
}

interface FooterProps {
  onNavigate?: (page: NavItemKey) => void;
  socialLinks?: SocialMediaLinks;
}

const DEFAULT_SOCIAL_LINKS: Required<SocialMediaLinks> = {
  instagram:
    (import.meta.env.VITE_INSTAGRAM_URL as string | undefined)?.trim() ||
    'https://www.instagram.com',
  youtube:
    (import.meta.env.VITE_YOUTUBE_URL as string | undefined)?.trim() ||
    'https://www.youtube.com',
  pinterest:
    (import.meta.env.VITE_PINTEREST_URL as string | undefined)?.trim() ||
    'https://www.pinterest.com',
  facebook:
    (import.meta.env.VITE_FACEBOOK_URL as string | undefined)?.trim() ||
    'https://www.facebook.com',
};

export const Footer: React.FC<FooterProps> = ({ socialLinks }) => {
  const links = {
    instagram: socialLinks?.instagram || DEFAULT_SOCIAL_LINKS.instagram,
    youtube: socialLinks?.youtube || DEFAULT_SOCIAL_LINKS.youtube,
    pinterest: socialLinks?.pinterest || DEFAULT_SOCIAL_LINKS.pinterest,
    facebook: socialLinks?.facebook || DEFAULT_SOCIAL_LINKS.facebook,
  };

  const socialItems = [
    {
      key: 'instagram',
      label: 'Follow us on Instagram',
      href: links.instagram,
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-white"
          fill="none"
        >
          <rect
            x="2.5"
            y="2.5"
            width="19"
            height="19"
            rx="5.4"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <circle
            cx="12"
            cy="12"
            r="4.3"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <circle cx="17.4" cy="6.6" r="1.35" fill="currentColor" />
        </svg>
      ),
    },
    {
      key: 'youtube',
      label: 'Subscribe to our YouTube channel',
      href: links.youtube,
      icon: (
        <svg
          viewBox="0 0 28 20"
          aria-hidden="true"
          className="w-[19px] h-[14px] sm:w-[21px] sm:h-[15px] text-white"
          fill="currentColor"
        >
          <path d="M27.14 3.14A3.51 3.51 0 0 0 24.67.66C22.49.07 14 .07 14 .07s-8.49 0-10.67.59A3.51 3.51 0 0 0 .86 3.14C.28 5.33.28 10 .28 10s0 4.67.58 6.86a3.51 3.51 0 0 0 2.47 2.48c2.18.59 10.67.59 10.67.59s8.49 0 10.67-.59a3.51 3.51 0 0 0 2.47-2.48c.58-2.19.58-6.86.58-6.86s0-4.67-.58-6.86ZM11.2 14.2V5.8L18.47 10l-7.27 4.2Z" />
        </svg>
      ),
    },
    {
      key: 'pinterest',
      label: 'Follow us on Pinterest',
      href: links.pinterest,
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-white"
          fill="currentColor"
        >
          <path d="M12.18 2C6.95 2 4.2 5.46 4.2 9.25c0 1.98.95 3.74 2.46 4.4.25.11.48.01.55-.27.05-.2.18-.72.24-.94.08-.29.04-.39-.17-.64-.49-.58-.8-1.33-.8-2.39 0-3.08 2.31-5.84 6.01-5.84 3.28 0 5.08 2 5.08 4.68 0 3.52-1.56 6.49-3.87 6.49-1.28 0-2.24-1.06-1.93-2.35.37-1.55 1.08-3.22 1.08-4.34 0-1-.54-1.84-1.65-1.84-1.31 0-2.36 1.35-2.36 3.17 0 1.15.39 1.93.39 1.93s-1.34 5.66-1.57 6.66c-.29 1.24-.04 2.86-.02 3.04.01.09.13.12.19.04.09-.11 1.21-1.5 1.59-2.88.11-.4.63-2.48.63-2.48.31.6 1.23 1.12 2.21 1.12 2.91 0 4.88-2.65 4.88-6.21C19.8 5.21 16.65 2 12.18 2Z" />
        </svg>
      ),
    },
    {
      key: 'facebook',
      label: 'Follow us on Facebook',
      href: links.facebook,
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-white"
          fill="currentColor"
        >
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      id="shafiya-footer"
      className="w-full shrink-0 bg-[#f83a6b] text-white py-2 sm:py-2.5 px-4 select-none"
    >
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* 1. Heading: "Follow Us On" flanked by tapered white horizontal lines */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 w-full">
          <span
            aria-hidden="true"
            className="w-10 sm:w-14 h-px bg-gradient-to-l from-white via-white/80 to-transparent shrink-0"
          />
          <h2 className="font-ui text-[11.5px] sm:text-[13px] font-normal text-white tracking-[0.02em] leading-none whitespace-nowrap">
            Follow Us On
          </h2>
          <span
            aria-hidden="true"
            className="w-10 sm:w-14 h-px bg-gradient-to-r from-white via-white/80 to-transparent shrink-0"
          />
        </div>

        {/* 2. Social Media Icons Row: Instagram | YouTube | Pinterest | Facebook */}
        <div className="mt-1.5 flex items-center justify-center gap-3 sm:gap-4">
          {socialItems.map((item, index) => (
            <React.Fragment key={item.key}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="inline-flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:opacity-90 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-full p-0.5 cursor-pointer"
              >
                {item.icon}
              </a>
              {index < socialItems.length - 1 && (
                <span
                  aria-hidden="true"
                  className="h-3.5 sm:h-4 w-px bg-white/85 shrink-0"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 3. Tapered Horizontal White Divider Line */}
        <div
          aria-hidden="true"
          className="mt-1.5 w-[200px] sm:w-[290px] max-w-[85%] h-px bg-gradient-to-r from-transparent via-white/95 to-transparent"
        />

        {/* 4. Copyright Text */}
        <p className="mt-1 font-editorial text-[11.5px] sm:text-[13px] font-normal text-white tracking-[0.015em] text-center leading-none">
          © 2026 Chinar by Designer Shafiya.
        </p>
      </div>
    </footer>
  );
};
