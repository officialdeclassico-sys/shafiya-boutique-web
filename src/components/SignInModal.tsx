import React, { useEffect, useState } from 'react';
import { X, User } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#fcf8f3] border border-[#f2e5dc] p-7 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Sign In Modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-[#524c48] hover:text-[#17171a] hover:bg-[#f3ebe4] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#fde8ee] text-[#f83a6b] flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2
              id="signin-modal-title"
              className="font-editorial text-2xl font-semibold text-[#17171a] leading-tight"
            >
              Sign In to Shafiya
            </h2>
            <p className="text-xs text-[#6e6762] tracking-wide">
              KASHMIRI DESIGNS
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <p className="text-sm text-[#2c2a29] font-medium">
              Welcome back, <span className="text-[#f83a6b]">{email}</span>
            </p>
            <p className="text-xs text-[#6e6762]">
              You are signed in to your Shafiya preview session.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#f83a6b] hover:bg-[#e02858] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="signin-email"
                className="block text-xs font-medium uppercase tracking-wider text-[#4a4542] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white border border-[#e6dcd4] px-4 py-2.5 text-sm text-[#17171a] placeholder-[#a39c96] focus:outline-none focus:border-[#f83a6b] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="signin-password"
                className="block text-xs font-medium uppercase tracking-wider text-[#4a4542] mb-1.5"
              >
                Password
              </label>
              <input
                id="signin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl bg-white border border-[#e6dcd4] px-4 py-2.5 text-sm text-[#17171a] placeholder-[#a39c96] focus:outline-none focus:border-[#f83a6b] transition-colors"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-medium text-[#524c48] hover:bg-[#f2eae3] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#f83a6b] hover:bg-[#e02858] text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
