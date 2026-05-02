/**
 * CookieBanner.tsx
 * GDPR/PECR cookie consent — appears on first visit, stores preference in localStorage.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'promptly_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
          aria-live="polite"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-0 inset-x-0 z-[10000] px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <div
            className="max-w-3xl mx-auto rounded-[22px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{
              background: 'linear-gradient(180deg, #142522 0%, #0F1C1A 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.05) inset, 0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(190,255,0,0.10)',
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: 'white' }}>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: '#BEFF00', boxShadow: '0 0 8px #BEFF00' }}
                  aria-hidden="true"
                />
                We use cookies
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                We use essential cookies to make this site work and analytics cookies to improve it.
                No advertising cookies. No third-party tracking.{' '}
                <a
                  href="/legal#cookies"
                  className="underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] rounded"
                  style={{ color: '#BEFF00' }}
                >
                  Cookie Policy
                </a>
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={decline}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00]"
                style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)' }}
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEFF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1C1A]"
                style={{
                  background: 'linear-gradient(180deg, #D6FF4A 0%, #BEFF00 100%)',
                  color: '#0F1C1A',
                  border: '1px solid rgba(15,28,26,0.16)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(190,255,0,0.28)',
                }}
              >
                Accept all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
