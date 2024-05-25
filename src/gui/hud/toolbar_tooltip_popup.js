// a tooltip with some text and a simulation
// also shows tool cost with progress indicator
/**
 *
 */
class ToolbarTooltipPopup extends TutorialTooltipPopup {

  // get rect using ToolbarTooltipPopup.pickRect
  /**
   *
   * @param rect
   * @param label
   * @param tut
   * @param tool
   * @param scale
   */
  constructor(rect, label, tut, tool, scale = null) {
    super(rect, label, tut, scale);

    if (tool.getCost()) {

      // prepare gui elements to show cost
      let r = padRect(...rect, -global.tooltipPadding);
      const h = ToolbarTooltipPopup.piHeight();
      r = [r[0], r[1] + r[3] - h, r[2], h];

      /**
       *
       * @param f
       */
      function bc(f) { // apply f to budget,cost
        const b = global.mainSim.particlesCollected;
        const c = tool.getCost();
        return f(b, c);
      }

      // text readout
      this.children.push(new StatReadout(r, collectedIcon,
        () => bc((budget, cost) => {
          if (budget > cost) { return `${cost.toFixed(0)}`; }
          return `${budget.toFixed(0)}/${cost.toFixed(0)}`;
        }))
        .withCenter(true));

      // progress bar overlay
      this.children.push(new ProgressIndicator(r,
        () => bc((budget, cost) => budget / cost)));
    }
  }

  /**
   *
   */
  static piHeight() { return 0.05; } // thickness of progress bar
  /**
   *
   * @param screen
   * @param label
   * @param scale
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
