/**
 * @file DynamicTextLabel gui element
 * on-screen text that may change even if the gui element is persistent.
 */
class DynamicTextLabel extends TextLabel {
  #labelFunc;
  #autoAdjustRect;

  /**
   * Construct a new label that will refer to the given function for text.
   * @param {number[]} rect The rectangle to align text in.
   * @param {object} params The parameters.
   * @param {string} params.labelFunc The function to get text to display.
   * @param {boolean} params.autoAdjustRect True to enable automatic resize.
   *                                        Used to make HUD displays precisely
   *                                        hoverable as their values change.
   */
  constructor(rect, params) {
    super([...rect], { ...params, label: '' });

    this.#labelFunc = params.labelFunc;
    this.#autoAdjustRect = params.autoAdjustRect;
  }

  /**
   * @param {boolean} _a True if the bounding rectangle
   *                    should resize when text updates.
   */
  withAutoAdjustRect(_a) {
    throw new Error('should use constructor');
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {

    // get updated label
    const label = this.#labelFunc();
    this.setLabel(label);

    if (this.#autoAdjustRect) {
      // update bounding rectangle to fit label
      const [w, h] = getTextDims(label, this.scale);
      this.rect[2] = w + this.pad * 2;
      this.rect[3] = h + this.pad * 2;
    }

    super.draw(g);
  }
}
