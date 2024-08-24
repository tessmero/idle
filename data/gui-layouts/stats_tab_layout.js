/**
 * @file layout data for stats tab in upgrades menu.
 */
STATS_TAB_LAYOUT = {

  // helper
  _r0: {
    margin: 0.05,
  },

  // rows for individual stats
  rows: {
    parent: '_r0',
    height: 0.15,
    repeat: 'down',
    margin: 0.01,

    // sliding animation
    'width@poke=0': 0.05,
    'width@poke=1': '100%',
  },
};
