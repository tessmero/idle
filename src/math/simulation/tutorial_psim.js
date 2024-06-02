/**
 * small particle simulation that appears in the gui
 */
class TutorialPSim extends ParticleSim {
  /**
   *
   */
  constructor() {
    super(1e4, [0, 0, ...global.tutorialSimDims]);
    this.fallSpeed = this.fallSpeed * 0.2;

    const rg = this.rainGroup;
    rg.wiggle = rg.wiggle * 0.3;
    rg.n = rg.n / 100;
  }

  /**
   *
   * @param b
   */
  addBody(b) {

    // scale down control point radius and force
    b.controlPoints.forEach((c) => {

      if ((b instanceof ControlledSausageBody) || (b instanceof BoxBuddy)) {
        c.setRad(c.rad * global.tutorialScaleFactor);
      }
      if ((b instanceof CircleBuddy)) {
        c.fscale = c.fscale * 0.3;
      }
    });

    super.addBody(b);
  }
}
