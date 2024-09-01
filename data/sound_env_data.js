/**
 * @file sound envelopes data object
 *
 * controls volume-over-time for a sound effect
 */
SOUND_ENVELOPES = {

  // default envelope
  // soften just at end of duration
  dropEnd: [

    // start at full volume
    {
      start: 0,
      volume: '100%',
    },

    // stay at full volume until last .1 seconds
    {
      end: 0.1,
      volume: '100%',
    },

    // drop off in last .1 seconds
    {
      end: 0,
      volume: 0,
    },
  ],

  // sharp ramp down envelope
  attack: [

    // start at full volume
    {
      start: 0,
      volume: '100%',
    },

    // ramp down to end of duration
    {
      end: 0,
      volume: 0,
    },
  ],

  // repeating on-off envelope
  zipper: [

    // start at full volume
    {
      start: 0,
      volume: '100%',
    },

    // hold full volume
    {
      start: 0.0199,
      volume: '100%',
    },

    // fall off instantly
    {
      start: 0.02,
      volume: 0,
    },

    // stay off
    {
      start: 0.0399,
      volume: 0,
    },

    // back to full volume instantly
    {
      repeat: 0.04,
    },
  ],

  // envelope for percussion that can't be sustained
  // "duration" is really a placeholder for rhythm timing
  snareDrum: [

    // start at full volume
    {
      start: 0,
      volume: '100%',
    },

    // hold full volume for short period
    {
      start: 0.17,
      volume: '100%',
    },

    // fall off over short period
    {
      start: 0.3,
      volume: 0,
    },

    // silent for remaining "duration"
  ],
};
