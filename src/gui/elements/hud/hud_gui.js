
/**
 * @file HudGui Heads Up Display
 * Top-level GUI container that appears during gameplay.
 */
class HudGui extends Gui {
  title = 'hud gui';
  _layoutData = HUD_GUI_LAYOUT;

  /**
   * Construct HUD elements.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const screen = this.screen;
    const sim = screen.sim;
    this.sim = sim;

    // build top hud
    let result = [

      // upgrade menu button
      new Button(layout.topLeftBtn, {
        icon: statsIcon,
        action: () => { this.gsm.toggleStats(); },
        tooltip: 'toggle upgrades menu',
        fill: true,
      }),

      // particles on screen
      new GuiElement(layout.leftDiv, {
        icon: rainIcon,
        labelFunc: () => sim.rainGroup.n.toString(),
        style: 'hud',
        tooltipFunc: () => `max ${sim.rainGroup.n} raindrops on screen`,
        autoAdjustRect: true,
        scale: 0.5,
      }),

      // sandbox banner
      global.sandboxMode ?
        new GuiElement(layout.midDiv, {
          labelFunc: () => 'SANDBOX MODE',
          autoAdjustRect: true,
          scale: 0.5,
        }) : null,

      // catch rate %
      global.sandboxMode ? null :
        new GuiElement(layout.midDiv, {
          icons: catchIcon,
          labelFunc: () => this.getPct(),
          style: 'hud',
          tooltipFunc: () => this.getPctTooltip(),
          autoAdjustRect: true,
          scale: 0.5,
        }),

      // total caught
      global.sandboxMode ? null :
        new GuiElement(layout.rightDiv, {
          icon: collectedIcon,
          labelFunc: () => sim.particlesCollected.toFixed(0),
          style: 'hud',
          tooltipFunc: () => `${sim.particlesCollected.toFixed(0)} raindrops collected`,
          autoAdjustRect: true,
          scale: 0.5,
        }),

    ];

    // remove null placeholders used to
    // conveniently toggle things above
    result = result.filter(Boolean);

    // add an important button to the top right
    result.push(screen.boxOuterScreen ?

      // exit box button if this screen is inside a box
      new Button(layout.topRightBtn, {
        icon: boxIcon,
        action: () => this.gsm.quit(),
        tooltip: 'exit box',
        fill: true,
      }) :

      // otherwise pause button
      new Button(layout.topRightBtn, {
        icon: pauseIcon,
        action: () => this.gsm.pause(),
        tooltip: 'pause or quit the game',
        fill: true,
      })
    );

    // append toolbar buttons
    const toolbarButtons = this._buildToolbarButtons();
    result = result.concat(toolbarButtons);

    return result;
  }

  /**
   *
   * @param {object} g The graphics context
   */
  draw(g) {
    super.draw(g);

    // draw upgrade menu gui transition effect
    const menuGui = this.screen.stateManager.getGuiForState(GameStates.upgradeMenu);
    if (menuGui) { menuGui.drawTransitionEffect(g); } // upgrade_menu.js
  }

  /**
   * Construct toolbar elements for the given game screen.
   * @returns {GuiElement[]} The toolbar elements for the screen.
   */
  _buildToolbarButtons() {
    const screen = this.screen;
    const layout = this._layout;

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
      const tooltip = tool.tooltipText;

      // build button
      const button = new ToolbarButton(slots[i], {
        tool,
        indexInToolbar: i,
        tooltipFunc: () => {
          const ttpr = ToolbarTooltip.pickRect(this.screen, tooltip);
          const innerScreen = ToolbarTooltip.getTutorialScreen(tool);
          return new ToolbarTooltip(ttpr, { innerLabel: tooltip, innerScreen, tool });
        },
      });

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
    screen.setContextMenu(null);

    // switch to default tool / mouse cursor
    screen.setTool(screen.toolList[0]);
  }
}
