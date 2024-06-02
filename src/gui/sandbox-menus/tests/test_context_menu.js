/**
 * @file TestContextMenu test runner / gui element.
 */
let _testLoopSetting = null;

/**
 * persistent context menu with gui sim
 * that appears when a row is clicked in tests menu
 */
class TestContextMenu extends ContextMenu {

  test;
  testCat;
  testIndex;

  /**
   *
   * @param rect
   * @param s0
   * @param s1
   * @param testIndex
   */
  constructor(rect, s0, s1, testIndex) {
    super(rect, s0, s1);

    const [testCat, test] = allTests[testIndex];
    this.test = test;
    this.testCat = testCat;
    this.testIndex = testIndex;

    //
    this.loopDelay = 2000;
    this.loopCountdown = this.loopDelay;

    // center simulation in first content square
    const screen = test.screen;
    Test.resetBoxSims(screen);
    const sim = screen.sim;
    const tut = screen.tut;
    this.sim = sim;
    const sdims = [sim.rect[2], sim.rect[3]];
    const c = rectCenter(...s0);
    const gspRect = [c[0] - sdims[0] / 2, c[1] - sdims[1] / 2, ...sdims];
    screen.setRect(gspRect);
    const gsp = new GuiScreenPanel(gspRect, screen);
    screen.loop = false; // disable loop flag set in gsp constructor
    gsp.tut = tut;
    gsp.reset();
    this.gsp = gsp;

    const gui = screen.gui;
    if (gui) {
      gui.setChildren(gui.buildElements(screen));
      gui.setScreen(screen);
    }

    const asserts = test.getTestAssertions(screen);

    // divide second content square into rows
    const nRows = 13;
    const maxAsserts = nRows - 3;
    if (asserts.length > maxAsserts) {
      throw new Error(`max of ${maxAsserts} asserts per test`);
    }
    const botRows = divideRows(...s1, nRows);
    const textScale = 0.25;

    const duration = test.getDuration(screen);
    this.t = 0;
    this.duration = duration;

    // add test criteria to second square
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
        new StatReadout(botRows[i], uncheckedIcon,
          () => label)
          .withScale(textScale)
          .withTooltipScale(textScale)
          .withTooltip(tooltip)
      );
      i = i + 1;
    });
    this.asserts = asserts;
    this.checkTimes = checkTimes;
    this.checkTooltips = checkTooltips;
    this.checkReadouts = checkReadouts;
    this.nChecks = checkTimes.length;
    this.nChecksPassed = 0;

    const ttDisplay = new TestTimelineDisplay(botRows[1], duration, checkTimes, checkTooltips);
    this.ttDisplay = ttDisplay;

    const finalDisplay = new TextLabel(botRows.at(-1), '').withScale(0.3);
    this.finalDisplay = finalDisplay;

    // play/pause/etc buttons at bottom of first square
    const topRows = divideRows(...padRect(...s0, 0), 10);
    const controlRow = divideCols(...topRows.at(-1), 10);
    const specs = [
      // icon, tooltip, action
      [prevIcon, 'previous test', () => this.prevClicked()],
      [playIcon, 'reset', () => this.playClicked()],

      // [pauseIcon, 'pause',        ()=>{}],
      [nextIcon, 'next test', () => this.nextClicked()],
      [loopIcon, 'loop (off)', () => this.loopClicked()],
    ];
    const xOff = 0.75 * specs.length * controlRow[0][2]; // center buttons
    i = 0;
    const controlButtons = specs.map((entry) => {
      const [icon, tooltip, action] = entry;
      const r = [...controlRow[i]];
      r[0] = r[0] + xOff;
      const result = new IconButton(r, icon, action)
        .withScale(0.3)
        .withTooltip(tooltip)
        .withTooltipScale(textScale);
      i = i + 1;
      return result;
    });
    this.loopButton = controlButtons.at(-1);
    this.updateLoopButton();

    const titleRect = [...topRows[0]];
    titleRect[1] = titleRect[1] - 0.03;
    const titleLabel = new TextLabel(titleRect, test.titleKey)
      .withScale(0.3);

    this.setChildren(this.children.concat([

      // title at top of first square
      titleLabel,

      // GUi Sim Panel in middle of first square
      gsp,

      // play/pause/etc buttons at bottom of first square
      ...controlButtons,

      // timeline at top of second square
      ttDisplay,

      // readouts in second square
      ...checkReadouts,

      // conclusion in second square
      finalDisplay,
    ]));

  }

  /**
   *
   * @param g
   */
  draw(g) {
    super.draw(g);

    // draw overlay on loop button
    if (_testLoopSetting) {
      let rect = this.loopButton.rect;
      rect = padRect(...rect, -0.005);
      const prg = this.loopCountdown / this.loopDelay;
      ProgressIndicator._draw(g, rect, prg, false);
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
    this.loopButton.withTooltip(tt);
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
    const screen = this.screen;
    screen.contextMenu = new TestContextMenu(
      ...TestContextMenu.pickRects(screen.rect),
      this.testIndex);
    screen.contextMenu.setScreen(screen);
  }

  /**
   *
   */
  prevClicked() {
    const prevIndex = nnmod(this.testIndex - 1, allTests.length);
    const screen = this.screen;
    screen.contextMenu = new TestContextMenu(
      ...TestContextMenu.pickRects(screen.rect),
      prevIndex);
    screen.contextMenu.setScreen(screen);
  }

  /**
   *
   */
  nextClicked() {
    const nextIndex = nnmod(this.testIndex + 1, allTests.length);
    const screen = this.screen;
    screen.contextMenu = new TestContextMenu(
      ...TestContextMenu.pickRects(screen.rect),
      nextIndex);
    screen.contextMenu.setScreen(screen);
  }

  /**
   *
   * @param dt
   * @param disableHover
   */
  update(dt, disableHover) {
    this.t = this.t + dt;
    const hovered = super.update(dt, disableHover);
    const ttDisplay = this.ttDisplay;

    const t = this.t;
    ttDisplay.setTime(t);
    if (!this.lastTime) { this.lastTime = -1; }

    if (t > this.duration) {

      // finished
      let label;
      if (this.nChecksPassed === this.nChecks) {
        label = 'TEST PASSED';
      }
      else {
        label = 'TEST FAILED';
      }
      this.finalDisplay.setLabel(label);

      if (_testLoopSetting) {
        this.loopCountdown = this.loopCountdown - dt;
        if (this.loopCountdown < 0) {
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
    for (let i = 0; i < this.nChecks; i++) {
      const [time, _label, func] = this.asserts[i];
      if ((time > this.lastTime) && (time <= t)) {

        // Check for syntax error in test assertions
        if (!(typeof func === 'function')) {
          throw new Error('test assertion must be function');
        }

        // perform relevent check
        let success = false;
        try {
          success = func();
        }
        catch (error) {
          console.error(error);
        }
        if (success) { this.nChecksPassed = this.nChecksPassed + 1; }
        const icon = success ? checkedIcon : trashIcon;
        ttDisplay.setCheckboxIcon(i, icon);
        this.checkReadouts[i].icon = icon;

      }
    }

    this.lastTime = t;

    return hovered;
  }

  /**
   *
   * @param sr
   */
  static pickRects(sr) {

    // force to right/bottom isde of screen
    return ContextMenu.pickRects(sr, v(sr[0], sr[1]));
  }
}
