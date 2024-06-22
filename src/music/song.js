/**
 * @file Song
 */
class Song {

  bpm = 80;

  #voices;
  #voiceParts;

  #timeSig;
  #chordProg;

  #repIndex = 0;
  #measureIndex = 0;
  #beatIndex = 0;
  #beatTime = 0;
  #beatsPerMeasure = 4;

  /**
   *
   */
  constructor() {

    // AABBA
    const cp = [
      ['F3', 'minorChord'],
      ['F3', 'minorChord'],
    ];
    this.#chordProg = cp;

    const chordFreqs = cp.map((chord) => musicFreqs(...chord));
    chordFreqs.forEach((entry) => entry.push(entry[0] * 2));

    this.#voices = [
      new Voice(),
      new Voice().withOctaveChange(1),
    ];

    const basody = [
      new VoiceMeasure([[0], [1]], [[0], [1]], [[0], [1]], [[0], [1]]),
      new VoiceMeasure([[2], [0]], [[2], [0]], [[2], [0]], [[2], [0]]),
    ];

    const melody = [
      new VoiceMeasure([[0], [1], [0]], [[1], [0], [1]], [[0], [1], [0]], [[1], [0], [1]]),
      new VoiceMeasure([[2], [0], [2]], [[0], [2], [0]], [[2], [0], [2]], [[0], [2], [0]]),
    ];

    this.#voiceParts =
      [
        new VoicePart(chordFreqs, basody),
        new VoicePart(chordFreqs, melody),
      ];

  }

  /**
   *
   */
  get timeSig() { return this.#timeSig; }

  /**
   * Schedule notes for the next beat.
   * @param {object} ac The audio context.
   * @param {number} t
   * @param {number} beatDuration
   */
  playBeat(ac, t, beatDuration) {
    const voices = this.#voices;
    const parts = this.#voiceParts;
    const ri = this.#repIndex;
    const mi = this.#measureIndex;
    const bi = this.#beatIndex;

    // iterate over voices
    const n = voices.length;
    for (let vi = 0; vi < n; vi++) {
      const notesToPlay = parts[vi].getNotes(ri, mi, bi);
      notesToPlay.forEach((note) =>
        voices[vi].playNote(ac, t, note, beatDuration));
    }

    // advance through sheet music
    this._advanceBeatIndex();
  }

  /**
   *
   */
  _advanceBeatIndex() {
    let mi = this.#measureIndex;
    let bi = this.#beatIndex;

    bi = bi + 1;
    if (bi >= this.#beatsPerMeasure) {
      bi = 0;
      mi = mi + 1;
      if (mi >= this.#chordProg.length) {
        mi = 0;
        this.#repIndex = this.#repIndex + 1;
      }
    }

    this.#measureIndex = mi;
    this.#beatIndex = bi;
  }
}
