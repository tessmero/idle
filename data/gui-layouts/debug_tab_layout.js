/**
 * @file layout data used in buildTabContent() in debug and test tabs.
 *
 * Here we only consider the content area not including any tab headers.
 */

DEBUG_TAB_LAYOUT = {

  // helper
  _r0: {
    margin: 0.04,
  },

  // rows for individual settings
  rows: {
    parent: '_r0',
    height: 0.05,
    repeat: 'down',
  },

};

// base layout within one row
DEBUG_ROW_LAYOUT = {
  label: {
    left: 0.25,
    width: 'auto',
  },
};

// layout within one row
DEBUG_SCALAR_LAYOUT = {
  ...DEBUG_ROW_LAYOUT,

  // helper
  _btns: {
    width: 0.1,
  },

  // two square buttons
  buttons: {
    parent: '_btns',
    width: 0.05,
    repeat: 'right',
  },

  // numerical readout
  value: {
    left: 0.1 + 0.02,
    width: 0.15 - 0.02,
  },
};

// layout within one row
DEBUG_BOOL_LAYOUT = {
  ...DEBUG_ROW_LAYOUT,

  toggle: {
    width: 0.25,
  },
};
