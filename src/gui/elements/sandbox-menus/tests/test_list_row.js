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
   * @param  {object} params The gui element parameters.
   * @param {number} params.testIndex The index of the test in test_list.js.
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const { testIndex } = params;
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

    const sr = new ProgressButton(this.rect, {
      titleKey: `test-list-row-${this.#testIndex}-progress-btn`,
      icon: playIcon,
      textAlign: 'left',
      labelFunc: () => test.title,
      valueFunc: () => (this.isActive() ? 1 : 0),
      scale: 0.4,
      action: () => this.tlrClicked(),
    });
    sr.isAnimated = () => sr.hovered || this.isActive();

    return [sr];
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
  tlrClicked() {
    const screen = this.screen;
    screen.setContextMenu(
      new TestContextMenu(screen.rect, {
        testIndex: this.#testIndex,
      })
    );
  }
}
