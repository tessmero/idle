
/**
 * @file Dissolving Font Specification
 */
class DissolvingFontSpec extends FontSpec {
  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);

    this.solidity = 1; // 0 = fully dissolved
  }

  /**
   *
   * @param s
   */
  withSolidity(s) {
    this.solidity = s;
    return this;
  }

  /**
   * Skip drawing some pixels based on reproducible RNG.
   */
  skipPixel() {
    return rand() > this.solidity;
  }
}
