/**
 * @file Test toggling closing upgrade menu with small x button.
 */
class CloseButtonTest extends GuiTest {
  title = 'Close Button Test';
  macro = CloseButtonTest._macro();

  /**
   * Called in constructor.
   * @returns {Macro} The player emulator script for this test.
   */
  static _macro() {

    const start = v(0.5, 0.9);
    const toggle = v(0.2, 0.2);
    const upgrade = GuiTest.upgradeButtonCenter;
    const close = GuiTest.closeButtonCenter;

    return new Macro(() => [

      // click menu button
      [0, 'pos', start],
      [1, 'tool', DefaultTool],
      [500, 'pos', toggle],
      [500, 'down'],
      [600, 'up'],
      [600, 'pos', toggle],

      // click in menu
      [1000, 'pos', upgrade],
      [1000, 'down'],
      [1200, 'up'],
      [1200, 'pos', upgrade],

      // click close button
      [1500, 'pos', close],
      [1600, 'pos', close],
      [1700, 'down'],
      [1750, 'up'],
      [1800, 'pos', close],

      // go back to start
      [2200, 'pos', start],
      [3000, 'pos', start],

    ]);
  }

  /**
   *
   * @param {GameScreen} screen
   */
  getTestAssertions(screen) {
    const sm = screen.stateManager;
    const sim = screen.sim;

    return [
      // time, label, func
      [100, 'state = playing', () => sm.state === GameStates.playing],
      [100, 'current gui is HUD', () => screen.gui instanceof HudGui],

      // 500 click menu button
      // 1000 click in menu
      [1100, 'state = uprade menu', () => sm.state === GameStates.upgradeMenu],
      [1100, 'current gui is menu', () => screen.gui instanceof UpgradeMenuGui],

      // 1700 click close button
      [1800, 'no floaters', () => sim.floaters.activeCount === 0],
      [1800, 'state = playing', () => sm.state === GameStates.playing],
    ];
  }
}
