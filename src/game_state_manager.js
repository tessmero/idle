
const GameStates = {
  startMenu: 0,
  startTransition: 1,
  playing: 2,
  upgradeMenu: 3,
  pauseMenu: 4,
};

/**
 * manages the overall state of a GameScreen
 */
class GameStateManager {

  /**
   *
   * @param screen
   * @param resetState
   */
  rebuildGuis(screen, resetState = true) {
    this.gameScreen = screen;
    if (resetState) {
      this.gameState = GameStates.startMenu;
    }
    const sr = screen.rect;
    this.allGuis = [
      new StartMenuGui(sr),
      new StartTransitionGui(sr, true),
      new HudGui(sr),
      new UpgradeMenuGui(sr),
      new PauseMenuGui(sr),
    ];
    this.allGuis.forEach((k) => {
      k.gsm = this;
      k.children = k.buildElements(screen);
      k.setScreen(screen);
    });
    const gui = this.allGuis[this.gameState];
    screen.setGui(gui);
  }

  /**
   *
   */
  hideWebsiteOverlays() {
    if (this.gameScreen !== global.mainScreen) {
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
    if (this.gameScreen !== global.mainScreen) {
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
   * @param s
   */
  setState(s) {
    this.gameState = s;
    this.rebuildGuis(this.gameScreen, false);

    global.shiftHeld = false;
    global.controlHeld = false;
  }

  /**
   * toggle the stats / upgrades menu overlay
   */
  toggleStats() {
    if (this.gameState === GameStates.upgradeMenu) {
      this.setState(GameStates.playing);
    }
    else {
      this.gameScreen.sim.selectedBody = null; // close context menu
      this.setState(GameStates.upgradeMenu);
    }
  }

  /**
   * user clicked play button on start menu
   */
  playClicked() {
    if (this.gameScreen !== global.mainScreen) {
      return;
    }

    global.sandboxMode = false;

    // show full start transition
    this.hideWebsiteOverlays();
    this.setState(GameStates.startTransition);
  }

  /**
   *
   */
  resume() {
    if (this.gameScreen !== global.mainScreen) {
      return;
    }

    this.setState(GameStates.playing);
    this.hideWebsiteOverlays();
  }

  /**
   *
   */
  play() {
    if (this.gameScreen !== global.mainScreen) {
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
   */
  startTransitionFinished() {
    if (global.sandboxMode) {
      setColorScheme(ColorScheme.sandbox);
    }
    this.play();
  }

  /**
   *
   */
  pause() {
    if (this.gameScreen !== global.mainScreen) {
      return;
    }

    if (this.gameState === GameStates.pauseMenu) {
      this.setState(GameStates.playing);
    }
    else {
      this.setState(GameStates.pauseMenu);
    }
    this.hideWebsiteOverlays();
  }

  /**
   *
   */
  quit() {
    if (this.gameScreen !== global.mainScreen) {
      return;
    }

    global.sandboxMode = false;
    this.setState(GameStates.startMenu);
    this.showWebsiteOverlays();
    resetGame();
  }

  /**
   * @returns {GameStateManager} new mock instance with no GUIs.
   */
  static blankGsm() {

    const gsm = new GameStateManager();
    gsm.rebuildGuis = (screen) => {
      gsm.gameScreen = screen;
      gsm.allGuis = [
        null, null, null, null, null,
      ];
      screen.setGui(null);
    };
    return gsm;
  }
}
