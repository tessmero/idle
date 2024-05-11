// small particle simulation that appears in the gui
//
// displayed using a GuiSimPanel instance
class TutorialPSim extends ParticleSim {
  constructor() {
    super(1e4, [0, 0, ...global.tutorialSimDims]);
    this.fallSpeed = this.fallSpeed * 0.2;

    const rg = this.rainGroup;
    rg.wiggle = rg.wiggle * 0.3;
    rg.n = rg.n / 100;
  }

  addBody(b) {

    // clear simulation (limit 1 body)
    this.clearBodies();
    this.clearGrabbers();

    // scale down control point radius and force
    b.controlPoints.forEach((c) => {

      if (b instanceof ControlledSausageBody) {
        c.setRad(c.rad * global.tutorialToolScale);

        // c.fscale *= .5
      }
      else {
        c.fscale = c.fscale * 0.6;
      }
    });

    super.addBody(b);
  }
}
