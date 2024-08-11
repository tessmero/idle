/**
 * @file wrapper for Float32Array constructor
 */
class FloatArray {
  static nConstructed = 0;
  static totalFloat32Alloc = 0;

  /**
   * @param {number} n Desired size of array.
   */
  constructor(n) {
    FloatArray.nConstructed = FloatArray.nConstructed + 1;
    FloatArray.totalFloat32Alloc = FloatArray.totalFloat32Alloc + n;

    // eslint-disable-next-line no-restricted-syntax
    this.inner = new Float32Array(n);
  }

  /**
   * @returns {Float32Array} wrapped array instance.
   */
  get() {
    return this.inner;
  }
}
