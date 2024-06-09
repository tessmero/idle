/**
 * @file Particle Inspector Tool
 *
 * Click to track a particle.
 */
class PiTool extends DefaultTool {

  /**
   *
   * @param {ParticleSim} sim
   * @param {number} rad
   */
  constructor(sim, rad) {
    super(sim, rad, piToolIcon, 'inspect', true);
  }

  /**
   *
   * @param sim
   */
  unregister(sim) {
    sim.selectedParticle = null;
    this.pData = null;
    sim.removeGrabber(this.grabber);
    sim.removeGrabber(this.topg);
    sim.removeGrabber(this.itopg);
  }

  /**
   *
   */
  getTutorial() {
    return new PiToolTutorial();
  }

  /**
   * Called when clicking a particle.
   * @param {...any} p
   */
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

  /**
   * Callback for grabber this.topg
   * repeatedly as long as particle is selected.
   * @param {...any} p Data about the selected particle
   */
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

    // request to remove all other particles
    // sim.removeGrabber(this.itopg);// avoid leak
    // this.itopg = new InverseGrabber(
    //   this.topg, (..._pp) => false);
    // grb.add(this.itopg)

    // indicate that this is passive
    // (don't actually flag the particle as grabbed)
    return true;
  }

  /**
   *
   * @param p
   */
  mouseMove(p) {
    this.grabber.pos = p;
  }

  /**
   *
   * @param _p
   */
  mouseDown(_p) {
    const sim = this.sim;

    // start grabbing particles
    sim.removeGrabber(this.topg);
    sim.removeGrabber(this.itopg);
    sim.addGrabber(this.grabber);
  }

  /**
   *
   * @param _p
   */
  mouseUp(_p) {

    // stop grabbing particles
    this.sim.removeGrabber(this.grabber);
  }

  /**
   *
   * @param _dt
   */
  update(_dt) {

    // start grabbing particles
    // this.sim.addGrabber(this.topg)
    // do nothing
  }

  /**
   *
   * @param {object} g The graphics context.
   * @param p
   * @param {...any} args
   */
  drawCursor(g, p, ...args) {

    // draw circle
    const c = p;
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

  /**
   *
   * @param {object} g The graphics context.
   */
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
