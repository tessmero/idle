/**
 * @file layout data for HUD visible when playing
 */
HUD_GUI_LAYOUT = {

  // helper referenced as parent below
  _sr: {
    margin: 0.02,
  },

  // button for upgrade menu
  topLeftBtn: {
    parent: '_sr',
    width: 0.1,
    height: 0.1,
  },

  // button to pause or exit box
  topRightBtn: {
    parent: '_sr',
    width: 0.1,
    height: 0.1,
    right: 0,
  },

  // helper for display area
  _display: {
    parent: '_sr',
    height: 0.05,
    top: 0.01,
  },

  // left part of display area
  leftDiv: {
    parent: '_display',
    left: '10%',
    width: '20%',
  },

  // middle part of display area
  midDiv: {
    parent: '_display',
    left: '40%',
    width: '20%',
  },

  // right part of display area
  rightDiv: {
    parent: '_display',
    left: '70%',
    width: '20%',
  },

  // toolbar row along bottom of screen
  toolbar: {
    height: 0.1,
    bottom: 0,
  },

  // sound mute button at bottom right
  muteBtn: {
    parent: '_sr',
    width: 0.08,
    height: 0.08,
    bottom: 0,
    right: 0,
  },

  // GFX button at bottom right
  gfxBtn: {
    parent: '_sr',
    width: 0.08,
    height: 0.08,
    bottom: 0,
    right: 0.08 + _MAR,
  },
};
