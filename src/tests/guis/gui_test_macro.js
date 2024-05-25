/**
 * player emulator script for gui test
 */
class GuiTestMacro extends Macro {

  /**
   *
   */
  getTitle() {
    return 'GUI';
  }

  /**
   *
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    const btnPos = v(0.2, 0.2);
    return [

      // click menu button
      [0, 'pos', startPos],
      [1000, 'pos', btnPos],
      [1300, 'down'],
      [1400, 'up'],
      [2000, 'pos', btnPos],

      // click in menu
      [3000, 'pos', v(0.5, 0.5)],
      [3300, 'down'],
      [3400, 'up'],
      [3500, 'pos', v(0.5, 0.5)],

      // drag in background at top
      [4300, 'pos', v(0.5, 0.1)],
      [4400, 'down'],
      [4800, 'up'],
      [5000, 'pos', v(0.7, 0.7)],

      // repeatedly click menu button
      [5500, 'pos', btnPos],
      [5600, 'down'],
      [5700, 'up'],
      [5800, 'down'],
      [5900, 'up'],
      [6000, 'down'],
      [6050, 'up'],
      [6100, 'down'],
      [6150, 'up'],
      [6200, 'pos', btnPos],

      // go back to start
      [7200, 'pos', startPos],
      [7500, 'pos', startPos],
    ];
  }

}
