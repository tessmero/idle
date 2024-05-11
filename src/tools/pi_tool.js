// particle inspector tool for sandbox mode
class PiTool extends DefaultTool {

  constructor(sim, rad) {
    super(sim, rad);
    this.icon = piToolIcon;
    this.tooltip = 'inspect';
  }

  unregister(sim) {
    sim.selectedParticle = null;
    this.pData = null;
    sim.removeGrabber(this.grabber);
    sim.removeGrabber(this.topg);
    sim.removeGrabber(this.itopg);
  }

  // override DefaultTool
  getTutorial() {
    return new PiToolTutorial();
  }

  // initial grab (inherited DefaultTool behavior)
  grabbed(...p) {
    const [subgroup, i, _x, _y, _dx, _dy, _hit] = p;
    const sim = this.sim;

    // make sure initial circle grabber
    // is canceled
    sim.removeGrabber(this.grabber);

    // request to grab this particle
    sim.removeGrabber(this.topg);// avoid leak
    this.topg = new TrackOneParticleGrabber(subgroup, i,
      (...pp) => this.grabbedTarget(...pp));
    sim.addGrabber(this.topg);

    // indicate that this is passive
    // (don't actually flag the particle as grabbed)
    return true;
  }

  // continous polling of target particle
  grabbedTarget(...p) {
    const [subgroup, i, _x, _y, _dx, _dy, _hit] = p;
    const sim = this.sim;

    // show particle reticle context menu
    this.pData = p;
    this.sim.particleClicked(p);

    // make sure initial circle grabber
    // is canceled
    sim.removeGrabber(this.grabber);

    // request to grab this particle
    // again next update
    sim.removeGrabber(this.topg);// avoid leak
    this.topg = new TrackOneParticleGrabber(subgroup, i,
      (...pp) => this.grabbedTarget(...pp));
    sim.addGrabber(this.topg);

    // request to grab all other particles
    sim.removeGrabber(this.itopg);// avoid leak
    this.itopg = new InverseGrabber(this.topg,
      (...pp) => this.grabbedOther(...pp));

    // grb.add(this.itopg)

    // indicate that this is passive
    // (don't actually flag the particle as grabbed)
    return true;
  }

  // grab non-target for removal
  grabbedOther(..._p) {

    // return falsey
    // particle will disapear
    return false;
  }

  // override DefaultTool
  mouseMove(p) {
    this.grabber.pos = p;
  }

  // override DefaultTool
  mouseDown(_p) {
    const sim = this.sim;

    // start grabbing particles
    sim.removeGrabber(this.topg);
    sim.removeGrabber(this.itopg);
    sim.addGrabber(this.grabber);
  }

  // override DefaultTool
  mouseUp(_p) {

    // stop grabbing particles
    this.sim.removeGrabber(this.grabber);
  }

  // override DefaultTool
  update(_dt) {

    // start grabbing particles
    // this.sim.addGrabber(this.topg)
    // do nothing
  }

  drawCursor(g, p, ...args) {

    // draw circle
    const c = v(...p);
    const r = Math.sqrt(this.grabber.r2);

    g.strokeStyle = global.colorScheme.bg;
    g.lineWidth = 0.005;
    g.beginPath();
    g.moveTo(c.x + r, c.y);
    g.arc(c.x, c.y, r, 0, twopi);
    g.stroke();

    g.strokeStyle = global.colorScheme.fg;
    g.lineWidth = 0.0025;
    g.beginPath();
    g.moveTo(c.x + r, c.y);
    g.arc(c.x, c.y, r, 0, twopi);
    g.stroke();

    // draw standard tool cursor
    super.drawCursor(g, p, ...args);

  }

  draw(g) {
    super.draw(g);

    if (this.pData) {
      const [_subgroup, _i, x, y, _dx, _dy, _hit] = this.pData;
      const r = this.rad / 2;

      g.strokeStyle = global.colorScheme.hl;
      g.lineWidth = 0.01;
      g.beginPath();
      g.moveTo(x + r, y);
      g.arc(x, y, r, 0, twopi);
      g.stroke();
    }
  }
}
