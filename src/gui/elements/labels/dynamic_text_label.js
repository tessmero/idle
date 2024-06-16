/**
 * @file DynamicTextLabel gui element
 * on-screen text that may change even if the gui element is persistent.
 */
class DynamicTextLabel extends TextLabel {

  /**
   * Construct a new label that will refer to the given function when drawing.
   * @param {number[]} rect The rectangle to align text in.
   * @param {Function} labelFunc The function who's returned string will be display.
   */
  constructor(rect, labelFunc) {
    super(rect, '');
    this.labelFunc = labelFunc;
  }

  /**
   * Chainable helper to set automatic resize.
   * Used to make HUD displays precisely hoverable as their values change.
   * @param {boolean} a True if the bounding rectangle
   *                    should resize when text updates.
   */
  withAutoAdjustRect(a) {
    this.autoAdjustRect = a;
    return this;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {

    // get updated label
    const label = this.labelFunc();
    this.setLabel(label);

    if (this.autoAdjustRect) {
      // update bounding rectangle to fit label
      const [w, h] = getTextDims(label, this.scale);
      this.rect[2] = w + this.pad * 2;
      this.rect[3] = h + this.pad * 2;
    }

    super.draw(g);
  }
}
