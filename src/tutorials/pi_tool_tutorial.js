/**
 * @file Tutorial for Inspector Tool
 */
class PiToolTutorial extends Macro {

  /**
   *
   */
  constructor() {
    super('Inspector Tutorial');

    const grabRad = 0.04;
    const t = new PiTool(null, grabRad);
    this.primaryTool = t;
    this.tool = t;
  }

  /**
   * Click somewhere to start tracking a nearby particle.
   */
  buildKeyframes() {
    const [startPos, clickPos, endPos] = [
      v(0.9, 0.4), // start
      v(0.5, 0.8), // click
      v(0.9, 0.4), // end
    ];

    const i = 400; // duration scale in ms

    return [

      // time, ...action/position
      [0 * i, 'pos', startPos],
      [1.5 * i, 'pos', clickPos],
      [1.5 * i, 'down'],
      [2 * i, 'up'],
      [2 * i, 'pos', clickPos],
      [3 * i, 'pos', endPos],
      [9 * i, 'pos', endPos],

    ];
  }

}
