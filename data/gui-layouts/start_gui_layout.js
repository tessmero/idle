/**
 * @file layout data for start menu.
 */
const START_GUI_LAYOUT = {

  _main: {
    width: 1,
    height: 1,
    left: 'auto',
    top: 'auto',
  },

  // title
  titleDiv: {
    parent: '_main',
    width: '100%',
    height: 0.1,
    top: 0.2,
  },

  // helper
  _bdiv: {
    parent: '_main',
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
