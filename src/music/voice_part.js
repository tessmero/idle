/**
 * @file VoicePart object type.
 * Sheet music for one player for one song.
 */
class VoicePart {

  #chordProg;
  #melody;

  /**
   *
   * @param chordProg
   * @param melody
   */
  constructor(chordProg, melody) {
    this.#chordProg = chordProg;
    this.#melody = melody;
  }

  /**
   * @param repIndex
   * @param measureIndex
   * @param beatIndex
   */
  getNotes(repIndex, measureIndex, beatIndex) {
    const freqs = this.#chordProg[measureIndex];
    const measure = this.#melody[measureIndex % this.#melody.length];

    return measure.buildNotesForBeat(beatIndex, freqs);
  }
}
