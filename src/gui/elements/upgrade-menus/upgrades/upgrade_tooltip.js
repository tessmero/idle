/**
 * @file UpgradeTooltip tooltip for rows in upgrade menu.
 */
_beforeUtScreen = null;
_afterUtScreen = null;

/**
 *
 */
class UpgradeTooltip extends Tooltip {
  _layoutData = UPGRADE_TOOLTIP_LAYOUT;

  #gutse;

  /**
   *
   * @param {number[]} rect
   * @param {object} params The parameters.
   * @param {object} params.gutse The entry in global.upgradeTracks.state
   */
  constructor(rect, params = {}) {
    super(rect, params);
    const { gutse } = params;
    this.#gutse = gutse;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const screen = this.screen;
    const gutse = this.#gutse;
    const [bef, aft] = this._getScreens();

    // apply f to budget,cost
    const bc = (f) => {
      const b = screen ? screen.sim.particlesCollected : 0;
      const c = gutse.cost.f(gutse.level - 1);
      return f(b, c);
    };

    return [
      new GuiScreenPanel(layout.before, {
        innerScreen: bef,
      }),

      new GuiScreenPanel(layout.after, {
        innerScreen: aft,
      }),

      new GuiElement(layout.label, {
        label: gutse.label,
        scale: 0.4,
      }),

      // text readout
      new GuiElement(layout.cost, {
        icon: collectedIcon,
        labelFunc: () => bc((budget, cost) => {
          if (budget > cost) { return `${cost.toFixed(0)}`; }
          return `${budget.toFixed(0)}/${cost.toFixed(0)}`;
        }),
        textAlign: 'center',
        scale: 0.35,
      }),

      // progress bar overlay
      new ProgressIndicator(layout.cost, {
        valueFunc: () => bc((budget, cost) => budget / cost),
      }),

      new GuiElement(layout.arrow, {
        icon: playIcon,
        scale: 0.4,
      }),

    ];
  }

  /**
   * Get before and after screens for the given upgrade track.
   * @param {object} _upgrade
   */
  _getScreens(_upgrade) {
    if (!_beforeUtScreen) {
      _beforeUtScreen = this._buildThumbnailScreen('before upgrade thumbnail');
    }
    if (!_afterUtScreen) {
      _afterUtScreen = this._buildThumbnailScreen('after upgrade thumbnail');
    }

    // apply track-specific prep functions
    this._defaultCard(_beforeUtScreen);
    this.#gutse.beforeCard(_beforeUtScreen);

    this._defaultCard(_afterUtScreen);
    this.#gutse.afterCard(_afterUtScreen);

    return [_beforeUtScreen, _afterUtScreen];
  }

  /**
   * apply default settings to screen for thumbnail
   * @param {GameScreen} screen
   */
  _defaultCard(screen) {
    if (screen._lastGutse === this.#gutse) {
      return;
    }
    screen.sim.rainGroup.n = 10;
    screen.sim.fallSpeed = 3e-5;
    screen.macro = null;
    screen.setTool(null);
    screen._lastGutse = this.#gutse;
  }

  /**
   *
   * @param {string} titleKey
   */
  _buildThumbnailScreen(titleKey) {
    const sim = new ThumbnailPSim();
    const gsm = new BlankGSM();
    const tut = new DefaultToolTutorial();
    const result = new GameScreen(titleKey, sim.rect, sim, gsm, tut);

    result._defaultTut = tut; // used in data/upgrade_tracks_data.js

    return result;
  }

  /**
   * Pick the location to display tooltip
   * @param {GameScreen} screen The screen that will contain the tooltip.
   * @returns {number[]} The computed x,y,w,h for the tooltip.
   */
  static pickRect(screen) {
    const h = 0.3;
    const w = h * phi * 3 / 4;

    const p = Tooltip.pickMouseAnchorPoint(screen);

    // force down and right
    const r = [p.x, p.y, w, h];// Tooltip.pickTooltipRect(p, w, h);

    // move to left
    if (screen.mousePos.x > 0.5) {
      r[0] = r[0] - r[2];
    }

    return r;

  }

}
