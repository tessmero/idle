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
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;

    // get list of unique test categories
    const allCats = [...new Set(allTests.map(([cat, _test]) => cat))];

    const tabLabels = allCats;
    const tabTooltips = allCats.map((cat) => `${cat} tests`);
    const tabContents = allCats.map((cat) => (r, p) => this.buildTabContent(r, p, cat));
    const tabGroup = new TabPaneGroup(layout.inner, {
      tabLabels, tabContents, tabTooltips,
      titleKey: 'test-categories-tab-group',
    });

    return [tabGroup];
  }

  /**
   * Build content for a tab within the tests tab.
   * Here we show the tests within one category
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters to pass to element constructor
   * @param {string} cat The category key/name.
   */
  buildTabContent(rect, params, cat) {
    const scale = 0.4;
    const maxRows = 10;

    const result = new CompositeGuiElement(rect, params);
    result._layoutData = DEBUG_TAB_LAYOUT;
    result._buildElements = () => {
      const layout = result._layout;

      // run all button
      const rab = new Button(layout.rows[0], {
        titleKey: 'test-runall-btn',
        action: () => this.playAllClicked(),
        scale,
      });
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
          const tlr = new TestListRow(layout.rows[rowIndex], { testIndex });
          rowIndex = rowIndex + 1;
          innerTlrs.push(tlr);
          this.tlrs.set(testIndex, tlr);
        }
      }

      return [

        // play all button in first slot
        rab,

        new GuiElement(rab.rect, {
          icon: nextIcon,
          labelFunc: () => 'run all tests',
          scale,
          textAlign: 'left',
        }),

        // ui rows
        ...innerTlrs,
      ];
    };

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
      ProgressIndicator.draw(g, this.rab.rect, 1.0);
    }
  }

  /**
   *
   */
  playAllClicked() {
    _testLoopSetting = 'all';

    // get TestListRow instance for testIndex 0
    const tlr = this.tlrs.get(0);

    tlr.tlrClicked();
  }
}
