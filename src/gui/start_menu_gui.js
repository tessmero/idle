
/**
 * @file Start Menu GUI
 * Top-level GUI container that appears when the page is loaded.
 */
const _startMessageSpecs = randChoice([
  [
    [0, 'IDLE RAIN'],
    [1, 'CATCHER'],
  ],
  [
    [0, 'RAIN CATCHER'],
  ],
  [
    [0, 'RAIN'],
    [1, 'CATCHER'],
    [2, 'IDLE'],
  ],
]);

/**
 *
 */
class StartMenuGui extends Gui {
  title = 'Start Menu';
  _layoutData = START_GUI_LAYOUT;

  /**
   * Construct start menu gui elements for the given game screen.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  _buildElements() {
    const layout = this._layout;
    const specs = _startMessageSpecs;

    // build title display with large readable text
    const div = layout.titleDiv;
    const slots = [];
    for (let i = 0; i < 5; i++) { slots.push([div[0], div[1] + i * div[3], div[2], div[3]]); }
    this.labels = specs.map((s) =>
      new TextLabel(slots[s[0]], s[1])
        .withLetterPixelPad(0.01)
        .withStyle('hud'));

    return [
      ...this.labels,

      new TextButton(layout.playBtn, 'PLAY',
        () => this.gsm.playClicked()),

      new IconButton(layout.sandboxBtn, sandboxIcon,
        () => this.gsm.sandboxClicked()),

    ];
  }
}
