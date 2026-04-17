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
            className="max-w-3xl mx-auto rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl"
            style={{ background: '#111210', border: '1px solid #2a2825' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1" style={{ color: 'white' }}>
                We use cookies 🍪
              </p>
              <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>
                We use essential cookies to make this site work and analytics cookies to improve it.
                No advertising cookies. No third-party tracking.{' '}
                <a
                  href="#"
                  className="underline hover:text-white transition-colors"
                  style={{ color: '#00808a' }}
                >
                  Cookie Policy
                </a>
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={decline}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-white/5"
                style={{ borderColor: '#374151', color: '#9ca3af' }}
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: '#00808a', color: 'white' }}
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
