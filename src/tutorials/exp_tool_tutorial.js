/**
 * @file tutorial for sandbox mode experience-granting cheat tool
 */
class ExpToolTutorial extends Macro {

  /**
   * Prepare miniature exp tool.
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);

    const t = new ExpTool();

    this.primaryTool = t;
    this.tool = t;
  }

  /**
   * Click buddy in the center of the screen.
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    return [

      [0, 'pos', startPos],
      [1, 'primaryTool'],

      [400, 'pos', v(0.5, 0.5)],
      [500, 'down'],
      [600, 'up'],
      [800, 'pos', v(0.5, 0.5)],

      [1200, 'pos', startPos],
      [2000, 'pos', startPos],

    ];
  }

}
