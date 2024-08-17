/**
 * @file context menu moving across the screen
 * using 'side' and 'expand'
 */
CONTEXT_MENU_ANIM = [
  {
    t: 0,
    side: 0,
    expand: 1,
  },

  // collapse
  {
    t: 0.25,
    side: 0,
    expand: 0,
  },

  // slide
  {
    t: 0.75,
    side: 1,
    expand: 0,
  },

  // expand
  {
    t: 1,
    side: 1,
    expand: 1,
  },
];
