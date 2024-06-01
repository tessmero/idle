
/**
 * @file Tutorial for black box tool.
 */
class BoxToolTutorial extends Macro {

  /**
   * Prepare miniature box tool.
   */
  constructor() {
    super('Box Tutorial');

    const t = new BoxTool();
    t.boxRadius = t.boxRadius * global.tutorialScaleFactor;

    this.primaryTool = t;
    this.tool = t;
  }

  /**
   * Copied animation sequence from circle tutorial.
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
      [1200, 'pos', v(0.7, 0.4)],
      [1800, 'pos', v(0.7, 0.4)],

      [2200, 'pos', v(0.5, 0.4)], // on control point
      [2400, 'pos', v(0.5, 0.4)],
      [2400, 'down'],
      [3300, 'pos', v(0.4, 0.6)],

      // [4000, 'pos', v(0.6, 0.6)],
      [3300, 'up'],

      [4500, 'pos', startPos],
      [10000, 'pos', startPos],

    ];
  }

}
