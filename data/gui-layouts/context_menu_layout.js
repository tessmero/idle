/**
 * @file Layout data for context menu.
 * @param orientation
 * @param expand
 * @param side
 */

// helpers for aligning bounding rectangle in screen
_MAR = 0.02; // distance from outer bounds to nearest screen edge or button
_SQR = 0.3; // side length of the two content squares
_PAD = 0.05; // padding around content squares
_SAX = _SQR + 2 * _PAD; // length of short axis
_LAX = 2 * _SQR + 3 * _PAD; // length of long axis

// helpers for positioning common buttons
_BTN_MARGIN = 0.015;

CONTEXT_MENU_LAYOUT = {

  // bounds in horizontal screen
  'bounds@orientation=0': {
    width: _SAX,

    // collapsed
    'height@expand=0': 0.1,
    'top@expand=0': 'auto',

    // expanded
    'height@expand=1': _LAX,
    'top@expand=1': 0.14, // align under menu/pause button

    // slide across screen
    'left@side=0': _MAR,
    'right@side=1': _MAR,
  },

  // bounds in vertical screen
  'bounds@orientation=1': {
    height: _SAX,

    // expand/collapse
    'width@expand=0': 0.1,
    'width@expand=1': _LAX,
    left: 'auto',

    // slide across screen
    'top@side=0': _MAR,
    'bottom@side=1': 0.11, // align above toolbar
  },

  // close button on top right
  closeBtn: {
    parent: 'bounds',
    width: 0.04,
    height: 0.04,
    top: _BTN_MARGIN,
    right: _BTN_MARGIN,
  },

  // two content squares
  squares: {
    parent: 'bounds',
    top: _PAD / 2,
    left: _PAD / 2,
    width: _SQR + _PAD,
    height: _SQR + _PAD,
    repeat: 'auto',
    margin: _PAD / 2,
  },
};

// extended layout for generic bodies
BODY_CONTEXT_MENU_LAYOUT = {
  ...CONTEXT_MENU_LAYOUT,

  // main label
  title: {
    parent: 'squares[0]',
    height: 0.05,
  },

  // art area
  artArea: {
    parent: 'squares[0]',
    top: 0.05,
    height: 'auto',
  },

  // small category label on top
  miniTitle: {
    parent: 'title',
    height: 0.01,
    top: -0.015,
  },

  // delete button on bottom right
  trashBtn: {
    parent: 'bounds',
    width: 0.07,
    height: 0.07,
    bottom: _BTN_MARGIN,
    right: _BTN_MARGIN,
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

// extended layout for layout tester in sandbox mode
LAYOUT_CONTEXT_MENU_LAYOUT = {
  ...CONTEXT_MENU_LAYOUT,

  // title over first/left content square
  title: {
    parent: 'squares[0]',
    height: 0.05,
    top: -0.05,
  },

  // aspect ratio slider with icons
  arSlider: {
    parent: 'squares[0]',
    top: '100%',
    height: 0.04,
  },

  // rows in bottom/right content square
  rows: {
    parent: 'squares[1]',
    height: 0.04,
    repeat: 'down',
  },

  // optional preset buttons in first row
  presets: {
    parent: 'rows[0]',
    width: '50%',
    repeat: 'right',
    margin: 0.002,
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

// extended layout for voice editor
// in music tab in sandbox mode
VOICE_CONTEXT_MENU_LAYOUT = {
  ...CONTEXT_MENU_LAYOUT,

};

// extended layout for song selector
// in music tab in sandbox mode
SONG_LIST_CONTEXT_MENU_LAYOUT = {
  ...CONTEXT_MENU_LAYOUT,

  // selected song info in first square
  info: {
    parent: 'squares[0]',
    height: 0.16,
  },

  // load button in first square
  loadBtn: {
    parent: 'squares[0]',
    height: 0.04,
    width: 0.2,
    left: 'auto',
    bottom: 0.1,
  },

  // list of songs
  // rows in bottom/right content square
  songRows: {
    parent: 'squares[1]',
    height: 0.05,
    repeat: 'down',
    margin: 0.005,
  },
};
