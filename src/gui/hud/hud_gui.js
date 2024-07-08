
/**
 * @file HudGui Heads Up Display
 * Top-level GUI container that appears during gameplay.
 */
class HudGui extends Gui {
  title = 'hud gui';
  _layoutData = HUD_GUI_LAYOUT;

  /**
   * Construct HUD elements for the given game screen.
   * @param {GameScreen} screen The screen in need of gui elements.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  buildElements(screen) {
    const layout = this.layoutRects(screen);
    const sim = screen.sim;
    this.sim = sim;

    // build top hud
    let result = [

      // upgrade menu button
      new IconButton(layout.topLeftBtn,
        statsIcon, () => { this.gsm.toggleStats(); }
      ).withTooltip('toggle upgrades menu'),

      // particles on screen
      new StatReadout(layout.leftDiv, rainIcon, () =>
        sim.rainGroup.n.toString())
        .withStyle('hud')
        .withDynamicTooltip(() => `max ${sim.rainGroup.n} raindrops on screen`)
        .withAutoAdjustRect(true),

      // sandbox banner
      global.sandboxMode ?
        new DynamicTextLabel(layout.midDiv, () => 'SANDBOX MODE')
          .withAutoAdjustRect(true)
          .withScale(0.5) :
        null,

      // catch rate %
      global.sandboxMode ? null :
        new StatReadout(layout.midDiv, catchIcon, () => this.getPct())
          .withStyle('hud')
          .withDynamicTooltip(() => this.getPctTooltip())
          .withAutoAdjustRect(true),

      // total caught
      global.sandboxMode ? null :
        new StatReadout(layout.rightDiv, collectedIcon, () =>
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
      new IconButton(layout.topRightBtn, boxIcon, () => this.gsm.quit())
        .withTooltip('exit box') :

      // otherwise pause button
      new IconButton(layout.topRightBtn, pauseIcon, () => this.gsm.pause())
        .withTooltip('pause or quit the game'));

    // append toolbar buttons
    const toolbarButtons = this._buildToolbarButtons(screen, layout);
    result = result.concat(toolbarButtons);

    return result;
  }

  /**
   * Construct toolbar elements for the given game screen.
   * @param {GameScreen} screen The screen in need of toolbar elements.
   * @returns {GuiElement[]} The toolbar elements for the screen.
   */
  _buildToolbarButtons(screen) {
    const layout = this.layoutRects(screen);

    // decide which tools will be available
    let toolList = screen.toolList;
    if (!global.sandboxMode) {

      // remove sandbox-only tools
      const toRemove = [PiTool, ExpTool];
      toolList = toolList.filter((t) => !toRemove.some((clazz) => t instanceof clazz));
    }

    // layout toolbar at bottom of screen
    const tr = layout.toolbar;
    const nbuttons = toolList.length;
    const padding = 0.005;
    const buttonWidth = tr[3] - padding * 2;
    const rowWidth = buttonWidth * nbuttons + padding * (nbuttons + 1);
    const brow = [tr[0] + tr[2] / 2 - rowWidth / 2, tr[1], rowWidth, tr[3]];
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
          const innerScreen = ToolbarTooltipPopup.getTutorialScreen(tool);
          return new ToolbarTooltipPopup(ttpr, tooltip, this.screen, innerScreen, tool);
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
