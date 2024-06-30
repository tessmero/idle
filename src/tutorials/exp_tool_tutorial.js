/**
 * @file tutorial for sandbox mode experience-granting cheat tool
 */
class ExpToolTutorial extends Macro {

  /**
   * Click buddy in the center of the screen.
   */
  buildKeyframes() {

    const start = v(0.5, 0.9);
    const center = v(0.5, 0.5);
    return [

      [0, 'pos', start],
      [1, 'tool', CircleTool],

      [500, 'pos', center],
      [600, 'down'],
      [700, 'up'],
      [800, 'tool', DefaultTool],
      [800, 'pos', center],
      [1500, 'pos', start],

      [2000, 'pos', start],
      [2000, 'tool', ExpTool],
      [2500, 'pos', center],
      [2500, 'down'],
      [2600, 'up'],
      [2700, 'down'],
      [2800, 'up'],
      [2900, 'down'],
      [3000, 'up'],
      [3000, 'pos', center],

      [3500, 'pos', start],
      [4000, 'pos', start],

    ];
  }

}
