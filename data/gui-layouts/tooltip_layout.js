/**
 * @file layout data for tooltip popups
 */

// common layout for all tooltips
TOOLTIP_LAYOUT = {

  // helper
  _r0: {
    margin: 0.05,
  },

  // title at top
  label: {
    parent: '_r0',
    height: 0.04,
  },

};

// extended layout
_THUMB = {
  parent: '_r0',
  width: 0.1,
  height: 0.1,
  top: 'auto',
};
UPGRADE_TOOLTIP_LAYOUT = {
  ...TOOLTIP_LAYOUT,

  before: {
    ..._THUMB,
    left: 0,
  },

  arrow: {
    parent: '_r0',
    width: 0.05,
    height: 0.05,
    left: 'auto',
    top: 'auto',
  },

  after: {
    ..._THUMB,
    right: 0,
  },

  cost: {
    parent: '_r0',
    height: 0.04,
    bottom: 0,
  },
};

// extended layout
TOOLBAR_TOOLTIP_LAYOUT = {
  ...TOOLTIP_LAYOUT,

  // tutorial sim
  sim: {
    parent: '_r0',
    width: 0.3,
    height: 0.3,
    top: 'auto',
    left: 'auto',
  },

  // budget / cost indicator
  cost: {
    parent: '_r0',
    height: 0.04,
    bottom: 0,
  },
};
