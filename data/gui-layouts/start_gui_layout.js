/**
 * @file layout data for start menu.
 */
START_GUI_LAYOUT = {

  _main: {
    width: 1,
    height: 1,
    left: 'auto',
    top: 'auto',
  },

  // title
  _titleDiv: {
    parent: '_main',
    width: '100%',
    height: 0.5,
    top: 0.2,
  },

  titleRows: {
    parent: '_titleDiv',
    height: 0.1,
    repeat: 'down',
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
    width: 0.5 - 0.15,
  },

  // sandbox button
  sandboxBtn: {
    parent: '_bdiv',
    width: 0.15,
    right: 0,
  },
};
