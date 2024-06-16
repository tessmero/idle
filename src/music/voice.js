/**
 * @file Voice base class for musical instruments.
 * A voice has it's own part in a song.
 */
class Voice {

  #fmul = 1;
  #type = 'sine';

  /**
   * Chainable method to adjust pitch by n octaves.
   * @param  {number} n number of octaves to increase pitch.
   */
  withOctaveChange(n) {
    this.#fmul = this.#fmul * Math.pow(2, n);
    return this;
  }

  /**
   * Set oscillator type "sine","square","sawtooth","triangle", or "custom".
   * @param {string} t The new type for this voice.
   */
  withType(t) {
    this.#type = t;
    return this;
  }

  /**
   *
   * @param {object} ac The audio context to output to.
   * @param {number} time The time when the note should start.
   * @param {object} note The sheet music note to play.
   * @param {number} beatDuration
   */
  playNote(ac, time, note, beatDuration) {
    // play current melody note
    const osc = ac.createOscillator();
    osc.type = this.#type;// "sine","square","sawtooth","triangle","custom"
    osc.frequency.value = note.frequency * this.#fmul;

    const startTime = time + note.delay * beatDuration;
    const endTime = startTime + note.sustain * beatDuration;

    const gainNode = ac.createGain();
    gainNode.gain.setValueAtTime(note.volume, startTime);

    osc.connect(gainNode);
    gainNode.connect(ac.destination);
    osc.start(startTime);
    osc.stop(endTime);
  }
}
