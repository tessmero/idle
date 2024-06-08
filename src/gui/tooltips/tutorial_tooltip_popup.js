/**
 * a tooltip with some text and inner screen running a macro
 */
const _allTutorialScreens = {};

/**
 *
 */
class TutorialTooltipPopup extends LabelTooltipPopup {

  /**
   * get rect using TutorialTooltipPopup.pickRect
   * @param rect
   * @param label
   * @param innerScreen
   * @param scale
   */
  constructor(rect, label, innerScreen, scale = null) {
    super(rect, label, scale);

    // position inner screen below label
    const sdims = global.tutorialSimDims;
    const x = rect[0] + (rect[2] / 2) - (sdims[0] / 2);
    const y = rect[1] + 0.1;
    const r = [x, y, ...sdims];

    // add inner screen to this gui
    const gsp = new GuiScreenPanel(r, innerScreen, true);
    this.children.unshift(gsp);
    this.gsp = gsp;
  }

  /**
   *
   * @param macro
   * @param titleKey
   */
  static getTutorialScreen(macro, titleKey) {
    if (!(titleKey in _allTutorialScreens)) {
      const sim = new TutorialPSim();
      const gsm = new BlankGSM();
      const screen = new GameScreen(titleKey, sim.rect, sim, gsm, macro);
      _allTutorialScreens[titleKey] = screen;
    }
    return _allTutorialScreens[titleKey];
  }

  /**
   *
   */
  static scale() { return 0.4; }

  /**
   *
   * @param screen
   * @param label
   * @param scale
   */
  static pickRect(screen, label, scale = null) {
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

    const p = TooltipPopup.pickMouseAnchorPoint(screen);
    return TooltipPopup.pickTooltipRect(p, w, h);
  }

}
