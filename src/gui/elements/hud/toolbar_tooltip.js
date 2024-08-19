
/**
 * @file ToolbarTooltip tooltip with tutorial sim
 * and a budget/cost indicator
 */
const _allTutorialScreens = {};

/**
 *
 */
class ToolbarTooltip extends LabelTooltip {
  _layoutData = TOOLBAR_TOOLTIP_LAYOUT;

  #innerScreen;
  #tool;

  /**
   * get rect using ToolbarTooltip.pickRect
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters.
   * @param {string} params.label
   * @param {GameScreen} params.innerScreen The tutorial screen to display inside the popup.
   * @param {Tool} params.tool
   */
  constructor(rect, params = {}) {
    super(rect, { ...params, scale: 0.4 });

    const { innerScreen, tool } = params;

    this.#innerScreen = innerScreen;
    this.#tool = tool;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const result = super._buildElements();
    const layout = this._layout;
    const screen = this.screen;
    const innerScreen = this.#innerScreen;
    const tool = this.#tool;

    // add inner screen to this gui
    const gsp = new GuiScreenPanel(layout.sim, { innerScreen, allowScaling: true });
    result.unshift(gsp);
    this.gsp = gsp;

    if (tool.getCost()) {

      // apply f to budget,cost
      const bc = (f) => {
        const b = screen ? screen.sim.particlesCollected : 0;
        const c = tool.getCost();
        return f(b, c);
      };

      // text readout
      result.push(new GuiElement(layout.cost, {
        icon: collectedIcon,
        labelFunc: () => bc((budget, cost) => {
          if (budget > cost) { return `${cost.toFixed(0)}`; }
          return `${budget.toFixed(0)}/${cost.toFixed(0)}`;
        }),
        textAlign: 'center',
        scale: 0.35,
      }));

      // progress bar overlay
      result.push(new ProgressIndicator(layout.cost, {
        valueFunc: () => bc((budget, cost) => budget / cost),
      }));
    }

    return result;
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

    const p = Tooltip.pickMouseAnchorPoint(screen);
    const r = Tooltip.pickTooltipRect(p, w, h);

    return r;
  }

}
