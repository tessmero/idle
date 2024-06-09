/**
 * @file TestListRow gui element representing a test,
 * click to open the test context menu and start the test.
 */
class TestListRow extends CompositeGuiElement {

  #test;
  #testIndex;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param testIndex
   */
  constructor(rect, testIndex) {
    super(rect);

    this.#testIndex = testIndex;

    const [_testCat, test] = allTests[testIndex];
    this.#test = test;

    const sr = new StatReadout(rect,
      playIcon, () => test.titleKey)
      .withScale(0.4);

    sr.isAnimated = () => sr.hovered || this.isActive();

    this.setChildren([
      new Button(rect, () => this.clicked()),
      sr,
    ]);
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
   *
   */
  isActive() {
    const c = this.screen.contextMenu;
    return c && (c.testIndex === this.#testIndex);
  }

  /**
   *
   */
  clicked() {
    // position context menu on bottom/right
    const screen = this.screen;
    const rects = TestContextMenu.pickRects(screen.rect);
    screen.contextMenu = new TestContextMenu(...rects, this.#testIndex);
    screen.contextMenu.setScreen(screen);
  }
}
