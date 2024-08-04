/**
 * @file GuiTest Base class for tests involving buttons and menus.
 */
class GuiTest extends Test {

  static closeButtonCenter = v(0.75, 0.25);
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
      const [tabGroup, closeButton] = menu._be();
      const cbc = Test.simPos(gsm.screen.sim, GuiTest.closeButtonCenter);
      closeButton.rect[0] = cbc.x - closeButton.rect[2] / 2;
      closeButton.rect[1] = cbc.y - closeButton.rect[3] / 2;

      // remove tab group contents
      tabGroup._buildElements = () => [
        new CompositeGuiElement(tabGroup.rect, { opaque: true }),
      ];
      tabGroup.tabContent = null;
      return [tabGroup, closeButton];
    };
  }
}
