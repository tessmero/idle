// a line of text that may change
/**
 *
 */
class DynamicTextLabel extends TextLabel {

  /**
   *
   * @param rect
   * @param labelFunc
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
   * @param g
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
