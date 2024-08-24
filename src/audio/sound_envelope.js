/**
 * @file SoundEnvelope object that adjusts gain nodes
 * starting from flat 'volume' over 'duration'
 * then applying 'env' referencing data/sound_env_data.js
 */
class SoundEnvelope {

  #vt; // volume-time pairs
  #repeatDur; // optional repeat-after duration
  #volume; // base volume
  #duration; // total duration of sound effect

  /**
   *
   * @param {object} params
   * @param {number} params.volume
   * @param {number} params.duration
   * @param {string} params.env Reference to sound envelope data
   */
  constructor(params = {}) {
    const { volume, duration, env } = params;

    this.#volume = volume;
    this.#duration = duration;

    // parse sound envelope data
    this.#vt = SOUND_ENVELOPES[env].flatMap((point) => {
      if (Object.hasOwn(point, 'repeat')) {
        this.#repeatDur = point.repeat;
        return [];
      }

      let time;
      if (Object.hasOwn(point, 'start')) {
        time = this._parseVal(point.start, duration);
      }
      else if (Object.hasOwn(point, 'end')) {
        time = duration - this._parseVal(point.end, duration);
      }

      return [{
        time,
        volume: this._parseVal(point.volume, volume),
      }];
    });

  }

  /**
   *
   */
  get volume() { return this.#volume; }

  /**
   *
   * @param {string|number} value
   * @param {number} reference
   */
  _parseVal(value, reference) {
    if (typeof value === 'string' && value.endsWith('%')) {
      return parseFloat(value) / 100 * reference;
    }
    return value * reference;
  }

  /**
   *
   * @param {object} gainNode
   * @param {number} startTime
   */
  applyEnvelope(gainNode, startTime) {
    let repOffset = 0;
    let first = true;
    while (repOffset < this.#duration) {
      for (const { volume, time } of this.#vt) {

        // allow volume of 0 to work
        let realVol = Math.max(1e-5, volume);

        const absoluteTime = startTime + repOffset + time;

        // workaround browser starting loud
        realVol = (absoluteTime < 0.1) ? 1e-10 : realVol;

        if (first) {
          gainNode.gain.setValueAtTime(realVol, absoluteTime);
          first = false;
        }
        else {
          gainNode.gain.exponentialRampToValueAtTime(realVol, absoluteTime);
        }
      }

      if (this.#repeatDur) {
        repOffset = repOffset + this.#repeatDur;
      }
      else {
        return;
      }
    }
  }

}
