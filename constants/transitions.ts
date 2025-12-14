// Custom transition configurations for screens using expo-router
export const ScreenTransitions = {
  // Slide from right (default iOS style)
  slideFromRight: {
    animation: 'default' as const,
    customAnimationOnSwipe: true,
    fullScreenSwipeEnabled: true,
  },

  // Fade transition for modals
  fade: {
    animation: 'fade' as const,
  },

  // Scale with fade (for modals)
  modalScale: {
    animation: 'fade_from_bottom' as const,
  },

  // Bottom sheet slide up
  bottomSheet: {
    animation: 'slide_from_bottom' as const,
  },

  // Slide and fade (elegant combination)
  slideAndFade: {
    animation: 'slide_from_right' as const,
    customAnimationOnSwipe: true,
    fullScreenSwipeEnabled: true,
  },

  // Zoom in (for product details)
  zoomIn: {
    animation: 'fade' as const,
    customAnimationOnSwipe: true,
  },
};
