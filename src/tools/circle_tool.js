
class CircleTool extends BodyTool {

  constructor(sim) {
    super(sim, 'circle', circleIcon);

    this.cursorCenter = true; // tool.js
    this.circleRadius = 0.1;
  }

  // implement BodyTool
  buildBody(p) {
    return new CircleBuddy(this.sim, p, this.circleRadius);
  }

  // implement Tool
  getCost() {

    // count previously built circles
    const bods = this.sim.getBodies();
    const circles = [...bods].filter((b) => b instanceof CircleBuddy);
    const count = circles.length;

    return ValueCurve.power(100, 2.5).f(count);
  }

  // implement Tool
  getTutorial() {
    return new CircleToolTutorial();
  }

  mouseMove(_p) {}

  mouseUp(_p) {}
}
