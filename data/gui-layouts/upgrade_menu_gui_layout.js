/**
 * @file layout data for upgrade menu.
 */

_COMMON = {

  // close button on top right
  closeBtn: {
    parent: 'r0',
    width: 0.05,
    height: 0.05,
    top: 0.08,
    right: 0.02,
  },

};

// layout on horizontal screen
HS_UPGRADE_MENU_GUI_LAYOUT = {

  // main rectangle including tab headers
  r0: {
    margin: 0.1,
    'max-width': 1.2,
    left: 'auto',
  },

  ..._COMMON,
};

// layout on vertical screen
VS_UPGRADE_MENU_GUI_LAYOUT = {

  // main rectangle including tab headers
  r0: {
    margin: 0.1,
    'max-height': 1,
    top: 'auto',
  },

  ..._COMMON,
};
