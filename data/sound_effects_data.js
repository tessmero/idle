/**
 * @file common sound effects data objects
 *
 * loaded in src/audio/sound_effect.js
 */
SOUND_EFFECTS = {

  // used in default_tool.js
  // when a particle is collected and "+1" appears
  collect: {
    duration: 0.02,
    minDelay: 0.04, // ignore play() calls if too rapid
    startFreq: 800,
    endFreq: 1000,
    wave: 'sine',
    volume: 0.05,
  },

  //
  hooray: {
    duration: 0.5,
    scale: 'A4_majorArp',
    wave: 'square',
    volume: 0.05,
  },

  //
  uhOh: {
    duration: 0.3,
    scale: [300, 100],
    wave: 'square',
    volume: 0.1,
  },

  // used in button.js
  // when a button is newly hovered
  hover: {
    duration: 0.1,
    freq: 100,
    wave: 'sine',
    volume: 1,
    env: 'attack',
  },

  // used in button.js
  // when a button clicked
  click: {
    duration: 0.1,
    freq: 200,
    wave: 'sine',
    volume: 1,
    env: 'attack',
  },

  // an unavailable button is clicked
  // "collect more raindrops" appears
  dullClick: {
    duration: 0.1,
    startFreq: 100,
    endFreq: 50,
    wave: 'sine',
    volume: 1,
    env: 'attack',
  },

  // used in  a new body is placed in the sim
  plonk: {
    duration: 0.2,
    startFreq: 50,
    endFreq: 100,
    wave: 'sine',
    volume: 1,
    env: 'attack',
  },
};
