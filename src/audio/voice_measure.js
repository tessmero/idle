/**
 * @file VoicMeasure
 * One measure in the sheet music for one voice.
 */
class VoiceMeasure {

  #allNotes = [];

  /**
   * Construct measure frame given note/chord/rest arrays.
   * @param {...number[][]} beats The the scale indices for each beat.
   */
  constructor(...beats) {

    // Beat Index
    let bi = 0;

    // iterate over Chords In each Beat
    beats.forEach((cib) => {

      // Chord Index
      let ci = 0;

      // iteate over Notes In each Chord
      cib.forEach((nic) => {
        const t = bi + ci / nic.length;
        const dur = 1 / nic.length;
        nic.forEach((scaleIndex) => {
          this.addNote(t, dur, scaleIndex);
        });

        ci = ci + 1;
      });

      bi = bi + 1;
    });
  }

  /**
   *
   * @param {number} delay The number of beats from the start of this measure.
   * @param {number} sustain The number of beats to hold.
   * @param {number} scaleIndex The pitch of the note.
   */
  addNote(delay, sustain, scaleIndex) {
    this.#allNotes.push([delay, sustain, scaleIndex]);
  }

  /**
   *
   * @param {number} beatIndex The beat index in this measure.
   * @param {number[]} scaleFreqs The list of note frequencies in the current music key.
   */
  buildNotesForBeat(beatIndex, scaleFreqs) {

    return this.#allNotes
      .filter((n) => (n[0] >= beatIndex) && (n[0] < (beatIndex + 1)))
      .map(([delay, sustain, scaleIndex]) => {
        const freq = scaleFreqs[scaleIndex % scaleFreqs.length];
        return new MusicNote(freq, delay - beatIndex, sustain);
      });
  }

  /**
   * Chainable helper to add sustain to all notes.
   */
  withSustainThroughGaps() {

    return this;
  }
}
