
class CircleToolTutorial extends Tutorial {

  constructor() {
    super();

    const t = new CircleTool();
    t.circleRadius = t.circleRadius * global.tutorialToolScale;

    this.primaryTool = t;
    this.tool = t;
  }

  getTitle() {
    return 'Circle Tutorial';
  }

  buildSim() {
    const sim = new TutorialPSim();
    return sim;
  }

  buildKeyframes() {

    const startPos = v(0.5, 0.9);
    const i = 400;
    return [

      [0, 'pos', startPos],
      [1, 'primaryTool'],

      [i, 'pos', v(0.5, 0.5)],
      [2 * i, 'down'],
      [2 * i, 'up'],
      [2 * i, 'defaultTool'],
      [2 * i, 'pos', v(0.5, 0.5)],

      [4 * i, 'pos', v(0.7, 0.7)],
      [4.5 * i, 'pos', v(0.7, 0.7)],

      [6 * i, 'pos', v(0.5, 0.5)],
      [6 * i, 'down'],
      [7 * i, 'pos', v(0.3, 0.3)],
      [8 * i, 'pos', v(0.8, 0.3)],
      [9 * i, 'pos', v(0.5, 0.5)],
      [9 * i, 'up'],

      [10 * i, 'pos', startPos],
      [10.5 * i, 'pos', startPos],

    ];
  }

}
