
/**
 * @file Tutorial for line tool.
 */
class LineToolTutorial extends Macro {

  /**
   * Place line (ControlledSausageBody) in center.
   * Click and drag control point to rotate line.
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    return [

      [0, 'pos', startPos],
      [1, 'tool', LineTool],

      [400, 'pos', v(0.5, 0.5)],
      [400, 'down'],
      [400, 'up'],
      [400, 'tool', DefaultTool],
      [1200, 'pos', v(0.7, 0.4)],
      [1800, 'pos', v(0.7, 0.4)],

      [3200, 'pos', v(0.4, 0.4)], // on control point
      [3400, 'pos', v(0.4, 0.4)],
      [3400, 'down'],
      [3800, 'pos', v(0.4, 0.8)],
      [3800, 'up'],

      [4200, 'pos', startPos],
      [4600, 'pos', startPos],

    ];
  }

}
