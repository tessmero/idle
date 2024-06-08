
/**
 * @file Start Menu GUI
 * Top-level GUI container that appears when the page is loaded.
 */
const _startMessageSpecs = randChoice([
  [
    [2, 'IDLE RAIN'],
    [3, 'CATCHER'],
  ],
  [
    [2, 'RAIN CATCHER'],
  ],
  [
    [2, 'RAIN'],
    [3, 'CATCHER'],
    [4, 'IDLE'],
  ],
]);

/**
 *
 */
class StartMenuGui extends Gui {

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super('Start Menu Gui', ...p);
  }

  /**
   *
   * @param screen
   */
  buildElements(screen) {
    const sr = screen.rect;
    const specs = _startMessageSpecs;

    // layout a column of wide buttons in the middle of the screen
    const dims = getTextDims('IDLERAINNN');
    const pad = 0.005;
    const w = dims[0] + pad * 10;
    const h = 0.1;
    const n = 10;
    const th = h * n + pad * (n - 1);
    const x = sr[0] + sr[2] / 2 - w / 2;
    const y = 0.01 + sr[1] + sr[3] / 2 - th / 2;
    const slots = [];
    for (let i = 0; i < n; i++) { slots.push([x, y + i * (h + pad), w, h]); }
    this.slots = slots;

    const textPad = 0.01; // padding around letters' pixels

    this.labels = specs.map((s) =>
      new TextLabel(slots[s[0]], s[1])
        .withLetterPixelPad(textPad)
        .withStyle('hud'));

    // rect to contain start and sandbox buttons
    const brect = padRect(...slots[7], 0.01);
    const buttonPad = 0.02; // space between buttons
    const s = brect[3];
    const playRect = [brect[0], brect[1], brect[2] - s - buttonPad, brect[3]];
    const sandboxRect = [brect[0] + brect[2] - s, brect[1], s, s];

    return [
      ...this.labels,
      new TextButton(playRect, 'PLAY', () => this.gsm.playClicked()), // game_state_manager.js
      new IconButton(sandboxRect, sandboxIcon, () => this.gsm.sandboxClicked()), // game_state_manager.js
    ];
  }
}
