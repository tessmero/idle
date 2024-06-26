/**
 * @file LabelTooltipPopup gui element.
 *
 * a tooltip with just text
 */
class LabelTooltipPopup extends TooltipPopup {

  /**
   * get rect using LabelTooltipPopup.pickRect
   * @param {number[]} rect The rectangle to align text in.
   * @param {string} label The text content to display.
   * @param {number} scale The font size to display.
   */
  constructor(rect, label, scale = null) {
    super(rect);
    this.label = label;

    let s = scale;
    if (!s) { s = this.constructor.scale(); }
    this.setScale(s);

    const rr = padRect(...rect, -global.tooltipPadding);
    this.addChild(
      new TextLabel(rr, label)
        .withScale(s)
        .withCenter(false));
  }

  /**
   *
   */
  static scale() { return 0.4; }

  /**
   *
   * @param {GameScreen} screen
   * @param {string} label
   * @param {number} scale
   */
  static pickRect(screen, label, scale = null) {

    let s = scale;
    if (!s) { s = LabelTooltipPopup.scale(); }
    let [w, h] = getTextDims(label, s);
    w = w + 2 * global.tooltipPadding;
    h = h + 2 * global.tooltipPadding;
    const p = TooltipPopup.pickMouseAnchorPoint(screen);
    return TooltipPopup.pickTooltipRect(p, w, h);
  }
}
