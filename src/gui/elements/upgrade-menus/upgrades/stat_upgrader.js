
/**
 * @file StatUpgrader one row in the upgrade menu
 * modifies one entry in global.upgradeTracks.state
 */
class StatUpgrader extends CompositeGuiElement {
  _layoutData = STAT_UPGRADER_LAYOUT; // upgrades_tab_layout.js

  #useThickLayout;
  #gutse;

  // animation for progress indicator boxes
  #boxAnimStates;
  #baDuration = 200;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters.
   * @param {boolean} params.useThickLayout True if the double-row layout should be used.
   * @param {object} params.gutse The value in global.upgradeTracks.state.
   */
  constructor(rect, params = {}) {
    super(rect, { ...params, opaque: true });

    const { gutse, useThickLayout } = params;

    if (useThickLayout) {
      this._layoutData = THICK_STAT_UPGRADER_LAYOUT;
    }

    this.#useThickLayout = useThickLayout;
    this.#gutse = gutse;
    const lvls = gutse.maxLevel;
    this.#boxAnimStates = new Array(lvls).fill(-1);
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const screen = this.screen;
    const gutse = this.#gutse;
    const layout = this._layout;

    // upgrade button
    const btn = new ProgressButton(layout.button, {
      label: 'upgrade',
      action: () => this.upgradeButtonClicked(),
      scale: 0.3,
      border: this.#useThickLayout ? new RoundedBorder() : new SlantBorder(),
      valueFunc: () => {
        const budget = screen.sim.particlesCollected;
        const cost = gutse.cost.f(gutse.level - 1);
        return budget / cost;
      },
    });
    this.btn = btn;

    // visual progression display
    this.progressDisplayRect = layout.progress;
    const progLabel = new DynamicTextLabel(layout.progressLabel, {
      labelFunc: () => `LEVEL ${gutse.level}`,
      center: false,
      scale: 0.25,
    });

    // main label
    const dtl = new StatReadout(layout.mainLabel, {
      icon: gutse.icon,
      labelFunc: () => `${gutse.label}`,
      scale: 0.35,
      tooltipScale: 0.35,
      center: false,
    });

    return [btn, dtl, progLabel];
  }

  /**
   * Extend composite component update by advancing progress box animations.
   * @param {number} dt The time elapsed in milliseconds.
   * @param {boolean} disableHover
   */
  update(dt, disableHover = false) {

    // update children
    const hovered = super.update(dt, disableHover);

    // advance progress box animations
    const bas = this.#boxAnimStates;
    const gutse = this.#gutse;
    for (let i = 0; i < gutse.maxLevel; i++) {
      let t = bas[i];
      if (t >= 0) {
        t = t + dt;
        if (t > this.#baDuration) {
          bas[i] = -1; // animation finished
        }
        else {
          bas[i] = t; // animation ongoing
        }
      }
    }

    return hovered;
  }

  /**
   * Called when our child button is clicked.
   */
  upgradeButtonClicked() {
    const gutse = this.#gutse;
    const sim = this.screen.sim;
    const budget = sim.particlesCollected;
    const lvl = gutse.level;
    const cost = gutse.cost.f(lvl - 1);

    // check if upgrade can be purchased
    if (cost > budget) {
      this.setTemporaryTooltip('collect more raindrops!');
      return;
    }
    if (lvl >= gutse.maxLevel) {
      this.setTemporaryTooltip('max level!');
      return;
    }

    // attempt to trigger any related story hooks
    if (gutse.triggers) {
      const sm = StoryManager();
      const block = gutse.triggers.some((hook) => sm.triggerStoryHook(hook));
      if (block) {

        // purchase blocked by story hook
        return;
      }
    }

    // purchase upgrade
    sim.particlesCollected = sim.particlesCollected - cost;
    const screen = this.screen;
    screen.floaters.signalChange(screen.mousePos, -cost);
    gutse.level = gutse.level + 1;
    updateAllBonuses();
    this.setTemporaryTooltip('upgrade purchased!');

    // start animation for one box
    this.#boxAnimStates[gutse.level - 1] = 0;
  }

  /**
   * force temporary tooltip below cursor like UpgradeTooltip
   * @param {GameScreen} screen
   * @param {string} tooltip
   * @param {number} scale
   */
  pickTooltipRect(screen, tooltip, scale) {

    let s = scale;
    if (!s) { s = LabelTooltip.scale(); }
    let [w, h] = getTextDims(tooltip, s);
    w = w + 2 * global.tooltipPadding;
    h = h + 2 * global.tooltipPadding;
    const p = Tooltip.pickMouseAnchorPoint(screen);
    return [p.x, p.y, w, h];
  }

  /**
   * Extend standard composite draw by adding outline and progress display boxes
   * @param {object} g the Graphics context.
   */
  draw(g) {

    // draw children button and label
    super.draw(g);

    // draw visual upgrade level indicator
    this._drawProgressBoxes(g);
  }

  /**
   * @param {object} g the Graphics context.
   */
  _drawProgressBoxes(g) {
    const gutse = this.#gutse;
    const anims = this.#boxAnimStates;
    const boxRects = this._layout.progressBoxes;
    g.strokeStyle = global.colorScheme.fg;
    g.fillStyle = global.colorScheme.fg;
    g.lineWidth = global.lineWidth;
    for (let i = 0; i < gutse.maxLevel; i++) {
      const r = boxRects[i];

      const as = anims[i];
      if (as >= 0) {

        // box is animated
        const h = r[3] * (1 - as / this.#baDuration);
        g.fillRect(r[0], r[1] + h, r[2], r[3] - h);
      }
      else if (i < gutse.level) {
        g.fillRect(...r);
      }
      g.strokeRect(...r);
    }
  }
}
