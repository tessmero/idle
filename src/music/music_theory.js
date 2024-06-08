/**
 * @file Utilities involving named notes and intervals.
 */

const _scalesAndChords = {
  majorScale: [0, 2, 4, 5, 7, 9, 11],
  minorScale: [0, 2, 3, 5, 7, 8, 10],
  naturalMinorScale: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinorScale: [0, 2, 3, 5, 7, 8, 11],
  melodicMinorScale: [0, 2, 3, 5, 7, 9, 11],
  pentatonicMajorScale: [0, 2, 4, 7, 9],
  pentatonicMinorScale: [0, 3, 5, 7, 10],
  bluesScale: [0, 3, 5, 6, 7, 10],
  chromaticScale: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  majorChord: [0, 4, 7],
  minorChord: [0, 3, 7],
  diminishedChord: [0, 3, 6],
  augmentedChord: [0, 4, 8],
  majorSeventhChord: [0, 4, 7, 11],
  minorSeventhChord: [0, 3, 7, 10],
  dominantSeventhChord: [0, 4, 7, 10],
  halfDiminishedSeventhChord: [0, 3, 6, 10],
  diminishedSeventhChord: [0, 3, 6, 9],
};

const _namedNotes = {
  'A2': 110.00,
  'A#2': 116.54,
  'B2': 123.47,
  'C3': 130.81,
  'C#3': 138.59,
  'D3': 146.83,
  'D#3': 155.56,
  'E3': 164.81,
  'F3': 174.61,
  'F#3': 185.00,
  'G3': 196.00,
  'G#3': 207.65,
  'A3': 220.00,
  'A#3': 233.08,
  'B3': 246.94,
  'C4': 261.63,
  'C#4': 277.18,
  'D4': 293.66,
  'D#4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'G4': 392.00,
  'G#4': 415.30,
  'A4': 440.00,
  'A#4': 466.16,
  'B4': 493.88,
  'C5': 523.25,
  'C#5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'E5': 659.25,
  'F5': 698.46,
  'F#5': 739.99,
  'G5': 783.99,
  'G#5': 830.61,
  'A5': 880.00,
};

function musicFreqs(rootNoteName, scaleName) {
  const scaleSteps = _scalesAndChords[scaleName];

  const noteNames = Object.keys(_namedNotes);
  const rootIndex = noteNames.indexOf(rootNoteName);
  const scale = [];

  for (const step of scaleSteps) {
    const noteIndex = (rootIndex + step) % noteNames.length;
    noteName = noteNames[noteIndex];
    scale.push(_namedNotes[noteName]);
  }

  return scale;
}
