/**
 * @file TestContextMenu test runner / gui element.
 */
let _testLoopSetting = null;
let _testLoopTooltip = '';

/**
 * persistent context menu with gui sim
 * that appears when a row is clicked in tests menu
 */
class TestContextMenu extends ContextMenu {
  _layoutData = TEST_CONTEXT_MENU_LAYOUT;

  // require outer bounds to be fully expanded
  _minExpandToBuildElements = 1;

  // test data
  #test;
  #testCat;
  #testIndex;

  #asserts;
  #duration;

  #nChecks;
  #checkTimes;
  #checkTooltips;

  // test runner state
  #t;
  #lastTime;
  #checksPassed;
  #loopCountdown;
  #loopDelay = 2000;

  // handles for some children elements
  #checkReadouts;
  #ttDisplay;
  #finalDisplay;
  #loopButton;

  #guiLetterScale = 0.25;

  /**
   *
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param  {object} params The gui element parameters.
   * @param {number} params.testIndex The index of the test in test_list.js.
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const { testIndex } = params;
    this.#testIndex = testIndex;

    const [testCat, test] = allTests[testIndex];
    this.#test = test;
    this.#testCat = testCat;
    this.#testIndex = testIndex;

    //
    this.#loopCountdown = this.#loopDelay;

    this.#asserts = test.getTestAssertions(test.screen);
    this.#duration = test.getDuration(test.screen);

    this.#t = 0;
    this.#checksPassed = []; // arr of bools
  }

  /**
   *
   */
  get testIndex() { return this.#testIndex; }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const asserts = this.#asserts;
    const test = this.#test;
    const layout = this._layout;
    const titleRect = layout.title;
    const s0 = layout.squares[0];
    const botRows = layout.rows;

    // center simulation in first content square
    const screen = test.screen;
    if (!this._tcmBuilt) {
      Test.resetBoxSims(screen);
    }
    const sim = screen.sim;
    const tut = screen.tut;
    this.sim = sim;
    const sdims = [sim.rect[2], sim.rect[3]];
    const c = rectCenter(...s0);
    const gspRect = [c[0] - sdims[0] / 2, c[1] - sdims[1] / 2, ...sdims];
    screen.setRect(gspRect);
    const gsp = new GuiScreenPanel(gspRect, { innerScreen: screen, allowScaling: true });
    screen.loop = false; // disable loop flag set in gsp constructor
    gsp.tut = tut;
    if (!this._tcmBuilt) {
      gsp.reset();
    }
    this.gsp = gsp;

    const gui = screen.gui;
    if (gui && (!this._tcmBuilt)) {
      gui.buildElements(screen);
    }

    // divide second content square into rows
    const maxAsserts = botRows.length - 3;
    if (asserts.length > maxAsserts) {
      throw new Error(`max of ${maxAsserts} asserts per test`);
    }

    // add test criteria to second square
    this._buildCriteriaRows(botRows, asserts);

    // play/pause/etc buttons at bottom of first square
    const controlButtons = this._buildControlButtons();

    const titleLabel = new GuiElement(titleRect, {
      label: test.title,
      scale: 0.3,
    });

    this._tcmBuilt = true;

    return [

      // GUi Sim Panel in middle of first square
      gsp,

      // title at top of first square
      titleLabel,

      // play/pause/etc buttons at bottom of first square
      ...controlButtons,

      // timeline at top of second square
      this.#ttDisplay,

      // readouts in second square
      ...this.#checkReadouts,

      // conclusion in second square
      this.#finalDisplay,

      new Button(layout.closeBtn, {
        titleKey: 'tcmClose',
        icon: xIcon,
        action: () => this.screen.setContextMenu(null),
        scale: 0.4,
        tooltip: 'close test runner',
      }),

    ];
  }

  /**
   * Used in constructor.
   * assign members with criteria specs and gui elements.
   * @param  {number[][]} rows The rectangles to align elements in.
   * @param  {Array.<Array>} asserts The test assertions to display.
   */
  _buildCriteriaRows(rows, asserts) {

    let i = 2;
    const checkTimes = [];
    const checkTooltips = [];
    const checkReadouts = [];
    asserts.forEach((e) => {
      const [time, lbl, _func] = e;
      const seconds = (time / 1000).toFixed(1);
      const label = `${seconds}s: ${lbl}`;
      const tooltip = `at ${seconds} seconds:\n${lbl}`;
      checkTimes.push(time);
      checkTooltips.push(tooltip);
      checkReadouts.push(
        new GuiElement(rows[i], {
          icons: uncheckedIcon,
          labelFunc: () => label,
          tooltip,
          scale: this.#guiLetterScale,
          tooltiScale: this.#guiLetterScale,
          textAlign: 'left',
        })
      );
      i = i + 1;
    });
    this.#checkTimes = checkTimes;
    this.#checkTooltips = checkTooltips;
    this.#checkReadouts = checkReadouts;
    this.#nChecks = checkTimes.length;

    const ttDisplay = new TestTimelineDisplay(rows[1], {
      duration: this.#duration,
      checkTimes,
      checkLabels: checkTooltips,
    });
    this.#ttDisplay = ttDisplay;

    const finalDisplay = new GuiElement(rows.at(-1), {
      label: '',
      scale: 0.3,
    });
    this.#finalDisplay = finalDisplay;

  }

  /**
   * Get elements and set member 'loopButton'
   * @returns {GuiElement[]} The new Button instances.
   */
  _buildControlButtons() {
    const rects = this._layout.buttons;

    const specs = [
      {
        titleKey: 'tcmPrev',
        icon: prevIcon,
        tooltip: 'previous test',
        action: () => this.prevClicked(),
      },
      {
        titleKey: 'tcmPlay',
        icon: playIcon,
        tooltip: 'reset',
        action: () => this.playClicked(),
      },
      {
        titleKey: 'tcmNext',
        icon: nextIcon,
        tooltip: 'next test',
        action: () => this.nextClicked(),
      },
      {
        titleKey: 'tcmLoop',
        icon: loopIcon,
        tooltipFunc: () => _testLoopTooltip,
        action: () => this.loopClicked(),
      },
    ];

    const controlButtons = specs.map((params, i) =>
      new Button(rects[i], {
        ...params,
        scale: 0.3,
        tooltipScale: this.#guiLetterScale,
      })
    );

    this.#loopButton = controlButtons.at(-1);
    this.updateLoopButton();

    return controlButtons;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    // draw overlay on loop button
    if (_testLoopSetting && this.#loopButton) {
      let rect = this.#loopButton.rect;
      rect = padRect(...rect, -0.005);
      const prg = this.#loopCountdown / this.#loopDelay;
      ProgressIndicator.draw(g, rect, prg);
    }
  }

  /**
   *
   */
  updateLoopButton() {
    const tls = _testLoopSetting;
    let tt = 'loop (off)';
    if (tls === 'single') {
      tt = 'loop (one test)';
    }
    else if (tls === 'all') {
      tt = 'loop (all tests)';
    }
    _testLoopTooltip = tt;
  }

  /**
   *
   */
  loopClicked() {
    const tls = _testLoopSetting;
    if (!tls) {
      _testLoopSetting = 'single';
    }
    else if (tls === 'single') {
      _testLoopSetting = 'all';
    }
    else {
      _testLoopSetting = null;
    }
    this.updateLoopButton();
  }

  /**
   *
   */
  playClicked() {
    this._gotoOtherTest(this.#testIndex);
  }

  /**
   *
   */
  prevClicked() {
    const prevIndex = nnmod(this.#testIndex - 1, allTests.length);
    this._gotoOtherTest(prevIndex);
  }

  /**
   *
   */
  nextClicked() {
    const nextIndex = nnmod(this.#testIndex + 1, allTests.length);
    this._gotoOtherTest(nextIndex);
  }

  /**
   * set a new context menu to replace this one.
   * Used to switch to a different test or to reset the current test.
   * @param {number} otherTestIndex The index of the new test to show
   */
  _gotoOtherTest(otherTestIndex) {
    const screen = this.screen;
    screen.setContextMenu(new TestContextMenu(
      screen.rect,
      { testIndex: otherTestIndex }
    ));
    screen._updateContextMenuAnim();
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   * @param {boolean} disableHover True if mouse hovering should be disabled.
   */
  update(dt, disableHover) {
    const hovered = super.update(dt, disableHover);

    // check if not built because outer bounds are too collapsed
    if (this.children.length === 0) {
      return hovered;
    }

    const ttDisplay = this.#ttDisplay;

    this.#t = this.#t + dt;
    const t = this.#t;
    ttDisplay.setTime(t);
    if (!this.#lastTime) { this.#lastTime = -1; }

    if (t > this.#duration) {

      // finished
      let label;
      const passed = this.#checksPassed.filter(Boolean).length;
      if (passed === this.#nChecks) {
        label = 'TEST PASSED';
      }
      else {
        label = 'TEST FAILED';
      }
      this.#finalDisplay.setLabel(label);

      if (_testLoopSetting) {
        this.#loopCountdown = this.#loopCountdown - dt;
        if (this.#loopCountdown < 0) {
          if (_testLoopSetting === 'single') {
            this.playClicked();
          }
          else {
            this.nextClicked();
          }
        }
      }

      return hovered;
    }

    // iterate over checks
    for (let i = 0; i < this.#nChecks; i++) {
      const [time, _label, func] = this.#asserts[i];
      if ((time > this.#lastTime) && (time <= t)) {

        // Check for syntax error in test assertions
        if (!(typeof func === 'function')) {
          throw new Error('test assertion must be function');
        }

        // perform relevent check
        let success = false;
        try {
          success = func();
        }
        catch (_error) {
          // console.error(error);
        }

        this.#checksPassed.push(success);
      }

      const icon = this._pickIcon(i);
      ttDisplay.setCheckboxIcon(i, icon);
      this.#checkReadouts[i].icon = icon;
    }

    this.#lastTime = t;
    return hovered;
  }

  /**
   * Pick icon to show for the given assertion.
   * @param  {number} assertIndex The index of the assertion.
   * @returns {Icon} The pass/fail/blank icon to reflect the status of the assertion.
   */
  _pickIcon(assertIndex) {
    if (assertIndex >= this.#checksPassed.length) {

      // assertion is in the future
      return uncheckedIcon;
    }

    // assertion either passed or failed
    return this.#checksPassed[assertIndex] ? checkedIcon : trashIcon;
  }
}
