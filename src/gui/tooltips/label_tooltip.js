/**
 * @file LabelTooltip a tooltip with only text
 */
class LabelTooltip extends Tooltip {
  _layoutData = TOOLTIP_LAYOUT;

  /**
   * get rect using LabelTooltip.pickRect
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
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    return [...super._buildElements(),

      new TextLabel(this._layout.label, this.label)
        .withScale(this.scale)
        .withCenter(false),
    ];
  }

  /**
   *
   */
  static scale() { return 0.3; }

  /**
   *
   * @param {GameScreen} screen
   * @param {string} label
   * @param {number} scale
   */
  static pickRect(screen, label, scale = null) {

    let s = scale;
    if (!s) { s = LabelTooltip.scale(); }
    let [w, h] = getTextDims(label, s);
    w = w + 2 * global.tooltipPadding;
    h = h + 2 * global.tooltipPadding;
    const p = Tooltip.pickMouseAnchorPoint(screen);
    return Tooltip.pickTooltipRect(p, w, h);
  }
}
