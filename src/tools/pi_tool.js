/**
 * @file Particle Inspector Tool
 *
 * Click to track a particle.
 */
class PiTool extends DefaultTool {
  _icon = piToolIcon;
  _tooltipText = 'inspect';
  _cursorCenter = true;

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);
  }

  /**
   *
   * @param {ParticleSim} sim
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
   * Called in game_screen.js when the mouse moves.
   * @param {Vector} p The new mouse cursor position.
   */
  mouseMove(p) {
    this.grabber.pos = p;
  }

  /**
   * Called in game_screen.js when the mouse button is pressed.
   * @param {Vector} _p The position of the mouse cursor.
   */
  mouseDown(_p) {
    const sim = this.sim;

    // start grabbing particles
    sim.removeGrabber(this.topg);
    sim.removeGrabber(this.itopg);
    sim.addGrabber(this.grabber);
  }

  /**
   * Called in game_screen.js when the mouse button is released.
   * @param {Vector} _p The position of the mouse cursor.
   */
  mouseUp(_p) {

    // stop grabbing particles
    this.sim.removeGrabber(this.grabber);
  }

  /**
   * Draw the particle inspector tool mouse cursor.
   * @param {object} g The graphics context.
   * @param {Vector} p The position to draw at.
   */
  drawCursor(g, p) {

    // held on background
    const c = p;
    const r = this.rad;
    g.strokeStyle = global.colorScheme.fg;

    g.lineWidth = 0.0025;
    g.beginPath();
    g.moveTo(c.x + r, c.y);
    g.arc(c.x, c.y, r, 0, twopi);
    g.stroke();

    // draw standard tool cursor
    super.drawCursor(g, p);

  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    if (this.pData) {
      const [_subgroup, _i, x, y, _dx, _dy, _hit] = this.pData;
      const r = 0.02 * this.iconScale;

      g.strokeStyle = global.colorScheme.hl;
      g.lineWidth = 0.01;
      g.beginPath();
      g.moveTo(x + r, y);
      g.arc(x, y, r, 0, twopi);
      g.stroke();
    }
  }
}
