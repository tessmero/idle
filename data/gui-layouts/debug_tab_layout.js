/**
 * @file layout data for debug settings in sendbox mode.
 *
 * Here we only consider the main content area not including any tab headers.
 */
const DEBUG_TAB_LAYOUT = {

  // helper
  _r0: {
    margin: 0.02,
  },

  // rows for individual settings
  rows: {
    parent: '_r0',
    height: 0.05,
    repeat: 'down',
  },

};

// base layout within one row
const DEBUG_ROW_LAYOUT = {
  label: {
    left: 0.25,
    width: 'auto',
  },
};

// layout within one row
const DEBUG_SCALAR_LAYOUT = {
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
const DEBUG_BOOL_LAYOUT = {
  ...DEBUG_ROW_LAYOUT,

  toggle: {
    width: 0.25,
  },
};
