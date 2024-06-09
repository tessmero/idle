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
   *
   * @param a
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
