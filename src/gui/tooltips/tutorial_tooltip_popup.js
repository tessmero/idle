// a tooltip with some text and a simulation
class TutorialTooltipPopup extends LabelTooltipPopup {

  // get rect using TutorialTooltipPopup.pickRect
  constructor(rect, label, tut, scale = null) {
    super(rect, label, scale);

    // Tutorial instance
    this.tut = tut;

    // position simulation below label
    const sdims = global.tutorialSimDims;
    const x = rect[0] + (rect[2] / 2) - (sdims[0] / 2);
    const y = rect[1] + 0.1;
    const r = [x, y, ...sdims];

    // ParticleSim instance
    const sim = tut.getSim();
    this.sim = sim;

    // add gui element to show simulation
    const gsp = new GuiScreenPanel(r, new GameScreen(r, sim, null, tut));
    gsp.tut = tut;
    this.children.unshift(gsp);
    this.gsp = gsp;
  }

  static scale() { return 0.4; }
  static pickRect(label, scale = null) {
    let s = scale;
    if (!s) { s = TutorialTooltipPopup.scale(); }
    let [w, h] = getTextDims(label, s);

    // / make space for gui sim under label
    const [tw, th] = global.tutorialSimDims;
    if (w < tw) { w = tw; }
    h = h + th;

    const pad = global.tooltipPadding;
    w = w + pad * 2;
    h = h + pad * 2;
    h = h + 0.1;

    const p = TooltipPopup.pickMouseAnchorPoint(w, h);
    return TooltipPopup.pickTooltipRect(p, w, h);
  }

}
