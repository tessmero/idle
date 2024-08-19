
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
    const slots = layout.titleRows;
    this.labels = specs.map((s) =>
      new GuiElement(slots[s[0]], {
        label: s[1],
        letterPixelPad: 0.01,
        style: 'hud',
      })
    );

    return [
      ...this.labels,

      new Button(layout.playBtn, {
        label: 'PLAY',
        action: () => this.gsm.playClicked(),
        border: new SlantBorder(),
        fill: true,
      }),

      new Button(layout.sandboxBtn, {
        icon: sandboxIcon,
        action: () => this.gsm.sandboxClicked(),
        border: new SlantBorder(),
        fill: true,
      }),

    ];
  }
}
