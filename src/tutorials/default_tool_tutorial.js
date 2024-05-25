
/**
 *
 */
class DefaultToolTutorial extends Macro {

  /**
   *
   */
  constructor() {
    super('Default Tool Tutorial');
  }

  /**
   *
   */
  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    const i = 400;
    const x0 = 0.1;
    const x1 = 0.9;
    return [

      [0, 'pos', startPos],

      [i, 'down'],
      [i, 'pos', v(x0, 0.5)],
      [2 * i, 'pos', v(x1, 0.5)],
      [3 * i, 'pos', v(x0, 0.5)],
      [4 * i, 'pos', v(x1, 0.5)],
      [5 * i, 'pos', v(x0, 0.5)],
      [5 * i, 'up'],

      [6 * i, 'pos', startPos],
      [6.5 * i, 'pos', startPos],

    ];
  }

}
