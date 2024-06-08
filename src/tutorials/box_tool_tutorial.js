
/**
 * @file Tutorial for black box tool.
 */
class BoxToolTutorial extends Macro {

  /**
   * Prepare miniature box tool.
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);

    const t = new BoxTool();
    t.boxRadius = t.boxRadius * global.tutorialScaleFactor;

    this.primaryTool = t;
    this.tool = t;
  }

  /**
   * Place box in center and rotate it
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    return [

      [0, 'pos', startPos],
      [1, 'primaryTool'],

      [400, 'pos', v(0.5, 0.5)],
      [400, 'down'],
      [400, 'up'],
      [400, 'defaultTool'],

      [1000, 'pos', v(0.5, 0.4)], // on control point
      [1200, 'pos', v(0.5, 0.4)],
      [1200, 'down'],
      [2000, 'pos', v(0.4, 0.5)],
      [2500, 'pos', v(0.4, 0.5)],
      [2500, 'up'],

      [2800, 'pos', v(0.5, 0.5)],
      [2900, 'down'],
      [3000, 'up'],
      [3100, 'down'],
      [3200, 'up'],
      [3300, 'pos', v(0.5, 0.5)],

      [5000, 'pos', v(0.5, 0.5)],

    ];
  }

}
