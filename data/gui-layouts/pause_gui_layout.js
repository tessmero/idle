/**
 * @file layout data for pause menu.
 */
const PAUSE_GUI_LAYOUT = {

  // helper used as parent below
  _sr: {
    width: 0.4,
    height: 0.4,
    top: 'auto',
    left: 'auto',
  },

  // resume button
  resumeBtn: {
    parent: '_sr',
    height: 0.1,
  },

  // quit button
  quitBtn: {
    parent: '_sr',
    height: 0.1,
    bottom: 0,
  },
};
