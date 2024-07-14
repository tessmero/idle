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
    height: 0.05,
    repeat: 'down',
  },
};

// layout for one row in upgrades
const STAT_UPGRADER_LAYOUT = {

  // helper
  _inner: {
    margin: 0.001,
  },

  button: {
    parent: '_inner',
    width: 0.15,
  },

  progress: {
    parent: '_inner',
    width: 0.4,
    left: 0.15,
  },

  label: {
    parent: '_inner',
    left: 0.15 + 0.4,
    width: 'auto',
  },
};

