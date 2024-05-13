
let _upgradeMenuTransitionEffect = null;

class UpgradeMenuGui extends Gui {

  constructor(...p) {
    super(...p);

    // prepare for tiled transition effect
    const sc = global.screenCorners;
    const sr = global.screenRect;

    this.transitionRect = sr;
    this.transitionTileSize = 0.1;
    const tr = this.transitionRect;
    const ts = this.transitionTileSize;
    const w = Math.ceil(tr[2] / ts);
    const h = Math.ceil(tr[3] / ts);
    const n = w * h;

    if ((!_upgradeMenuTransitionEffect) || (_upgradeMenuTransitionEffect.length !== n)) {
      _upgradeMenuTransitionEffect = new Array(n).fill(false);
    }

    this.maxTransitionRadius = sc[0].sub(sc[2]).getMagnitude();
    this.transitionSpeed = 6e-3; // radius increase per ms
    this.transitionCenter = v(0.5, 0.5);// state
    this.transitionRadius = 0;// state
  }

  // override Gui
  getBackgroundGui() {
    return global.allGuis[GameStates.playing];
  }

  // extend Hud
  buildElements() {

    const sc = global.screenCorners;
    const sr = global.screenRect;
    const m = 0.1;
    let w = sr[2] - 2 * m;
    const h = sr[3] - 2 * m;
    const r0 = [sc[0].x + m, sc[0].y + m, w, h];

    let tabLabels; let tabContent;
    if (global.sandboxMode) {
      tabLabels = ['tests', 'DEBUG', 'skills'];
      tabContent = [
        (rect) => new TestsTab(rect),
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
    if (global.upgradeMenuTabIndex) { tabGroup.selectedTabIndex = global.upgradeMenuTabIndex; }
    tabGroup.addTabChangeListener((i) => {
      global.upgradeMenuTabIndex = i;
    });

    w = 0.05;
    const topRight = [r0[0] + r0[2] - w - 0.02, r0[1] + 0.05, w, w];
    const closeButton = new IconButton(topRight, xIcon, toggleStats)
      .withScale(0.5)
      .withTooltip('close upgrades menu');
    tabGroup.children.splice(0, 0, closeButton);

    return [closeButton, tabGroup];

  }

  open() {
    // restart transition animation
    this.transitionRadius = 0;
  }

  close() {
    // close context menu
    global.mainScreen.contextMenu = null;

    // restart transition animation
    this.transitionRadius = 0;
  }

  // called in update.js
  updateTransitionEffect(dt) {

    // advance transition radius if necessary
    if (this.transitionRadius < this.maxTransitionRadius) {
      this.transitionRadius = this.transitionRadius + dt * this.transitionSpeed;

      // check if the upgrade menu is open
      const tval = (global.allGuis && (global.allGuis[global.gameState] === this));

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
          if ((dx * dx + dy * dy) < md2) { _upgradeMenuTransitionEffect[x * h + y] = tval; }
        }
      }
    }
  }

  // called in draw.js
  drawTransitionEffect(g) {

    // invert colors for center rectangle
    const tr = this.transitionRect;
    const ts = this.transitionTileSize;
    const w = Math.ceil(tr[2] / ts);
    const h = Math.ceil(tr[3] / ts);
    g.globalCompositeOperation = 'xor';
    g.fillStyle = global.colorScheme.fg;

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        if (_upgradeMenuTransitionEffect[x * h + y]) {
          g.fillRect(tr[0] + x * ts, tr[1] + y * ts, ts, ts);
        }
      }
    }

    g.globalCompositeOperation = 'source-over';

  }
}
