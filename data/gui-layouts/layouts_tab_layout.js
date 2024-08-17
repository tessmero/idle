/**
 * @file layout data for the sandbox mode "layouts" tab
 *
 * Here we only consider the content area not including any tab headers.
 */
LAYOUTS_TAB_LAYOUT = {

  // helper
  _r0: {
    margin: 0.04,
  },

  // rows for individual layouts
  rows: {
    parent: '_r0',
    height: 0.05,
    repeat: 'down',
  },

};

// layout within one row
LAYOUTS_ROW_LAYOUT = {

  // layout object name on left
  title: {
    left: 0.1,
    width: 0.2,
  },

  info: {
    right: 0.1,
    width: 0.2,
  },
};

