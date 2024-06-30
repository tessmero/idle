/**
 * @file layout data for start menu.
 */
const START_GUI_LAYOUT = {

  // title
  titleDiv: {
    width: '100%',
    height: 0.1,
    top: 0.1,
  },

  // helper
  _bdiv: {
    width: 0.5,
    height: 0.1,
    bottom: 0.1,
    left: 'auto',
  },

  // play button
  playBtn: {
    parent: '_bdiv',
    width: 0.5 - 0.1 - 0.02,
  },

  // sandbox button
  sandboxBtn: {
    parent: '_bdiv',
    width: 0.1,
    right: 0,
  },
};
