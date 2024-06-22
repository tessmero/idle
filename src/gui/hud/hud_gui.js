
/**
 * @file HudGui Heads Up Display
 * Top-level GUI container that appears during gameplay.
 */
class HudGui extends Gui {

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super('hud gui', ...p);
  }

  /**
   * Construct HUD elements for the given game screen.
   * @param {GameScreen} screen The screen in need of gui elements.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  buildElements(screen) {
    const rect = screen.rect;
    const sim = screen.sim;
    this.sim = sim;

    const sc = rectCorners(...rect);
    let sr = rect;
    const margin = 0.02;
    sr = padRect(...sr, -margin);
    const m = 0.1;

    // layout buttons at top of screen
    const topLeft = [sr[0], sr[1], m, m];
    const topRight = [sc[2].x - m - margin, sr[1], m, m];

    // stat redouts at dop of screen
    const topClp = [sr[0] + sr[2] * 0.1, sr[1] + 0.01];
    const topCenterP = [sr[0] + sr[2] * 0.4, topClp[1]];
    const topCrp = [sr[0] + sr[2] * 0.7, topClp[1]];

    // build top hud
    let result = [

      // upgrade menu button
      new IconButton(topLeft, statsIcon, () => {
        this.gsm.toggleStats();
      }).withTooltip('toggle upgrades menu'),

      // stat readouts constructed with null width and height
      // dims are computed in dynamic_text_label.js

      // particles on screen
      new StatReadout(topClp, rainIcon, () =>
        sim.rainGroup.n.toString())
        .withStyle('hud')
        .withDynamicTooltip(() => `max ${sim.rainGroup.n} raindrops on screen`)
        .withAutoAdjustRect(true),

      // sandbox banner
      global.sandboxMode ?
        new DynamicTextLabel(topCenterP, () => 'SANDBOX MODE')
          .withAutoAdjustRect(true)
          .withScale(0.5) :
        null,

      // catch rate %
      global.sandboxMode ? null :
        new StatReadout(topCenterP, catchIcon, () => this.getPct())
          .withStyle('hud')
          .withDynamicTooltip(() => this.getPctTooltip())
          .withAutoAdjustRect(true),

      // total caught
      global.sandboxMode ? null :
        new StatReadout(topCrp, collectedIcon, () =>
          sim.particlesCollected.toFixed(0))
          .withStyle('hud')
          .withDynamicTooltip(() => `${sim.particlesCollected.toFixed(0)} raindrops collected`)
          .withAutoAdjustRect(true),

    ];

    // remove null placeholders used to
    // conveniently toggle things above
    result = result.filter(Boolean);

    // add an important button to the top right
    result.push(screen.boxOuterScreen ?

      // exit box button if this screen is inside a box
      new IconButton(topRight, boxIcon, () => this.gsm.quit())
        .withTooltip('exit box') :

      // otherwise pause button
      new IconButton(topRight, pauseIcon, () => this.gsm.pause())
        .withTooltip('pause or quit the game'));

    // append toolbar buttons
    result = result.concat(this._buildToolbarButtons(screen));

    return result;
  }

  /**
   * Construct toolbar elements for the given game screen.
   * @param {GameScreen} screen The screen in need of toolbar elements.
   * @returns {GuiElement[]} The toolbar elements for the screen.
   */
  _buildToolbarButtons(screen) {
    const sr = screen.rect;

    // decide which tools will be available
    let toolList = screen.toolList;
    if (!global.sandboxMode) {

      // remove sandbox-only tools
      const toRemove = [PiTool, ExpTool];
      toolList = toolList.filter((t) => !toRemove.some((clazz) => t instanceof clazz));
    }

    // layout toolbar at bottom of screen
    const m = 0.1;
    const nbuttons = toolList.length;
    const padding = 0.005;
    const buttonWidth = m - padding * 2;
    const rowHeight = buttonWidth + padding * 2;
    const rowWidth = buttonWidth * nbuttons + padding * (nbuttons + 1);
    const brow = [sr[0] + sr[2] / 2 - rowWidth / 2, sr[1] + sr[3] - rowHeight, rowWidth, rowHeight];
    const slots = [];
    const sloty = brow[1] + padding;
    for (let i = 0; i < nbuttons; i++) {
      const slotx = brow[0] + padding + i * (buttonWidth + padding);
      slots.push([slotx, sloty, buttonWidth, buttonWidth]);
    }

    const result = [];

    // iterate over tools in toolbar
    for (let i = 0; i < toolList.length; i++) {
      const tool = toolList[i];

      // build button
      const button = new ToolbarButton(slots[i], tool, i);
      const tooltip = tool.tooltipText; // tooltip string

      // check if tutorial available
      const tut = tool.getTutorial();
      if (tut) {

        // build tooltip with string label and tutorial sim
        button.withDynamicTooltip(() => {
          const ttpr = ToolbarTooltipPopup.pickRect(this.screen, tooltip);
          const innerScreen = ToolbarTooltipPopup.getTutorialScreen(tut, tool.tooltipText);
          return new ToolbarTooltipPopup(ttpr, tooltip, innerScreen, tool);
        });

      }
      else {

        // set tooltip string
        // standard text tooltip (gui_element.js)
        button.withTooltip(tooltip);
      }

      result.push(button);
    }

    return result;
  }

  /**
   * Get catch percentage string e.g. '50%'.
   */
  getPct() {
    const sim = this.sim;
    const amt = sim.rainGroup.grabbedParticles.size();
    const total = sim.rainGroup.n;
    const pct = 100 * amt / total;
    return `${pct.toFixed(0)}%`;
  }

  /**
   * get catch percentage explaination string
   */
  getPctTooltip() {
    const sim = this.sim;
    const amt = sim.rainGroup.grabbedParticles.size();
    const total = sim.rainGroup.n;
    return `caught ${amt} / ${total} raindrops`;
  }

  /**
   *
   */
  close() {
    const screen = this.screen;
    const sim = this.sim;

    sim.selectedBody = null;
    sim.selectedParticle = null;
    screen.contextMenu = null;

    // switch to default tool
    screen.setTool(screen.toolList[0]);
  }
}
