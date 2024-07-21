/**
 * @file wrapper for Float32Array constructor
 */
class FloatArray {

  /**
   * @param {number} n Desired size of array.
   */
  constructor(n) {

    // eslint-disable-next-line no-restricted-syntax
    this.inner = new Float32Array(n);

    // src/daemons/screen_manager.js
    ScreenManager().submitNewArray(n);
  }

  /**
   * @returns {Float32Array} wrapped array instance.
   */
  get() {
    return this.inner;
  }
}
