/**
 * @file
 */
class GuiTest extends Test {

  /**
   *
   */
  constructor() {
    super('Gui Test', new GuiTestMacro());
  }

  /**
   * Mock hud and upgrade menu Guis.
   * @returns {GameStateManager} The state manager for this test.
   */
  getGameStateManager() {
    const gsm = new GameStateManager();
    gsm.rebuildGuis = (screen, resetState = true) => {
      gsm.gameScreen = screen;

      // start with hud visible
      if (resetState) {
        gsm.gameState = GameStates.playing;
      }

      // prepare only hud and upgrade menu
      const sr = screen.rect;
      gsm.allGuis = [
        null,
        null,
        new HudGui(sr),
        new UpgradeMenuGui(sr),
        null,
      ];

      // remove most of the contents of the two guis
      this._mockHud(gsm);
      this._mockMenu(gsm);

      //
      gsm.allGuis.forEach((k) => {
        if (k === null) { return; }
        k.gsm = gsm;
        k.children = k.buildElements(screen);
        k.setScreen(screen);
      });
      const gui = gsm.allGuis[gsm.gameState];
      screen.setGui(gui);
    };

    return gsm;
  }

  /**
   * leave only upgrade menu button in HUD
   * @param {GameStateManager} gsm The state manager to modify
   */
  _mockHud(gsm) {
    const hud = gsm.allGuis[GameStates.playing];

    // hud_gui.js
    hud._be = hud.buildElements;

    const s = global.tutorialScaleFactor;
    hud.buildElements = (r) => {

      // omitt all but first element
      const [menuBtn] = hud._be(r);

      // shrink and remove tooltip
      const result = [menuBtn];
      result.forEach((e) => {
        e.rect[2] = e.rect[2] * s;
        e.rect[3] = e.rect[3] * s;
        e.setScale(e.scale * s);
        e.withTooltip(null);
      });
      return result;
    };
  }

  /**
   * Remove all tabs and buttons from upgrade menu, leaving only a rectangle.
   * @param {GameStateManager} gsm The state manager to modify
   */
  _mockMenu(gsm) {

    const menu = gsm.allGuis[GameStates.upgradeMenu];

    // upgrade_menu_gui.js
    menu._be = menu.buildElements;

    menu.buildElements = (r) => {
      const elems = menu._be(r);
      const [_closeButton, tabGroup] = elems;

      // remove tab group contents
      // add one button that does nothing
      const scale = 0.3;
      const label = 'upgrade';
      const [w, h] = getTextDims(label, scale);
      const rect = padRect(0, 0, w, h, h / 2);
      const [x, y] = rectCenter(...tabGroup.rect);
      rect[0] = x - rect[2] / 2;
      rect[1] = y - rect[3] / 2;
      tabGroup.children = [new TextButton(rect, label, () => {}).withScale(scale)];
      tabGroup.tabContent.forEach((tc) => { tc.children = []; });

      // ommit close button
      return [tabGroup];
    };
  }

  /**
   *
   * @param {GameScreen} screen
   */
  getTestAssertions(screen) {
    const sm = screen.stateManager;
    const sim = screen.sim;

    return [
      // time, label, func
      [500, 'state = playing', () => sm.gameState === GameStates.playing],
      [500, 'current gui is HUD', () => screen.gui instanceof HudGui],

      // 1300 click menu button
      // 3300 click in menu
      [3500, 'state = uprade menu', () => sm.gameState === GameStates.upgradeMenu],
      [3500, 'current gui is menu', () => screen.gui instanceof UpgradeMenuGui],

      // 4400-4800 drag on backround outside of menu
      [4800, 'floaters visible', () => sim.floaters.activeCount > 0],
      [4800, 'state = playing', () => sm.gameState === GameStates.playing],

      // 5500-6200 click 4x on menu button
      [6500, 'state = playing', () => sm.gameState === GameStates.playing],
    ];
  }
}
