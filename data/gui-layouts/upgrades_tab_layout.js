/**
 * @file layout data for upgrades tab in upgrade menu in play mode
 */
const UPGRADES_TAB_LAYOUT = {

  // helper
  _inner: {
    margin: 0.05,
  },

  // rows for individual upgrades
  rows: {
    parent: '_inner',
    height: 0.08,
    repeat: 'down',
  },
};

// layout for one row in upgrades
const STAT_UPGRADER_LAYOUT = {

  // helper
  _inner: {
    margin: 0.02,
  },

  button: {
    parent: '_inner',
    width: 0.2,
  },

  // helper for progress display
  // area in middle
  _progress: {
    parent: '_inner',
    left: 0.23,
    width: 0.4,
    height: 0.064,
    top: 'auto',
  },

  mainLabel: {
    parent: '_inner',
    left: 0.23 + 0.4,
    width: 'auto',
  },

  // two rows in progress display area
  _rows: {
    parent: '_progress',
    height: '50%',
    repeat: 'down',
  },

  progressLabel: {
    parent: '_rows[0]',
  },

  // empty/filled/animated boxes
  progressBoxes: {
    parent: '_rows[1]',
    width: 0.032,
    repeat: 'right',
    margin: 0.003,
  },
};

