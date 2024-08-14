/**
 * @file layout data for special popup for story interventions
 */
STORY_GUI_LAYOUT = {

  // special outer border
  borderDiv: {
    width: 1.4,
    height: 0.8,
    top: 'auto',
    left: 'auto',
  },

  // helper
  _main: {
    width: 0.8,
    height: 0.35,
    top: 'auto',
    left: 'auto',
  },

  // text display area
  messageDiv: {
    parent: '_main',
    height: 0.3,
  },

  _bottomRow: {
    parent: '_main',
    height: 0.08,
    bottom: 0,
  },

  // more button
  moreBtn: {
    parent: '_bottomRow',
    width: '22%',
    left: 0,
  },

  // okay button
  okayBtn: {
    parent: '_bottomRow',
    width: '72%',
    right: 0,
  },
};
