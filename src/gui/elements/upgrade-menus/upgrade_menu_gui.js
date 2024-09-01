
/**
 * @file PauseMenuGui
 * Top-level GUI container that appears when the menu button is clicked.
 */
class UpgradeMenuGui extends Gui {
  _titleKey = 'upgrade-menu-gui';
  _layoutData = UPGRADE_MENU_GUI_LAYOUT;
  _soundData = UPGRADE_MENU_GUI_SOUNDS;

  #tabGroup;

  /**
   * Construct Gui with given rectangle.
   * @param {number[]} rect The rectangle to align elements in.
   * @param  {object} params The gui element parameters.
   */
  constructor(rect, params = {}) {
    super(rect, params);

    // prepare for tiled transition effect
    const sc = rectCorners(...this.rect);
    const sr = this.rect;

    this.transitionRect = sr;
    this.transitionTileSize = 0.065 * avg(sr[2], sr[3]);
    const tr = this.transitionRect;
    const ts = this.transitionTileSize;
    const w = Math.ceil(tr[2] / ts);
    const h = Math.ceil(tr[3] / ts);
    this.nTransitionTiles = w * h;

    this.maxTransitionRadius = sc[0].sub(sc[2]).getMagnitude();
    this.transitionSpeed = 6e-2 * this.transitionTileSize; // radius increase per ms
    this.transitionCenter = va(sc[0], sc[2]);// state
    this.transitionRadius = 0;// state
  }

  /**
   * Make HUD appear behind the upgrade menu.
   */
  getBackgroundGui() {
    return this.screen.stateManager.getGuiForState(GameStates.playing);
  }

  /**
   * Construct upgrade menu gui elements.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const r0 = layout.main;

    let tabLabels; let tabContents;
    if (global.sandboxMode) {
      tabLabels = ['tests', 'debug', 'performance',
        'skills',
        'UPGRADES',
        'STATS',
        'layouts',
        'music',

      ];
      tabContents = [
        (rect, params) => new TestsTab(rect, params),
        (rect, params) => new DebugTab(rect, params),
        (rect, params) => new PerformanceTab(rect, params),

        (rect, params) => new SkillsTab(rect, params),
        (rect, params) => new UpgradesTab(rect, params),
        (rect, params) => new StatsTab(rect, params),
        (rect, params) => new LayoutsTab(rect, params),
        (rect, params) => new MusicTab(rect, params),

      ];

    }
    else {
      tabLabels = ['UPGRADES', 'STATS'];
      tabContents = [
        (rect, params) => new UpgradesTab(rect, params),
        (rect, params) => new StatsTab(rect, params),
      ];
    }
    const tabGroup = new TabPaneGroup([...r0], {
      titleKey: 'upgrade-menu-tab-group',
      tabLabels,
      tabContents,
    });
    this.#tabGroup = tabGroup;

    const closeButton = new Button(layout.closeBtn, {
      titleKey: 'upgrade-menu-close-btn',
      icon: xIcon,
      action: () => this.gsm.toggleStats(),
      scale: 0.5,
      tooltip: 'close upgrades menu',
    });

    return [tabGroup, closeButton];
  }

  /**
   *
   */
  open() {

    // restart transition animation
    this.transitionRadius = 0;

    // restart animation in current tab
    // as if we just switched to it from another tab
    const i = this.#tabGroup._pState.selectedTabIndex;
    this.#tabGroup._pState.selectedTabIndex = -1;
    this.#tabGroup.setSelectedTabIndex(i);

    this._sounds.open.play();

    // close context menu
    this.screen.setContextMenu(null);
  }

  /**
   *
   */
  close() {

    // close context menu
    this.screen.setContextMenu(null);

    // restart transition animation
    this.transitionRadius = 0;

    this._sounds.close.play();
  }

  /**
   * Used in updateTransitionEffect
   * @returns {boolean} True if this gui is visible (even if not technically active)
   */
  _isVisible() {
    let gui = this.gsm.screen.gui;
    while (gui) {
      if (gui === this) {
        return true;
      }
      gui = gui.getBackgroundGui();
    }
    return false;
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   */
  updateTransitionEffect(dt) {

    const screen = this.screen;
    if (!screen) { return; }
    const n = this.nTransitionTiles;
    if ((!screen._upgradeMenuTransitionEffect) || (screen._upgradeMenuTransitionEffect.length !== n)) {
      screen._upgradeMenuTransitionEffect = new Array(n).fill(false);
    }

    // advance transition radius if necessary
    if (this.transitionRadius < this.maxTransitionRadius) {
      this.transitionRadius = this.transitionRadius + dt * this.transitionSpeed;

      // check if the upgrade menu is visible
      const tval = this._isVisible();

      // set transition effect within radius
      const md2 = Math.pow(this.transitionRadius, 2);
      const tc = this.transitionCenter;
      const tr = this.transitionRect;
      const ts = this.transitionTileSize;
      const w = Math.ceil(tr[2] / ts);
      const h = Math.ceil(tr[3] / ts);
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          const dx = tc.x - (tr[0] + x * ts);
          const dy = tc.y - (tr[1] + y * ts);
          if ((dx * dx + dy * dy) < md2) { screen._upgradeMenuTransitionEffect[x * h + y] = tval; }
        }
      }
    }
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawTransitionEffect(g) {

    if (!global.gfxEnabled) {

      // graphical effects disabled
      return;
    }

    const screen = this.screen;
    if ((!screen) || (!screen._upgradeMenuTransitionEffect)) { return; }

    // invert colors for center rectangle
    const tr = this.transitionRect;
    const ts = this.transitionTileSize;
    const w = Math.ceil(tr[2] / ts);
    const h = Math.ceil(tr[3] / ts);
    g.globalCompositeOperation = 'xor';
    g.fillStyle = global.colorScheme.fg;

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        if (screen._upgradeMenuTransitionEffect[x * h + y]) {
          g.fillRect(tr[0] + x * ts, tr[1] + y * ts, ts, ts);
        }
      }
    }

    g.globalCompositeOperation = 'source-over';

  }
}
