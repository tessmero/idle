/**
 * @file GuiTest Base class for tests involving buttons and menus.
 */
class GuiTest extends Test {

  static closeButtonCenter = v(0.85, 0.25);
  static upgradeButtonCenter = v(0.5, 0.6);

  /**
   * Mock hud and upgrade menu Guis.
   * @returns {GameStateManager} The state manager for this test.
   */
  getGameStateManager() {
    const gsm = new GameStateManager();
    gsm.rebuildGuis = (screen, resetState = true) => {
      gsm._screen = screen;

      // start with hud visible
      if (resetState) {
        gsm._state = GameStates.playing;
      }

      // prepare only hud and upgrade menu
      const sr = screen.rect;
      gsm._guis = [
        null,
        null,
        new HudGui(sr),
        new UpgradeMenuGui(sr),
        null,
      ];

      // remove most of the contents of the two guis
      this._simplifyHud(gsm);
      this._simplifyMenu(gsm);

      //
      gsm._guis.forEach((k) => {
        if (k === null) { return; }
        k.gsm = gsm;
        k.buildElements(screen);
      });
      const gui = gsm.currentGui;
      screen.setGui(gui);
    };

    return gsm;
  }

  /**
   *
   * @param {...any} elems
   */
  _scaleElems(...elems) {
    const s = global.tutorialScaleFactor;
    elems.forEach((e) => {
      e.setScale(s);
      e.withTooltip(null);
    });
  }

  /**
   * leave only upgrade menu button in HUD
   * @param {GameStateManager} gsm The state manager to modify
   */
  _simplifyHud(gsm) {
    const hud = gsm.getGuiForState(GameStates.playing);

    // hud_gui.js
    hud._be = hud._buildElements;

    hud._buildElements = () => {

      // omitt all but first element
      const [menuBtn] = hud._be();

      // shrink and remove tooltip
      this._scaleElems(menuBtn);
      return [menuBtn];
    };
  }

  /**
   * Remove content from upgrade menu.
   * @param {GameStateManager} gsm The state manager to modify
   */
  _simplifyMenu(gsm) {
    const menu = gsm.getGuiForState(GameStates.upgradeMenu);

    // upgrade_menu_gui.js
    menu._be = menu._buildElements;

    menu._buildElements = () => {
      const [closeButton, tabGroup] = menu._be();
      this._scaleElems(closeButton);

      // remove tab group contents
      // add one button that does nothing
      const scale = 0.3;
      const label = 'upgrade';
      const rect = [0.02, 0.04, 0.26, 0.24];
      tabGroup._buildElements = () => [new TextButton(rect, label, () => {}).withScale(scale)];
      tabGroup.tabContent = null;
      return [tabGroup, closeButton];
    };
  }
}
