
/**
 * @file PauseMenuGui
 * Top-level GUI container that appears when the pause button is clicked.
 */
class PauseMenuGui extends Gui {

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super('Pause Menu Gui', ...p);
  }

  /**
   * Make HUD appear behind the pause menu.
   */
  getBackgroundGui() {
    return this.screen.stateManager.getGuiForState(GameStates.playing);
  }

  /**
   * Construct pause menu gui elements for the given game screen.
   * @param {GameScreen} screen The screen in need of gui elements.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  buildElements(screen) {
    const sr = screen.rect;

    // layout a column of wide buttons in the middle of the screen
    const pad = 0.005;
    const w = 0.4;
    const h = 0.1;
    const n = 4;
    const th = h * n + pad * (n - 1);
    const x = sr[0] + sr[2] / 2 - w / 2;
    const y = sr[1] + sr[3] / 2 - th / 2;
    const slots = [];
    for (let i = 0; i < n; i++) { slots.push([x, y + i * (h + pad), w, h]); }

    const quitLabel = screen === global.rootScreen ? 'QUIT' : 'EXIT BOX';

    return [
      new TextButton(slots[0], 'RESUME', () => this.gsm.resume()),
      new TextButton(slots[2], quitLabel, () => window.location.reload()), // this.gsm.quit()),
    ];
  }
}
