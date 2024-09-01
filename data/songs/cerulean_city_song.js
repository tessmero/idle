/**
 * @file CERULEAN_CITY_SONG
 *   Cerulean City Theme
 *   Pokemon Red and Blue
 *   Junichi Masuda
 */
_ = 'rest';
s = 'sustain';

CERULEAN_CITY_SONG = {
  info: `
    Cerulean City Theme
    Pokemon Red and Blue
    Junichi Masuda
  `,

  voices: [
    {
      // melody
      wave: 'square',
      volume: 0.03,
      duration: 0.12, // sixteenth note
      freq: 'A3', // 0 note
    },
    {
      // harmony
      wave: 'sine',
      volume: 0.1,
      duration: 0.12, // sixteenth note
      freq: 'A3', // 0 note
    },
    {
      // bass
      wave: 'triangle',
      volume: 0.15,
      duration: 0.12, // sixteenth note
      freq: 'A2', // 0 note
    },
  ],

  score: [
    [
      [7, s, 6, s, 4, s, 2, s, 0, s, 2, s, 4, s, 6, s],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, 19, s, 18, s, 16, s, 14, s],
    ],
    [
      [7, s, s, _, _, _, 11, 2, 7, _, 9, _, 7, 9, 11, 12],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [7, s, 11, s, 7, s, 11, s, 7, s, 11, s, 7, s, 11, s],
    ],
    [
      [11, s, s, s, s, _, 2, 7, 9, s, s, s, s, _, _, _],
      [16, s, s, s, s, s, 14, 16, 19, s, s, s, 16, s, s, s],
      [9, s, 12, s, 9, s, 12, s, 14, s, 12, s, 11, s, 9, s],
    ],
    [
      [7, s, s, _, _, _, 11, 2, 7, _, 9, _, 7, 9, 11, 12],
      [11, s, s, s, s, s, s, s, 7, s, s, s, s, s, s, s],
      [7, s, 11, s, 7, s, 11, s, 7, s, 11, s, 7, s, 11, s],
    ],
    [
      [11, s, s, _, _, _, 9, 11, 14, s, s, s, s, s, s, s],
      [_, _, _, _, 9, s, s, s, s, s, 12, s, 14, s, 16, s],
      [9, s, 12, s, 9, s, 12, s, 14, s, 12, s, 11, s, 9, s],
    ],
    [
      [4, 2, 4, 6, 7, s, s, s, 11, s, _, _, 7, s, s, s],
      [0, s, 0, s, 4, s, s, s, 7, s, _, _, 4, s, s, s],
      [7, s, 11, s, 7, s, _, _, 7, s, s, s, 11, s, s, s],
    ],
    [
      [6, 4, 6, 7, 9, s, s, s, 14, s, _, _, 9, s, s, s],
      [2, s, 2, s, 6, s, s, s, 11, s, _, _, 6, s, s, s],
      [9, s, 12, s, 9, s, _, _, 9, s, s, s, 12, s, s, s],
    ],
    [
      [4, 2, 4, 6, 7, s, 6, 4, 6, 7, 9, s, 11, 12, 11, 12],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [7, s, s, s, _, _, 9, s, s, s, _, _, 11, s, 12, s],
    ],
    [
      [14, 12, 11, 9, 2, 4, 6, 7, 14, s, s, s, s, s, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [14, s, s, s, s, s, s, s, _, _, 12, s, 11, s, 9, s],
    ],
    [
      [7, s, s, s, s, s, s, s, 2, s, s, s, 9, s, s, s],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [7, s, 11, s, 7, s, 11, s, 7, s, 11, s, 7, s, 11, s],
    ],
    [
      [11, s, s, s, 12, s, s, s, 14, s, s, s, s, s, s, s],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [9, s, 12, s, 9, s, 12, s, 14, s, 12, s, 11, s, 9, s],
    ],
    [
      [14, s, s, s, s, s, s, s, 11, s, s, s, 18, s, s, s],
      [7, s, s, s, s, s, s, s, s, s, s, s, s, s, s, s],
      [7, s, 11, s, 7, s, 11, s, 7, s, 11, s, 7, s, 11, s],
    ],
    [
      [16, s, s, s, 18, s, s, s, 19, s, 18, s, 16, s, 18, s],
      [12, s, s, s, s, s, s, s, 11, s, s, s, 9, s, s, s],
      [9, s, 12, s, 9, s, 12, s, 14, s, 12, s, 11, s, 9, s],
    ],
    [
      [19, s, s, s, _, _, _, _, _, _, _, _, _, _, _, _],
      [7, s, s, s, _, _, _, _, _, _, _, _, _, _, _, _],
      [7, s, s, s, _, _, _, _, _, _, _, _, _, _, _, _],
    ],
  ],
};
