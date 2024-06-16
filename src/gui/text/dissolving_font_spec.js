/**
 * @file Dissolving Font Specification
 */
class DissolvingFontSpec extends FontSpec {

  #solidity = 1;

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);
  }

  /**
   * Chainable helper to set how solid vs dissolved characters will appear.
   * At solidity 0, the text is invisible.
   * @param {number} s The solidity value [0-1].
   */
  withSolidity(s) {
    this.#solidity = s;
    return this;
  }

  /**
   * Override FontSpec. If solidity is less than one,
   * skip drawing some pixels based on reproducible RNG.
   */
  skipPixel() {
    return rand() > this.#solidity;
  }

  /**
   *
   */
  get solidity() { throw new Error('not allowed'); }

  /**
   *
   */
  set solidity(_s) { throw new Error(''); }

}
