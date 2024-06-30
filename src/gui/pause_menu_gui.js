
/**
 * @file PauseMenuGui
 * Top-level GUI container that appears when the pause button is clicked.
 */
class PauseMenuGui extends Gui {
  title = 'Pause Menu';
  layoutData = PAUSE_GUI_LAYOUT;

  /**
   * Make HUD appear behind the pause menu.
   */
  getBackgroundGui() {
    return this.screen.stateManager.getGuiForState(GameStates.playing);
  }

  /**
   * Construct pause menu gui elements for the given game screen.
   * @param {GameScreen} screen The screen in need of gui elements.
   * @param {object} layout The rectangles computed from css layout data.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  buildElements(screen, layout) {
    const quitLabel = screen === global.rootScreen ? 'QUIT' : 'EXIT BOX';

    return [
      new TextButton(layout.resumeBtn, 'RESUME', () => this.gsm.resume()),
      new TextButton(layout.quitBtn, quitLabel, () => window.location.reload()), // this.gsm.quit()),
    ];
  }
}
