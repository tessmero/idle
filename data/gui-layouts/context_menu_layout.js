/**
 * @file Layout data for context menu.
 */

// side length for overall bounding rectangle
CONTEXT_MENU_SHORT_AXIS = 0.3 + 0.03 * 4;

// base layout within context menu
CONTEXT_MENU_LAYOUT = {

  // close button on top right
  closeBtn: {
    width: 0.04,
    height: 0.04,
    top: 0.025,
    right: 0.025,
  },

  // helper
  _r0: {
    margin: 0.03,
  },

  // two content squares
  squares: {
    parent: '_r0',
    width: 0.3 + 0.03 * 2,
    height: 0.3 + 0.03 * 2,
    repeat: 'auto',
    margin: 0.03,
  },
};

// extended layout
BODY_CONTEXT_MENU_LAYOUT = {
  ...CONTEXT_MENU_LAYOUT,

  // delete button on bottom right
  trashBtn: {
    width: 0.07,
    height: 0.07,
    bottom: 0.025,
    right: 0.025,
  },
};

// extended layout
BUDDY_CONTEXT_MENU_LAYOUT = {
  ...BODY_CONTEXT_MENU_LAYOUT,

  // rows within bottom/right content square
  rows: {
    parent: 'squares[1]',
    height: 0.05,
    repeat: 'down',
    margin: 0.005,
  },
};

// extended layout for test runner in sandbox mode
TEST_CONTEXT_MENU_LAYOUT = {
  ...CONTEXT_MENU_LAYOUT,

  // title over first/left content square
  title: {
    parent: 'squares[0]',
    height: 0.05,
    top: -0.05,
  },

  // rows within bottom/right content square
  rows: {
    parent: 'squares[1]',
    height: 0.025,
    repeat: 'down',
  },

  // helper
  _btns: {
    parent: 'squares[0]',
    top: '100%',
    height: 0.03,
    width: 0.12,
    left: 'auto',
  },

  // four test control buttons
  buttons: {
    parent: '_btns',
    width: 0.03,
    repeat: 'right',
  },
};

