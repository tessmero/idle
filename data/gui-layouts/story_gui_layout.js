/**
 * @file layout data for special popup for story interventions
 */
const STORY_GUI_LAYOUT = {

  // helper used as parent below
  _sr: {
    width: 0.4,
    height: 0.4,
    top: 'auto',
    left: 'auto',
  },

  // text display area
  messageDiv: {
    parent: '_sr',
  },

  // more button
  moreBtn: {
    parent: '_sr',
    height: 0.1,
  },

  // okay button
  okayBtn: {
    parent: '_sr',
    height: 0.1,
    bottom: 0,
  },
};
