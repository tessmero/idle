/**
 * @file LabelTooltip a tooltip with only text
 */
class LabelTooltip extends Tooltip {
  _layoutData = TOOLTIP_LAYOUT;

  /**
   *
   */
  static defaultScale = 0.3;

  #label;

  /**
   * get rect using LabelTooltip.pickRect
   * @param {number[]} rect The rectangle to align text in.
   * @param {object} params The parameters.
   * @param {string} params.label The text content to display.
   */
  constructor(rect, params) {
    super(rect, params);
    this.#label = params.label;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    return [
      ...super._buildElements(),

      new TextLabel(this._layout.label, {
        label: this.#label,
        scale: this.scale,
        center: false,
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
    const p = Tooltip.pickMouseAnchorPoint(screen);
    return Tooltip.pickTooltipRect(p, w, h);
  }
}
