/**
 * @file Tutorial for Inspector Tool
 */
class PiToolTutorial extends Macro {

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);

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

    return [

      // time, ...action/position
      [0, 'pos', startPos],
      [1, 'tool', PiTool],
      [1000, 'pos', clickPos],
      [1000, 'down'],
      [1100, 'up'],
      [1200, 'pos', clickPos],
      [1600, 'pos', endPos],
      [5000, 'pos', endPos],

    ];
  }

}
