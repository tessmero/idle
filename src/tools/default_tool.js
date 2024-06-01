/**
 * @file DefaultTool regular mouse cursor.
 *
 * Drag to collect raindrops and move control points.
 */
class DefaultTool extends Tool {

  /**
   *
   * @param sim
   * @param rad
   * @param icon
   * @param title
   * @param centerCursor
   */
  constructor(sim, rad, icon = defaultToolIcon, title = 'default tool', centerCursor = false) {
    super(sim, icon, title, centerCursor);
    this.rad = rad;

    // null or falsey -> mouse not being pressed
    // ControlPoint instance -> mouse pressed on poi
    // otherwise -> mouse pressed on background
    this.held = null;

    // prepare grabber instance that will be
    // added/removed from sim
    this.grabber = new CircleGrabber(v(0, 0),
      rad, (...p) => this.grabbed(...p));
  }

  /**
   *
   * @param {ParticleSim} sim
   */
  unregister(sim) {
    sim.removeGrabber(this.grabber);
  }

  /**
   *
   */
  getTutorial() {
    return new DefaultToolTutorial();
  }

  /**
   * callback for this.grabber
   * when a particle is grabbed (particle_group.js)
   * @param {...any} p Data about the particle.
   */
  grabbed(...p) {
    DefaultTool.collectRaindrop(this.sim, ...p);
  }

  /**
   * Called whenever a particle is grabbed by a DefaultTool instance.
   * Also called by CircleBuddy when eating a particle on the player's behalf.
   * @param sim
   * @param _subgroup
   * @param _i
   * @param x
   * @param y
   * @param _dx
   * @param _dy
   * @param _hit
   */
  static collectRaindrop(sim, _subgroup, _i, x, y, _dx, _dy, _hit) {

    // increase currency
    sim.particlesCollected = sim.particlesCollected + 1;

    // show message
    const p = v(x, y);
    sim.floaters.signalChange(p, +1);
  }

  /**
   * Called when user moves mouse.
   * @param {Vector} p The new position of the mouse.
   */
  mouseMove(p) {
    this.sim.updateControlPointHovering(p);
    this.lastPos = this.grabber.pos;
    this.grabber.pos = p;
  }

  /**
   * Called when user presses mouse button.
   * @param {Vector} p the position of the mouse
   */
  mouseDown(p) {

    // either grab control point or start catching rain
    this.sim.updateControlPointHovering(p);
    this.held = this.sim.hoveredControlPoint;
    this.sim.draggingControlPoint = this.held;

    // trigger callback
    // used in main_psim.js to open context menu
    if (this.held) {
      this.sim.bodyClicked(this.held);
    }

    if (this.held) {
      this.held.isHeld = true;
    }
    else {
      this.held = 'catching';
      this.sim.selectedBody = null; // close context menu
      this.sim.selectedParticle = null;
    }

    // toggle grabbing particles
    if (this.held === 'catching') {
      this.sim.addGrabber(this.grabber);
    }
    else {
      this.sim.removeGrabber(this.grabber);
    }
  }

  /**
   * Called when user releases mouse button.
   * @param {Vector} _p The position of the mouse.
   */
  mouseUp(_p) {
    this.held = null;
    this.sim.draggingControlPoint = null;

    // stop grabbing particles
    this.sim.removeGrabber(this.grabber);
  }

  /**
   * If catching rain, draw circle indicating catch radius
   * otherwise draw the standard cursor (the default tool icon).
   * @param {object} g The graphics context.
   * @param {Vector} p The position of the mouse.
   * @param {...any} args
   */
  drawCursor(g, p, ...args) {

    if (this.held instanceof ControlPoint) {

      // held on control point
      this.sim.hoveredControlPoint = this.held;
      super.drawCursor(g, p, ...args);

    }
    else if (this.held) {

      // held on background
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

    }
    else {

      // not held
      super.drawCursor(g, p, ...args);

      // debug control points hover vis radius
      // let r = global.controlPointVisibleHoverRadius
      // ControlPoint._draw(g,v(...p),r)
    }
  }

  /**
   *
   * @param dt
   */
  update(dt) {

    const r = this.rad;
    this.grabber.rad = r;
    this.grabber.r2 = r;

    if (this.held instanceof ControlPoint) {

      if (!this.lastPos) { return; }

      const fr = [1e-4, 1e-3]; // no force d2, full force d2

      // apply force to held control point
      const cp = this.held;
      const d = this.lastPos.sub(cp.pos);
      const d2 = d.getD2();
      if (d2 >= fr[0]) {

        const angle = d.getAngle();
        let f = global.poiPlayerF;
        if (d2 < fr[1]) { f = f * ((d2 - fr[0]) / (fr[1] - fr[0])); }
        const acc = vp(angle, f).mul(dt);
        cp.accel(acc);
      }
    }
  }

}

