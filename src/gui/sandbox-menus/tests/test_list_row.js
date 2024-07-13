/**
 * @file TestListRow gui element representing a test,
 * click to open the test context menu and start the test.
 */
class TestListRow extends CompositeGuiElement {

  #test;
  #testIndex;

  /**
   * Construct gui list element for one test in test_list.js
   * @param {number[]} rect The rectangle to align elements in.
   * @param {number} testIndex The index of the test in test_list.js.
   */
  constructor(rect, testIndex) {
    super(rect);

    this.#testIndex = testIndex;

    const [_testCat, test] = allTests[testIndex];
    this.#test = test;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const test = this.#test;

    const sr = new StatReadout(this.rect,
      playIcon, () => test.title)
      .withScale(0.4);
    sr.isAnimated = () => sr.hovered || this.isActive();

    return [
      new Button(this.rect, () => this.clicked()),
      sr,
    ];
  }

  /**
   * Extend standard composite gui element draw,
   * by overlaying a progress indicator.
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    if (this.isActive()) {
      ProgressIndicator._draw(g, this.rect, 1);
    }
  }

  /**
   * @returns {boolean} True if the relevent test is currently running.
   */
  isActive() {
    const c = this.screen.contextMenu;
    return c && (c.testIndex === this.#testIndex);
  }

  /**
   * Called when this element is clicked.
   * Activate the test context menu which will run the test.
   */
  clicked() {
    // position context menu on bottom/right
    const screen = this.screen;
    const rect = ContextMenu.pickRect(screen);
    screen.contextMenu = new TestContextMenu(rect, this.#testIndex);
    screen.contextMenu.setScreen(screen);
  }
}
