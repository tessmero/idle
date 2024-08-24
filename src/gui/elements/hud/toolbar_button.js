/**
 * @file ToolbarButton gui element
 * A button in the toolbar at the bottom of the screen.
 */
class ToolbarButton extends CompositeGuiElement {

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters.
   * @param {Tool} params.tool The tool instance.
   * @param {number} params.indexInToolbar The index of this button in the toolbar.
   */
  constructor(rect, params = {}) {
    super(rect, { ...params });

    const {
      tool,
      indexInToolbar,
    } = params;

    this.tool = tool;
    this.indexInToolbar = indexInToolbar;

    this._titleKey = `toolbarButton_${indexInToolbar}`;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const result = [];
    const tool = this.tool;
    const rect = this.rect;

    const btn = new Button(rect, {
      titleKey: `inner_${this._titleKey}`,
      icon: tool.icon,
      action: () => this.click(),
      fill: true,
    });
    btn.isAnimated = (() => // override IconButton
      btn.hovered || (
        this.isSelected() &&
                (this.screen.stateManager.state === GameStates.playing)
      )
    );
    this.button = btn;
    result.push(btn);

    if (tool.getCost()) {
      let r = rect;
      const h = r[3] / 4;
      r = [r[0], r[1] + r[3] - h, r[2], h];
      r = padRect(...r, -0.004);
      const pi = new ProgressIndicator(r, {
        valueFunc: () => this.screen.sim.particlesCollected / tool.getCost(),
        scale: 0.2,
      });
      result.push(pi);
    }

    // prepare to detect when an
    // unusable tool becomes usable
    this.wasUsable = this.tool.isUsable();

    return result;
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   * @param {boolean} disableHover True if mouse hovering should be disabled.
   */
  update(dt, disableHover) {

    const { wasUsable = true } = this._pState;

    // check if tool just became usable
    const usable = this.tool.isUsable();
    if ((!wasUsable) && (usable)) {

      // emmit particles
      const pps = this.screen.sim.leftoverPPS;
      const mis = safeRandRange(1e-5, 2e-5);
      const mas = safeRandRange(1e-4, 2e-4);
      const center = v(...rectCenter(...this.rect));
      const ap = 1;
      for (let i = 0; i < 100; i++) {
        let vel = vp(safeRandRange(-pio2 - ap, -pio2 + ap), randRange(mis, mas));
        vel = v(vel.x, vel.y * 3);
        pps.spawnParticle(center, vel);
      }

      // play sound
      this.screen.sounds.hooray.play();

      // show message
      this.screen.floaters.spawnFloater(center, 'available');

    }
    this._pState.wasUsable = usable;

    // this.button.hoverable = this.tool.isUsable()
    return super.update(dt, disableHover);
  }

  /**
   *
   */
  isSelected() {
    const screen = this.screen;
    return screen && (screen.tool === this.tool);
  }

  /**
   *
   */
  click() {
    if (this.tool.isUsable()) {

      // play click sound
      this.screen.sounds.click.play();

      const screen = this.screen;
      screen.setTool(this.tool);

      // close the upgrades menu if it is open
      if (screen.stateManager.state === GameStates.upgradeMenu) {
        screen.stateManager.toggleStats();
      }

    }
    else {

      // play failed click sound
      this.screen.sounds.dullClick.play();
      this.screen.setTemporaryTooltip('collect more raindrops!');
    }

    return true;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    if (this.isSelected()) {

      // draw extra rectangle to highlight selected
      const outer = this.rect;
      const m = 0.005;
      const inner = [outer[0] + m, outer[1] + m, outer[2] - 2 * m, outer[3] - 2 * m];
      Border.draw(g, inner, { hovered: false, fill: false });
    }
  }
}
