
/**
 * @file PauseMenuGui
 * Top-level GUI container that appears when the menu button is clicked.
 */
class UpgradeMenuGui extends Gui {

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super('upgrade menu gui', ...p);

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
   *
   * @param screen
   */
  buildElements(screen) {
    const sr = screen.rect;
    const sc = rectCorners(...sr);
    const m = 0.065 * avg(sr[2], sr[3]);
    let w = sr[2] - 2 * m;
    const h = sr[3] - 2 * m;
    const r0 = [sc[0].x + m, sc[0].y + m, w, h];

    let tabLabels; let tabContent;
    if (global.sandboxMode) {
      tabLabels = ['tests', 'performance', 'debug', 'skills'];
      tabContent = [
        (rect) => new TestsTab(rect),
        (rect) => new PerformanceTab(rect),
        (rect) => new DebugTab(rect),
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

    w = 0.05;
    const topRight = [r0[0] + r0[2] - w - 0.02, r0[1] + 0.05, w, w];
    const closeButton = new IconButton(topRight, xIcon, () => this.gsm.toggleStats())
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
   * @param dt
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

  // called in draw.js
  /**
   *
   * @param g
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
