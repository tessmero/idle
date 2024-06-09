/**
 * @file VoiceNote A single note in sheet music.
 */
class MusicNote {
  #volume = 0.02;
  #frequency;

  #delay;
  #sustain;

  /**
   * Create a new note.
   * @param {number} freq Pitch of note in hertz.
   * @param {number} delay Beats to delay note.
   * @param {number} sustain Beats to hold note.
   */
  constructor(freq, delay = 0, sustain = 0.5) {
    this.#frequency = freq;

    this.#delay = delay;
    this.#sustain = sustain;
  }

  /**
   *
   */
  get volume() { return this.#volume; }

  /**
   *
   */
  get frequency() { return this.#frequency; }

  /**
   *
   */
  get delay() { return this.#delay; }

  /**
   *
   */
  get sustain() { return this.#sustain; }
}
