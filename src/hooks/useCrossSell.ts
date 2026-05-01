/**
 * useCrossSell — Hook for managing cross-sell state and triggers.
 *
 * Handles:
 * - Computing contextual recommendations
 * - Session-based popup limiting (once per session)
 * - Dwell time detection (45s threshold)
 * - High-intent action triggers
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getRecommendations,
  shouldShowPopup,
  type CrossSellContext,
  type CrossSellItem,
  type HighIntentAction,
} from '../utils/crossSell';

interface UseCrossSellReturn {
  /** Inline recommendations (always available) */
  inlineItems: CrossSellItem[];
  /** Popup items (only when a high-intent action triggers) */
  popupItems: CrossSellItem[];
  /** Whether the popup is currently showing */
  popupOpen: boolean;
  /** Trigger source for analytics */
  popupTrigger: string;
  /** Call this when a high-intent action occurs */
  triggerPopup: (action: HighIntentAction) => void;
  /** Close the popup */
  closePopup: () => void;
}

export function useCrossSell(ctx: CrossSellContext): UseCrossSellReturn {
  const [inlineItems] = useState<CrossSellItem[]>(() => getRecommendations(ctx, 3));
  const [popupItems, setPopupItems] = useState<CrossSellItem[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTrigger, setPopupTrigger] = useState('');

  // Dwell timer — triggers popup after 45s on page
  const dwellTriggered = useRef(false);
  useEffect(() => {
    if (dwellTriggered.current) return;
    const timer = setTimeout(() => {
      if (!dwellTriggered.current && shouldShowPopup('dwell_45s')) {
        dwellTriggered.current = true;
        const items = getRecommendations(ctx, 2);
        if (items.length > 0) {
          setPopupItems(items);
          setPopupTrigger('dwell_45s');
          setPopupOpen(true);
        }
      }
    }, 45_000);
    return () => clearTimeout(timer);
  }, [ctx]);

  const triggerPopup = useCallback((action: HighIntentAction) => {
    if (!shouldShowPopup(action)) return;
    const items = getRecommendations(ctx, 2);
    if (items.length > 0) {
      setPopupItems(items);
      setPopupTrigger(action);
      setPopupOpen(true);
    }
  }, [ctx]);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  return {
    inlineItems,
    popupItems,
    popupOpen,
    popupTrigger,
    triggerPopup,
    closePopup,
  };
}
