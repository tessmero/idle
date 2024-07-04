/**
 * @file layout data for special popup for story interventions
 */
const STORY_GUI_LAYOUT = {

  _main: {
    width: 1,
    height: 0.4,
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
    height: 0.1,
    bottom: 0,
  },

  // more button
  moreBtn: {
    parent: '_bottomRow',
    width: '20%',
    left: 0,
  },

  // okay button
  okayBtn: {
    parent: '_bottomRow',
    width: '70%',
    right: 0,
  },
};
