
/**
 * @file Tutorial for circle tool.
 */
class CircleToolTutorial extends Macro {

  /**
   * Prepare miniature circle tool.
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);

    const t = new CircleTool();
    t.circleRadius = t.circleRadius * global.tutorialScaleFactor;

    this.primaryTool = t;
    this.tool = t;
  }

  /**
   * Place a new CircleBuddy in the center of the screen.
   * Click and drag circle to move it.
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    return [

      [0, 'pos', startPos],
      [1, 'primaryTool'],

      [400, 'pos', v(0.5, 0.5)],
      [800, 'down'],
      [800, 'up'],
      [800, 'defaultTool'],
      [800, 'pos', v(0.5, 0.5)],

      [1600, 'pos', v(0.7, 0.7)],
      [1800, 'pos', v(0.7, 0.7)],

      [2400, 'pos', v(0.5, 0.5)],
      [2400, 'down'],
      [2800, 'pos', v(0.3, 0.3)],
      [3200, 'pos', v(0.8, 0.3)],
      [3600, 'pos', v(0.5, 0.5)],
      [3600, 'up'],

      [4000, 'pos', startPos],
      [4200, 'pos', startPos],

    ];
  }

}
