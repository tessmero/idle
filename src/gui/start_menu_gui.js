
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
  title = 'Start Menu';
  layoutData = START_GUI_LAYOUT;

  /**
   * Construct start menu gui elements for the given game screen.
   * @param {GameScreen} screen The screen in need of gui elements.
   * @param {object} layout The rectangles computed from css layout data.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  buildElements(screen, layout) {
    const specs = _startMessageSpecs;

    // build title display with large readable text
    const div = layout.titleDiv;
    const slots = [];
    for (let i = 0; i < 5; i++) { slots.push([div[0], div[1] + i * 0.11, div[2], 0.11]); }
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
