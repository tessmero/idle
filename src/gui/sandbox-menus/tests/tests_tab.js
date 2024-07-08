/**
 * @file TestsTab gui element
 * contents for the "tests" tab in the sandbox menu.
 */
class TestsTab extends CompositeGuiElement {
  _layoutData = NESTED_TAB_PANE_LAYOUT;

  // keys are test indices,
  // values are TestListRow instances
  tlrs = new Map();

  /**
   *
   * @param {number[]} sr The rectangle to align elemnts in.
   * @param {GameScreen} screen The screen for icon scale for css layout (needs cleanup)
   */
  constructor(sr, screen) {
    super(sr);
    const layout = this.layoutRects(screen);

    // get list of unique test categories
    const allCats = [...new Set(allTests.map(([cat, _test]) => cat))];

    const tabLabels = allCats;
    const tabTooltips = allCats.map((cat) => `${cat} tests`);
    const tabContents = allCats.map((cat) => (r) => this.buildTabContent(r, cat, screen));
    const tabGroup = new TabPaneGroup(layout.inner, screen, tabLabels, tabContents, tabTooltips);
    if (global.testsMenuTabIndex) { tabGroup.setSelectedTabIndex(global.testsMenuTabIndex); }
    tabGroup.addTabChangeListener((i) => {
      global.testsMenuTabIndex = i;
    });

    this.addChild(tabGroup);
  }

  /**
   * Build content for a tab within the tests tab.
   * Here we show the tests within one category
   * @param {number[]} rect The rectangle to align elements in.
   * @param {string} cat The category key/name.
   * @param {GameScreen} screen The screen for icon scale for css layout (needs cleanup)
   */
  buildTabContent(rect, cat, screen) {
    const scale = 0.4;
    const maxRows = 10;

    const result = new CompositeGuiElement(rect);
    result._layoutData = DEBUG_TAB_LAYOUT;
    const layout = result.layoutRects(screen);

    // run all button
    const rab = new Button(layout.rows[0],
      () => this.playAllClicked())
      .withScale(scale);
    this.rab = rab;

    // build ui rows, leaveing first slot free
    let rowIndex = 1;
    const innerTlrs = [];
    for (let testIndex = 0; testIndex < allTests.length; testIndex++) {
      const [testCat, _test] = allTests[testIndex];
      if (testCat === cat) {
        if (rowIndex >= maxRows) {
          throw new Error(`max ${maxRows} rows in test category gui`);
        }
        const tlr = new TestListRow(layout.rows[rowIndex], testIndex);
        rowIndex = rowIndex + 1;
        innerTlrs.push(tlr);
        this.tlrs.set(testIndex, tlr);
      }
    }

    result.setChildren([

      // play all button in first slot
      rab,

      new StatReadout(rab.rect, nextIcon,
        () => 'run all tests')
        .withScale(scale),

      // ui rows
      ...innerTlrs,
    ]);

    return result;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    // highlight "run all tests" button if active (this.rab)
    const c = this.screen.contextMenu;
    if ((_testLoopSetting === 'all') && (c instanceof TestContextMenu)) {
      ProgressIndicator._draw(g, this.rab.rect, 1.0);
    }
  }

  /**
   *
   */
  playAllClicked() {
    _testLoopSetting = 'all';

    // get TestListRow instance for testIndex 0
    const tlr = this.tlrs.get(0);

    tlr.clicked();
  }

  /**
   *
   * @param {number[]} rect The rectangle to align rows in.
   * @param {number} n The desired number of rows
   */
  buildRows(rect, n) {
    const sr = rect;
    const m = 0.03;
    const w = sr[2] - 2 * m;
    const h = 0.05;
    const r0 = [sr[0] + m, sr[1] + m * 2, w, h];

    const result = [];
    for (let i = 0; i < n; i++) {
      result.push([...r0]);
      r0[1] = r0[1] + r0[3];
    }
    return result;
  }
}
