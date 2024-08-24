/**
 * @file sound triggered by stats tab gui animation
 */

STATS_TAB_SOUNDS = {
  _poke: {

    // triggered each time a row starts expanding
    from: 'poke=0',
    to: 'poke>0',

    // expanding sound
    duration: 0.2,
    startFreq: 220,
    endFreq: 440,
    wave: 'sine',
    volume: 0.06,
  },
};
