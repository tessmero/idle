
/**
 * @file Macro for drop through box test.
 *
 * Using BoxToolTutorial for miniature box tool.
 */
class DropThroughBoxMacro extends BoxToolTutorial {

  /**
   *
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    return [

      [0, 'pos', startPos],
      [1, 'primaryTool'],

      [500, 'pos', v(0.5, 0.5)],
      [1000, 'down'],
      [1000, 'up'],
      [1000, 'defaultTool'],
      [1500, 'pos', v(0.5, 0.5)],

      [2000, 'pos', startPos],

      [2000, 'down'],
      [5000, 'up'],

      [8000, 'down'],
      [9000, 'up'],

      [10000, 'pos', startPos],

    ];
  }

}
