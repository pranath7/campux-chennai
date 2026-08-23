/**
 * Safe cross-platform Haptic Feedback utility for mobile touch gestures
 */
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

export function triggerHaptic(style: HapticStyle = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (style) {
      case 'selection':
      case 'light':
        navigator.vibrate(8);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(35);
        break;
      case 'success':
        navigator.vibrate([12, 40, 18]);
        break;
      case 'warning':
        navigator.vibrate([25, 30, 25]);
        break;
      case 'error':
        navigator.vibrate([40, 60, 40, 60, 40]);
        break;
    }
  } catch {
    // Gracefully ignore on unsupported mobile hardware
  }
}
