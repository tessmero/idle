
/**
 * @file Tutorial for line tool.
 */
class LineToolTutorial extends Macro {

  /**
   * Prepare miniature line tool.
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);

    const t = new LineTool();
    t.lineLength = t.lineLength * global.tutorialScaleFactor;

    this.primaryTool = t;
    this.tool = t;
  }

  /**
   * Place line (ControlledSausageBody) in center.
   * Click and drag control point to rotate line.
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

      [2200, 'pos', v(0.4, 0.4)], // on control point
      [2400, 'pos', v(0.4, 0.4)],
      [2400, 'down'],
      [2800, 'pos', v(0.4, 0.8)],
      [2800, 'up'],

      [3200, 'pos', startPos],
      [3600, 'pos', startPos],

    ];
  }

}
