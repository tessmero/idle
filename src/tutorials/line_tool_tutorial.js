
class LineToolTutorial extends Tutorial {

  constructor() {
    super();

    const t = new LineTool();
    t.lineLength = t.lineLength * global.tutorialToolScale;

    this.primaryTool = t;
    this.tool = t;
  }

  getTitle() {
    return 'Line Tutorial';
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
      [i, 'down'],
      [i, 'up'],
      [i, 'defaultTool'],
      [i, 'pos', v(0.7, 0.4)],
      [4.5 * i, 'pos', v(0.7, 0.4)],

      [5.5 * i, 'pos', v(0.4, 0.4)], // on control point
      [6 * i, 'pos', v(0.4, 0.4)],
      [6 * i, 'down'],
      [7 * i, 'pos', v(0.4, 0.8)],
      [7 * i, 'up'],

      [8 * i, 'pos', startPos],
      [9 * i, 'pos', startPos],

    ];
  }

}
