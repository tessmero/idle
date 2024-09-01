/**
 * @file LabelTooltip a tooltip with only text
 */
class LabelTooltip extends Tooltip {
  _layoutData = TOOLTIP_LAYOUT;

  /**
   *
   */
  static defaultScale = 0.3;

  #innerLabel;

  /**
   * get rect using LabelTooltip.pickRect
   * @param {number[]} rect The rectangle to align text in.
   * @param {object} params The parameters.
   * @param {string} params.innerLabel The text content to display.
   */
  constructor(rect, params = {}) {
    super(rect, params);
    const { innerLabel } = params;
    this.#innerLabel = innerLabel;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    return [
      ...super._buildElements(),

      new GuiElement(this._layout.label, {
        label: this.#innerLabel,
        scale: this.scale,
        textAlign: 'left',
      }),
    ];
  }

  /**
   *
   * @param {GameScreen} screen
   * @param {string} label
   * @param {number} scale
   */
  static pickRect(screen, label, scale = null) {
    let s = scale;
    if (!s) { s = LabelTooltip.defaultScale; }

    let [w, h] = getTextDims(label, s);
    w = w + 2 * global.tooltipPadding;
    h = h + 2 * global.tooltipPadding;
    const anchorPoint = Tooltip.pickMouseAnchorPoint(screen);

    // make sure tooltip spans away from cursor
    const mp = screen.mousePos.add(v(0.01, 0.01)); // center or top-left of cursor
    const notClear = va(anchorPoint, mp); // don't want tooltip on this point
    const clearPoint = mp.sub(mp.sub(notClear).mul(100)); // somewhere on other side of mousePos

    return Tooltip.pickTooltipRect(anchorPoint, clearPoint, w, h);
  }
}
