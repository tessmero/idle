/**
 * @file VoicMeasure base class
 * One specific immutable measure in one voice's sheet music.
 */
class VoiceMeasure {

  #allNotes = [];

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
