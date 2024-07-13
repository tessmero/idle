
/**
 * @file PauseMenuGui
 * Top-level GUI container that appears when the pause button is clicked.
 */
class PauseMenuGui extends Gui {
  title = 'Pause Menu';
  _layoutData = PAUSE_GUI_LAYOUT;

  /**
   * Make HUD appear behind the pause menu.
   */
  getBackgroundGui() {
    return this.screen.stateManager.getGuiForState(GameStates.playing);
  }

  /**
   * Construct pause menu gui elements.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const quitLabel = screen === global.rootScreen ? 'QUIT' : 'EXIT BOX';

    return [
      new TextButton(layout.resumeBtn, 'RESUME', () => this.gsm.resume()),
      new TextButton(layout.quitBtn, quitLabel, () => window.location.reload()), // this.gsm.quit()),
    ];
  }
}
