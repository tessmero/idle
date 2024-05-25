// specification for drawing single layer
// of   some specific text on screen
/**
 *
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

  // override FontSpec
  // skip drawing some pixels
  /**
   *
   */
  skipPixel() {
    return rand() > this.solidity;
  }
}
