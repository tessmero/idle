/**
 * @file Tutorial for Inspector Tool
 */
class PiToolTutorial extends Macro {

  /**
   * Click somewhere to start tracking a nearby particle.
   */
  buildKeyframes() {
    const start = v(0.9, 0.4);
    const click = v(0.5, 0.8);
    const end = v(0.9, 0.4);

    return [

      // time, ...action/position
      [0, 'pos', start],
      [1, 'tool', PiTool],
      [1000, 'pos', click],
      [1000, 'down'],
      [1100, 'up'],
      [1200, 'pos', click],
      [1600, 'pos', end],
      [5000, 'pos', end],

    ];
  }

}
