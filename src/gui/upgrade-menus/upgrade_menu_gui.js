
/**
 * @file PauseMenuGui
 * Top-level GUI container that appears when the menu button is clicked.
 */
class UpgradeMenuGui extends Gui {
  title = 'Upgrade Menu';
  layoutData = UPGRADE_GUI_LAYOUT;

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);

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
   * Construct upgrade menu gui elements for the given game screen.
   * @param {GameScreen} screen The screen in need of gui elements.
   * @param {object} layout The rectangles computed from css layout data.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  buildElements(screen, layout) {
    const r0 = layout.r0;

    let tabLabels; let tabContent;
    if (global.sandboxMode) {
      tabLabels = ['debug', 'tests', 'performance', 'skills'];
      tabContent = [
        (rect) => new DebugTab(rect),
        (rect) => new TestsTab(rect),
        (rect) => new PerformanceTab(rect),
        (rect) => new SkillsTab(rect),
      ];

    }
    else {

      // let tabLabels = ['upgrades','skills','stats','debug']
      tabLabels = ['UPGRADES', 'STATS'];
      tabContent = [
        (rect) => new UpgradesTab(rect),

        // rect => new SkillsTab(rect),
        (rect) => new StatsTab(rect),

        // rect => new DebugTab(rect),
      ];
    }
    const tabGroup = new TabPaneGroup([...r0], tabLabels, tabContent);
    if (global.upgradeMenuTabIndex) { tabGroup.setSelectedTabIndex(global.upgradeMenuTabIndex); }
    tabGroup.addTabChangeListener((i) => {
      global.upgradeMenuTabIndex = i;
    });

    const closeButton = new IconButton(layout.closeBtn, xIcon, () => this.gsm.toggleStats())
      .withScale(0.5)
      .withTooltip('close upgrades menu');
    tabGroup.addChild(closeButton);

    return [closeButton, tabGroup];

  }

  /**
   *
   */
  open() {
    // restart transition animation
    this.transitionRadius = 0;
  }

  /**
   *
   */
  close() {
    // close context menu
    this.screen.contextMenu = null;

    // restart transition animation
    this.transitionRadius = 0;
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

      // check if the upgrade menu is open
      const tval = (this.gsm.state === GameStates.upgradeMenu);

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
