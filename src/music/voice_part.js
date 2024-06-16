/**
 * @file VoicePart object type.
 * Sheet music for one player for one song.
 */
class VoicePart {

  #chordProg;
  #melody;

  /**
   *
   * @param {number[][]} chordProg All note frequencies used in the song.
   * @param {object[]} melody The VoiceMeasure instances.
   */
  constructor(chordProg, melody) {
    this.#chordProg = chordProg;
    this.#melody = melody;
  }

  /**
   * @param {number} repIndex
   * @param {number} measureIndex
   * @param {number} beatIndex
   */
  getNotes(repIndex, measureIndex, beatIndex) {
    const freqs = this.#chordProg[measureIndex];
    const measure = this.#melody[measureIndex % this.#melody.length];

    return measure.buildNotesForBeat(beatIndex, freqs);
  }
}
