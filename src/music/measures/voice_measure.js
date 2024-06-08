/**
 * @class VoicMeasure base class
 * One specific immutable measure in one voice's sheet music.
 */
class VoiceMeasure {

  #allNotes = [];

  /**
   *
   * @param delay
   * @param sustain
   * @param scaleIndex
   */
  addNote(delay, sustain, scaleIndex) {
    this.#allNotes.push([delay, sustain, scaleIndex]);
  }

  /**
   *
   * @param beatIndex
   * @param scaleFreqs
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
