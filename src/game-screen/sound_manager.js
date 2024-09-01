/**
 * @file SoundManager manages an AudioContext instance.
 *
 * Every GameScreen instance has a soundManager member.
 */
class SoundManager {

  #ac; // audio context
  #node; // node for all sounds to pass through

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
}
