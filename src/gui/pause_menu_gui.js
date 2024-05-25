
/**
 *
 */
class PauseMenuGui extends Gui {

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super('Pause Menu Gui', ...p);
  }

  // override Gui
  /**
   *
   */
  getBackgroundGui() {
    return this.screen.stateManager.allGuis[GameStates.playing];
  }

  // implement Gui
  /**
   *
   * @param screen
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

    return [
      new TextButton(slots[0], 'RESUME', () => this.gsm.resume()), // game_states.js
      new TextButton(slots[2], 'QUIT', () => this.gsm.quit()), // game_states.js
    ];
  }
}
