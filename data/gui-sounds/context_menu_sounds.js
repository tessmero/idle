/**
 * @file sound data for context menu
 */
CONTEXT_MENU_SOUNDS = {
  _open: {

    // triggered by start expanding
    from: 'expand=0',
    to: 'expand>0',

    // expanding sound
    duration: 0.2,
    startFreq: 220,
    endFreq: 440,
    wave: 'sine',
    volume: 0.06,
  },

  _close: {

    // triggered by start collapsing
    from: 'expand=1',
    to: 'expand<1',

    // collapsing sound
    duration: 0.1,
    startFreq: 440,
    endFreq: 220,
    wave: 'sine',
    volume: 0.06,
  },
};
