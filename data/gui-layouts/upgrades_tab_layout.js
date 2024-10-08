/**
 * @file layout data for upgrades tab in upgrade menu in play mode
 */
UPGRADES_TAB_LAYOUT = {

  // helper
  _inner: {
    margin: 0.05,
  },

  // rows for individual upgrades
  'rows@thick=0': {
    parent: '_inner',
    height: 0.08,
    repeat: 'down',

    // drop in animation
    'margin@drop=0': 0.01,
  },

  'rows@thick=1': {
    parent: '_inner',
    height: 0.16,
    repeat: 'down',

    // drop in animation
    'margin@drop=0': 0.02,
  },
};

// layout within one row row
STAT_UPGRADER_LAYOUT = {
  '@thick=0': '_THIN_STAT_UPGRADER_LAYOUT',
  '@thick=1': '_THICK_STAT_UPGRADER_LAYOUT',
};

// layout for row in upgrades (0.08 thick)
_THIN_STAT_UPGRADER_LAYOUT = {

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
    height: 0.06,
    top: 'auto',
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
    width: 0.03,
    repeat: 'right',
    margin: 0.003,
  },

  mainLabel: {
    parent: '_inner',
    width: 0.3,
    right: 0.03,
  },
};

// alternate layout that takes up two rows (0.16 thick)
_THICK_STAT_UPGRADER_LAYOUT = {

  // helper
  _inner: {
    margin: 0.03,
  },

  button: {
    parent: '_inner',
    width: 0.2,
    height: 0.07,
    top: 'auto',
  },

  // mainLabel above display area
  mainLabel: {
    parent: '_inner',
    left: 0.23,
  },

  // helper for progress display
  // area in middle
  _progress: {
    parent: '_inner',
    left: 0.23,
    width: 0.4,
    height: 0.06,
    bottom: 0,
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
    width: 0.03,
    repeat: 'right',
    margin: 0.003,
  },
};

