// black grid gradually covers start menu
/**
 *
 */
class NoclearFadeOut extends FadeOut {
  /**
   *
   */
  constructor() {
    super();
    this.duration = 5000;
  }

  // overide FadeOut
  /**
   *
   */
  stopScreenClear() {
    return true;
  }

  // implement FadeOut
  /**
   *
   * @param _g
   * @param _rect
   */
  draw(_g, _rect) {
    // do nothing
  }
}
