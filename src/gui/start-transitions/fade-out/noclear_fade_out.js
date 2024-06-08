/**
 * @file Unused effect where we turn off screen clearing
 * so the particles gradually draw over the whole screen.
 */
class NoclearFadeOut extends FadeOut {
  /**
   *
   */
  constructor() {
    super();
    this.duration = 5000;
  }

  /**
   * @returns {boolean} True to prevent screen from being cleared.
   */
  stopScreenClear() {
    return true;
  }

  /**
   *
   * @param _g
   * @param _rect
   */
  draw(_g, _rect) {
    // do nothing
  }
}
