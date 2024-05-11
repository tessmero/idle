// a tooltip with just text
class LabelTooltipPopup extends TooltipPopup {

  // get rect using LabelTooltipPopup.pickRect
  constructor(rect, label, scale = null) {
    super(rect);
    this.label = label;

    let s = scale;
    if (!s) { s = this.constructor.scale(); }
    this.scale = s;

    const rr = padRect(...rect, -global.tooltipPadding);
    this.children.push(
      new TextLabel(rr, label)
        .withScale(s)
        .withCenter(false));
  }

  static scale() { return 0.4; }

  static pickRect(label, scale = null) {

    let s = scale;
    if (!s) { s = LabelTooltipPopup.scale(); }
    let [w, h] = getTextDims(label, s);
    w = w + 2 * global.tooltipPadding;
    h = h + 2 * global.tooltipPadding;
    const p = TooltipPopup.pickMouseAnchorPoint(w, h);
    return TooltipPopup.pickTooltipRect(p, w, h);
  }
}
