/**
 * @file SoundManager manages an AudioContext instance.
 *
 * Every GameScreen instance has a soundManager member.
 */
class SoundManager {

  #ac; // audio context
  #node; // node for all sounds to pass through

  // unused music vars
  #lastMusicLoop;
  #currentSong;
  #step;
  #chordDur;
  #lookAhead;

  /**
   * Called in game_screen.js
   */
  constructor() {
    this.#ac = new AudioContext();

    // node for all sounds on this screen to pass through
    // this.#node = this.#ac.createWaveShaper();
    // this.#node.curve = this._createFlatClippingCurve(.01); // limit amplitude
    // this.#node.connect(this.#ac.destination);
    this.#node = this.#ac.destination;

    // unused music vars
    this.#lastMusicLoop = this.#ac.currentTime;
    this.#currentSong = new Song();
    this.#step = this.noteDurationToMs(this.#currentSong.bpm, 1 / 4) / 1000;
    this.#chordDur = this.#step * 3.5;
    this.#lookAhead = this.#step / 2;
  }

  /**
   *
   */
  get currentTime() {
    return this.#ac.currentTime;
  }

  /**
   *
   */
  get node() {
    return this.#node;
  }

  /**
   * Called in sound_effect.js
   */
  getAudioContext() {
    return this.#ac;
  }

  /**
   * unused music helper
   * @param {number} bpm
   * @param {number} dur
   */
  noteDurationToMs(bpm, dur) {
    return 60000 * 4 * dur / bpm;
  }

  /**
   * unused music helper
   * @param {object} ac
   * @param {number} time
   * @param {number} dur
   */
  mainMusicLoop(ac, time, dur) {
    this.#currentSong.playBeat(ac, time, dur);
  }

  /**
   * unused music helper
   */
  startMusicLoop() {
    this.#ac.resume();
    setInterval(() => {
      const diff = this.#ac.currentTime - this.#lastMusicLoop;
      if (diff >= this.#lookAhead) {
        const nextNote = this.#lastMusicLoop + this.#step;
        this.mainMusicLoop(this.#ac, nextNote, this.#step);
        this.#lastMusicLoop = nextNote;
      }
    }, 15);
  }
}
