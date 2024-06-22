/**
 * @file GameStateManager object type and state flag eumeration.
 *
 * Every GameScreen instance has a stateManager member.
 */
const GameStates = {
  startMenu: 0,
  startTransition: 1,
  playing: 2,
  upgradeMenu: 3,
  pauseMenu: 4,
  boxTransition: 5,
};

/**
 * manages the overall state of a GameScreen
 */
class GameStateManager {

  _screen;
  _state;
  _guis;

  /**
   * @returns {?Gui} The currently active Gui.
   */
  get currentGui() { return this.getGuiForState(this._state); }

  /**
   * @param {number} s The value in the GameStates enumeration.
   * @returns {?Gui} The the corresponding gui.
   */
  getGuiForState(s) { return this._guis[s]; }

  /**
   *
   * @param {GameScreen} screen The screen that will contain the guis.
   * @param {boolean} resetState
   */
  rebuildGuis(screen, resetState = false) {
    this._screen = screen;
    if (resetState) {
      this._state = GameStates.startMenu;
    }
    const sr = screen.rect;

    const guis = Object.keys(GameStates)
      .map((state) => this._buildGuiForState(GameStates[state], sr));
    guis.filter(Boolean).forEach((gui) => {
      gui.gsm = this;
      gui.setChildren(gui.buildElements(screen));
      gui.setScreen(screen);
    });
    this._guis = guis;

    const currentGui = guis[this._state];
    screen.setGui(currentGui);
  }

  /**
   * called in rebuildGuis()
   * @param {GameState} state
   * @param {number[]} sr The screen rectangle to allign the gui inside of.
   */
  _buildGuiForState(state, sr) {
    switch (state) {
    case GameStates.startMenu:
      return new StartMenuGui(sr);

    case GameStates.startTransition:
      return new StartTransitionGui(sr);

    case GameStates.playing:
      return new HudGui(sr);

    case GameStates.upgradeMenu:
      return new UpgradeMenuGui(sr);

    case GameStates.pauseMenu:
      return new PauseMenuGui(sr);

    case GameStates.boxTransition:
      return new BoxTransitionGui(sr);

    default:
      return null;
    }
  }

  /**
   *
   */
  set screen(_s) { throw new Error('not allowed'); }

  /**
   *
   */
  set state(_s) { throw new Error('not allowed'); }

  /**
   *
   */
  set gameScreen(_s) { throw new Error('not allowed'); }

  /**
   *
   */
  get gameScreen() { throw new Error('should use screen'); }

  /**
   *
   */
  get gameState() { throw new Error('should use state'); }

  /**
   *
   */
  get allGuis() { throw new Error('not allowed'); }

  /**
   *
   */
  get screen() { return this._screen; }

  /**
   *
   */
  get state() { return this._state; }

  /**
   *
   */
  hideWebsiteOverlays() {
    if (this._screen !== global.mainScreen) {
      return;
    }
    const ids = ['navbar', 'source-link'];
    ids.forEach((id) => {
      const elem = document.getElementById(id);
      if (elem) { elem.style.display = 'none'; }
    });
  }

  /**
   *
   */
  showWebsiteOverlays() {
    if (this._screen !== global.mainScreen) {
      return;
    }
    const ids = ['navbar', 'source-link'];
    ids.forEach((id) => {
      const elem = document.getElementById(id);
      if (elem) { elem.style.display = 'block'; }
    });
  }

  /**
   *
   * @param {number} s The new state value in GameStates.
   * @param {object} params The extra parameters, used for box transition gui.
   */
  setState(s, params = {}) {

    this._state = s;
    this.rebuildGuis(this._screen, false);

    const gui = this.currentGui;
    if (gui) { gui.setStateParams = params; }

    global.shiftHeld = false;
    global.controlHeld = false;
  }

  /**
   * toggle the stats / upgrades menu overlay
   */
  toggleStats() {
    if (this._state === GameStates.upgradeMenu) {
      this.setState(GameStates.playing);
    }
    else {
      this._screen.sim.selectedBody = null; // close context menu
      this.setState(GameStates.upgradeMenu);
    }
  }

  /**
   * user clicked play button on start menu
   */
  playClicked() {
    if (this._screen !== global.mainScreen) {
      return;
    }

    // close context menu
    this._screen.sim.selectedBody = null;

    // begin full start transition
    global.sandboxMode = false;
    this.hideWebsiteOverlays();
    this.setState(GameStates.startTransition);
  }

  /**
   *
   */
  resume() {
    if (this._screen !== global.mainScreen) {
      return;
    }

    this.setState(GameStates.playing);
    this.hideWebsiteOverlays();
  }

  /**
   *
   */
  play() {
    if (this._screen !== global.mainScreen) {
      return;
    }

    // reset for good measure
    // (should have been reset during transition)
    resetProgression();
    this.resume();
  }

  /**
   * user clicked sandbox button on start menu
   */
  sandboxClicked() {
    const skipTransition = true;
    global.sandboxMode = true;
    this.hideWebsiteOverlays();

    if (skipTransition) {

      // skip transition=
      setColorScheme(ColorScheme.sandbox);
      this.play();

    }
    else {

      // do short transition
      this.setState(GameStates.startTransition);
    }
  }

  /**
   * called in start_transition_gui.js
   * Called near the end of the transition, when the hud is about to become visible.
   */
  startTransitionFadeInStarted() {
    if (this._screen === global.rootScreen) {
      resetProgression();
    }
  }

  /**
   * called in start_transition_gui.js
   */
  startTransitionFinished() {
    if (global.sandboxMode) {
      setColorScheme(ColorScheme.sandbox);
    }
    this.play();
  }

  /**
   * Called when pause button is clicked.
   */
  pause() {
    if (this._screen !== global.mainScreen) {
      return;
    }

    if (this._state === GameStates.pauseMenu) {
      this.setState(GameStates.playing);
    }
    else {
      this.setState(GameStates.pauseMenu);
    }
    this.hideWebsiteOverlays();
  }

  /**
   * Called when quit/exit button is clicked in pause menu.
   */
  quit() {
    const screen = this._screen;

    if (screen !== global.mainScreen) {
      return;
    }

    if (screen === global.rootScreen) {
      // quit game
      global.sandboxMode = false;
      this.setState(GameStates.startMenu);
      this.showWebsiteOverlays();
      resetGame();

    }
    else {

      // attempt to exit box
      const outerScreen = BoxBuddy.getParentScreen(screen);
      if (outerScreen) {

        // trigger screen change before animation
        screen.gsp.setInnerScreen(outerScreen);

        // trigger box animation
        const boxBuddy = screen.containingBoxBuddy;
        outerScreen.stateManager.setState(GameStates.boxTransition, {
          fromSquare: BoxTransitionGui._car(screen.gsp.rect),
          toSquare: BoxTransitionGui._car(boxBuddy.square),
          toScreen: null });
      }
    }
  }
}
