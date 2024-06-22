
/**
 * @file Tutorial for default tool.
 */
class DefaultToolTutorial extends Macro {

  /**
   * Set title for this macro.
   * Default tool is setup by Macro constructor.
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);
  }

  /**
   * Click and drag mouse back and forth across
   * the screen to collect particles.
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    const x0 = 0.1;
    const x1 = 0.9;
    return [

      [0, 'pos', startPos],
      [1, 'tool', DefaultTool],

      [400, 'down'],
      [400, 'pos', v(x0, 0.5)],
      [800, 'pos', v(x1, 0.5)],
      [1200, 'pos', v(x0, 0.5)],
      [1600, 'pos', v(x1, 0.5)],
      [2000, 'pos', v(x0, 0.5)],
      [2000, 'up'],
      [2400, 'pos', startPos],
      [3000, 'pos', startPos],

    ];
  }

}
