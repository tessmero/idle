/**
 * @file TutorialTooltipPopup gui element
 * a tooltip with some text and inner screen running a macro
 */
const _allTutorialScreens = {};

/**
 *
 */
class TutorialTooltipPopup extends LabelTooltipPopup {

  /**
   * get rect using TutorialTooltipPopup.pickRect
   * @param {number[]} rect The rectangle to align elements in.
   * @param {string} label
   * @param {GameScreen} innerScreen
   * @param {number} scale The font size.
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
   * @param {Macro} macro
   * @param {string} titleKey
   */
  static getTutorialScreen(macro, titleKey) {
    if (!(titleKey in _allTutorialScreens)) {
      const sim = new TutorialPSim();
      const gsm = new BlankGSM();
      const screen = new GameScreen(titleKey, sim.rect, sim, gsm, macro);
      if (macro instanceof BoxToolTutorial) {
        screen.prebuiltBoxScreen = BoxBuddy.buildInnerScreen(screen);
      }
      _allTutorialScreens[titleKey] = screen;
    }
    return _allTutorialScreens[titleKey];
  }

  /**
   * @returns {number} Font size.
   */
  static scale() { return 0.4; }

  /**
   * Pick the location to display a tooltip with enough space
   * for a tutorial simulation and the given label.
   * @param {GameScreen} screen The screen that will contain the tooltip.
   * @param {string} label The text that the tooltip will need room for.
   * @param {number} scale The font size of the text to make room for.
   * @returns {number[]} The computed x,y,w,h for the tooltip.
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
