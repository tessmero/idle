
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
    return this.gsm.getGuiForState(GameStates.playing);
  }

  /**
   * Construct pause menu gui elements.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const quitLabel = 'QUIT';

    return [
      new Button(layout.resumeBtn, {
        label: 'RESUME',
        fill: true,
        action: () => this.gsm.resume(),
      }),

      new Button(layout.quitBtn, {
        label: quitLabel,
        fill: true,
        action: () => window.location.reload(), // this.gsm.quit()),
      }),
    ];
  }
}
