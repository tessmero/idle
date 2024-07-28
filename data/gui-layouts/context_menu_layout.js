/**
 * @file Layout data for context menu.
 *
 * Overall bounds depend on screen orientation.
 * Overall bounds are given in pairs to be interpolated for sliding animation.
 * (special handling in context_menu.js)
 *
 * Inner contents are flexible with no repetition or special handling.
 */

// helpers for aligning bounding rectangle in screen
_MAR = 0.05; // distance from outer bounds to nearest screen edge
_SQR = 0.3; // side length of the two content squares
_PAD = 0.05; // padding around content squares
_SAX = _SQR + 2 * _PAD; // length of short axis
_LAX = 2 * _SQR + 4 * _PAD; // length of long axis

// bounds in horizontal screen
_HS = {
  width: _SAX,
  height: _LAX,
  top: 'auto',
};
HS_CONTEXT_MENU_BOUNDS = {
  0: {
    ..._HS,
    left: _MAR,
  },

  1: {
    ..._HS,
    right: _MAR,
  },
};

// bounds in vertical screen
_VS = {
  width: _LAX,
  height: _SAX,
  left: 'auto',
};
VS_CONTEXT_MENU_BOUNDS = {
  0: {
    ..._VS,
    top: _MAR,
  },

  1: {
    ..._VS,
    bottom: _MAR,
  },
};

// base layout in context menu
CONTEXT_MENU_LAYOUT = {

  // close button on top right
  closeBtn: {
    width: 0.04,
    height: 0.04,
    top: 0.025,
    right: 0.025,
  },

  // two content squares
  squares: {
    width: _SQR + 2 * _PAD,
    height: _SQR + 2 * _PAD,
    repeat: 'auto',
    margin: _PAD,
  },
};

// extended layout for generic bodies
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

// extended layout with slots for buddy-specific gui elements
BUDDY_CONTEXT_MENU_LAYOUT = {
  ...BODY_CONTEXT_MENU_LAYOUT,

  // rows in bottom/right content square
  rows: {
    parent: 'squares[1]',
    height: 0.05,
    repeat: 'down',
    margin: 0.005,
  },
};

// extended layout for test runner in sandbox mode
_BTN = 0.04;
TEST_CONTEXT_MENU_LAYOUT = {
  ...CONTEXT_MENU_LAYOUT,

  // title over first/left content square
  title: {
    parent: 'squares[0]',
    height: 0.05,
    top: -0.05,
  },

  // rows in bottom/right content square
  rows: {
    parent: 'squares[1]',
    height: 0.025,
    repeat: 'down',
  },

  // helper
  _btns: {
    parent: 'squares[0]',
    height: _BTN,
    width: 4 * _BTN,
    top: '100%',
    left: 'auto',
  },

  // four test control buttons
  buttons: {
    parent: '_btns',
    width: _BTN,
    repeat: 'right',
  },
};

