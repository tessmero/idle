/**
 * @file Test toggling upgrade menu.
 */
class ToggleMenuTest extends GuiTest {
  title = 'Toggle Menu Test';
  macro = ToggleMenuTest._macro();

  /**
   * Called in constructor.
   * @returns {Macro} The player emulator script for this test.
   */
  static _macro() {

    const startPos = v(0.5, 0.9);
    const toggle = v(0.1, 0.1);
    const upgrade = GuiTest.upgradeButtonCenter;

    return new Macro(() => [

      // click menu button
      [0, 'pos', startPos],
      [1, 'tool', DefaultTool],
      [500, 'pos', toggle],
      [600, 'down'],
      [700, 'up'],
      [800, 'pos', toggle],

      // click in menu
      [1200, 'pos', upgrade],
      [1300, 'down'],
      [1400, 'up'],
      [1500, 'pos', upgrade],

      // drag in background at top
      [2300, 'pos', v(0.5, 0.01)],
      [2400, 'down'],
      [2800, 'up'],
      [3000, 'pos', v(0.7, 0.7)],

      // 4x click menu button
      [3500, 'pos', toggle],
      [3600, 'down'],
      [3700, 'up'],
      [3800, 'down'],
      [3900, 'up'],
      [4000, 'down'],
      [4050, 'up'],
      [4100, 'down'],
      [4150, 'up'],
      [4200, 'pos', toggle],

      // go back to start
      [4600, 'pos', startPos],
      [5000, 'pos', startPos],

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

      // 600 click menu button
      // 1300 click in menu
      [1500, 'state = uprade menu', () => sm.state === GameStates.upgradeMenu],
      [1500, 'current gui is menu', () => screen.gui instanceof UpgradeMenuGui],

      // 2400-2800 drag on backround outside of menu
      [3000, 'floaters visible', () => sim.floaters.activeCount > 0],
      [3000, 'state = playing', () => sm.state === GameStates.playing],

      // 3500-4150 4x click on menu button
      [4200, 'state = playing', () => sm.state === GameStates.playing],
    ];
  }
}
