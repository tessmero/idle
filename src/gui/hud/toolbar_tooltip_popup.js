
/**
 * @file ToolbarTooltipPopup gui element.
 * a tooltip with some text and a simulation
 * also shows tool cost with progress indicator
 */
const _allTutorialScreens = {};

/**
 *
 */
class ToolbarTooltipPopup extends LabelTooltipPopup {
  _layoutData = TOOLBAR_TOOLTIP_LAYOUT;

  /**
   * get rect using ToolbarTooltipPopup.pickRect
   * @param {number[]} rect The rectangle to align elements in.
   * @param {string} label
   * @param {GameScreen} screen The outer screen for icon scale for css layout (needs cleanup)
   * @param {GameScreen} innerScreen The tutorial screen to display inside the popup.
   * @param {Tool} tool
   * @param {number} scale
   */
  constructor(rect, label, screen, innerScreen, tool, scale = null) {
    super(rect, label, scale);
    const layout = this.layoutRects(screen);

    // add inner screen to this gui
    const gsp = new GuiScreenPanel(layout.sim, innerScreen, true);
    this.children.unshift(gsp);
    this.gsp = gsp;

    if (tool.getCost()) {

      // apply f to budget,cost
      const bc = (f) => {
        const b = screen ? screen.sim.particlesCollected : 0;
        const c = tool.getCost();
        return f(b, c);
      };

      // text readout
      this.addChild(new StatReadout(layout.cost, collectedIcon,
        () => bc((budget, cost) => {
          if (budget > cost) { return `${cost.toFixed(0)}`; }
          return `${budget.toFixed(0)}/${cost.toFixed(0)}`;
        }))
        .withCenter(true)
        .withScale(0.35));

      // progress bar overlay
      this.addChild(new ProgressIndicator(layout.cost,
        () => bc((budget, cost) => budget / cost)));
    }
  }

  /**
   *
   * @param {Tool} tool
   */
  static getTutorialScreen(tool) {
    const macro = tool.getTutorial();
    const titleKey = tool.tooltipText;
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
   * @param {string} _label The text that the tooltip will need room for.
   * @returns {number[]} The computed x,y,w,h for the tooltip.
   */
  static pickRect(screen, _label) {
    const w = 0.4;
    const h = w / (phi / 2);

    const p = TooltipPopup.pickMouseAnchorPoint(screen);
    const r = TooltipPopup.pickTooltipRect(p, w, h);

    return r;
  }

}
