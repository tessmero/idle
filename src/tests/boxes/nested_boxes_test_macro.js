/**
 * @file Macro to test building boxes inside of boxes.
 *
 * Using BoxToolTutorial for miniature box tool.
 */
class NestedBoxesTestMacro extends BoxToolTutorial {

  /**
   *
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    return [

      [0, 'pos', startPos],
      [1, 'primaryTool'],

      // build first box
      [500, 'pos', v(0.5, 0.5)],
      [1000, 'down'],
      [1000, 'up'],
      [1000, 'defaultTool'],
      [1500, 'pos', v(0.5, 0.5)],

      [2000, 'pos', startPos],

      // double-click first box

      // build second box

      [500, 'pos', v(0.5, 0.5)],
      [1000, 'down'],
      [1000, 'up'],
      [1000, 'defaultTool'],
      [1500, 'pos', v(0.5, 0.5)],

      [10000, 'pos', startPos],

    ];
  }
}
