/**
 * @file Layout data for elements within context menu.
 */
CONTEXT_MENU_LAYOUT = {
  // helper
  _r0: {
    margin: 0.03,
  },

  // two content squares
  squares: {
    parent: '_r0',
    width: 0.3 + 0.03 * 2,
    height: 0.3 + 0.03 * 2,
    repeat: 'auto',
    margin: 0.03,
  },

  // close button on top right
  closeBtn: {
    width: 0.04,
    height: 0.04,
    top: 0.025,
    right: 0.025,
  },
};

// rows within bottom/right content square
BODY_CONTEXT_MENU_LAYOUT = {
  ...CONTEXT_MENU_LAYOUT,

  rows: {
    parent: 'squares[1]',
    height: 0.05,
    repeat: 'down',
    margin: 0.005,
  },

  // delete button on bottom right
  trashBtn: {
    width: 0.07,
    height: 0.07,
    bottom: 0.025,
    right: 0.025,
  },
};
