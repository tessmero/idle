
/**
 * @file ToolbarTooltipPopup gui element.
 * a tooltip with some text and a simulation
 * also shows tool cost with progress indicator
 */
class ToolbarTooltipPopup extends TutorialTooltipPopup {

  /**
   * get rect using ToolbarTooltipPopup.pickRect
   * @param {number[]} rect The rectangle to align elements in.
   * @param {string} label
   * @param {Macro} tut
   * @param {Tool} tool
   * @param {number} scale
   */
  constructor(rect, label, tut, tool, scale = null) {
    super(rect, label, tut, scale);

    if (tool.getCost()) {

      // prepare gui elements to show cost
      let r = padRect(...rect, -global.tooltipPadding);
      const h = ToolbarTooltipPopup.piHeight();
      r = [r[0], r[1] + r[3] - h, r[2], h];

      // apply f to budget,cost
      const bc = (f) => {
        const screen = this.screen;
        const b = screen ? screen.sim.particlesCollected : 0;
        const c = tool.getCost();
        return f(b, c);
      };

      // text readout
      this.addChild(new StatReadout(r, collectedIcon,
        () => bc((budget, cost) => {
          if (budget > cost) { return `${cost.toFixed(0)}`; }
          return `${budget.toFixed(0)}/${cost.toFixed(0)}`;
        }))
        .withCenter(true));

      // progress bar overlay
      this.addChild(new ProgressIndicator(r,
        () => bc((budget, cost) => budget / cost)));
    }
  }

  /**
   *
   */
  static piHeight() { return 0.05; } // thickness of progress bar

  /**
   *
   * @param {GameScreen} screen
   * @param {string} label
   * @param {number} scale
   */
  static pickRect(screen, label, scale = null) {

    // start with TutorialTooltipPopup
    const r = TutorialTooltipPopup.pickRect(screen, label, scale);

    // add space for progress indicator
    const dh = ToolbarTooltipPopup.piHeight();
    r[3] = r[3] + dh;
    r[1] = r[1] - dh;

    return r;
  }

}
