/**
 * @file layout data for tooltip popups
 */
const TOOLTIP_LAYOUT = {

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

const TOOLBAR_TOOLTIP_LAYOUT = {
  ...TOOLTIP_LAYOUT,

  // tutorial sim
  sim: {
    parent: '_r0',
    width: 0.3,
    height: 0.3,
    bottom: 'auto',
    left: 'auto',
  },

  // budget / cost indicator
  cost: {
    parent: '_r0',
    height: 0.04,
    bottom: 0,
  },
};
