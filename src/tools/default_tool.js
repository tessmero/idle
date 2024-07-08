/**
 * @file DefaultTool regular mouse cursor.
 *
 * Drag to collect raindrops and move control points.
 */
class DefaultTool extends Tool {
  _icon = defaultToolIcon;
  _tooltipText = 'default tool';
  _cursorCenter = false;

  #baseRad = global.mouseGrabRadius;

  /**
   *
   * @param {GameScreen} screen
   */
  constructor(screen) {
    super(screen);
    this.rad = this.#baseRad * this.iconScale;

    // null or falsey -> mouse not being pressed
    // ControlPoint instance -> mouse pressed on poi
    // otherwise -> mouse pressed on background
    this.held = null;

    // prepare grabber instance that will be
    // added/removed from sim
    this.grabber = new CircleGrabber(v(0, 0),
      this.rad, (...p) => this.grabbed(...p));
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
    const [_subgroup, _i, x, y, _dx, _dy, _hit] = p;
    DefaultTool.collectRaindrop(this.sim, x, y);
  }

  /**
   * Increment player currency and spawn a floater.
   * Called whenever a particle is grabbed by a DefaultTool instance.
   * Also called when a CircleBuddy eats a particle on the player's behalf.
   * @param {ParticleSim} sim The simulation where the raindrop was collected.
   * @param {number} x The x coordinate of the particle.
   * @param {number} y The y coordinate of the particle.
   */
  static collectRaindrop(sim, x, y) {

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

    // check if held control point over box or edge of screen for some time
    if (this._transferOnMouseUp && this._transferToScreen && this.held) {

      // transfer held body to the other screen
      let b = this.held;
      while (b.parent) {
        b = b.parent;
      }
      const innerScreen = this._transferToScreen;
      const innerSim = innerScreen.sim;
      this.sim.removeBody(b);
      b.getMainBody().pos = v(...rectCenter(...innerSim.rect));
      if (b instanceof BoxBuddy) {
        b.outerScreen = innerScreen;
        b.innerScreen.boxOuterScreen = innerScreen;
      }
      innerSim.addBody(b);

      // remove context menu and reticle
      this.sim.selectedBody = null;
    }

    // reset holding/dragging/grabbing state
    this._transferToScreen = null;
    this._transferTime = null;
    this._transferOnMouseUp = false;
    this.held = null;
    this.sim.draggingControlPoint = null;
    this.sim.removeGrabber(this.grabber);
  }

  /**
   * If catching rain, draw circle indicating catch radius
   * otherwise draw the standard cursor (the default tool icon).
   * @param {object} g The graphics context.
   * @param {Vector} p The position of the mouse.
   */
  drawCursor(g, p) {

    if (this._transferToScreen && this._transferOnMouseUp) {

      // has held control point over box for some time
      const forceAnim = true;
      super.drawCursor(g, p, insertIcon, null, forceAnim);

    }
    else if (this.held instanceof ControlPoint) {

      // held on control point
      this.sim.hoveredControlPoint = this.held;
      super.drawCursor(g, p);

    }
    else if (this.held) {

      // held on background
      const c = p;
      const r = this.rad;

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
      super.drawCursor(g, p);

      // debug control points hover vis radius
      // let r = global.controlPointVisibleHoverRadius
      // ControlPoint._draw(g,v(...p),r)
    }
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   */
  update(dt) {

    const r = this.rad;
    this.grabber.rad = r;
    this.grabber.r2 = r * r;

    if (this.held instanceof ControlPoint) {
      this._accelControlPoint(dt);

      // check if holding a body over a box
      const heldBody = this.sim.findRepresentativeBody(this.held);
      const box = this.sim.bodies.find((b) => this._mayInsert(heldBody, b));
      if (box) {

        if (box.innerScreen === this._transferToScreen) {

          // ongoing hold over box
          // check if held long enough to trigger insert
          const dur = this.sim.t - this._transferTime;
          this._transferOnMouseUp = (dur > 1000);

        }
        else {

          // just started holding over new box
          this._transferToScreen = box.innerScreen;
          this._transferTime = this.sim.t;
        }
      }
      else {

        // still holding but not over box
        this._transferToScreen = null;
      }
    }
  }

  /**
   * Return true if held body is near valid box.
   * @param {Body} heldBody The representative body being dragged.
   * @param {Body} box The candidate for box.
   */
  _mayInsert(heldBody, box) {
    if (heldBody === box) {
      return false;
    }
    if (box instanceof BoxBuddy) {
      const d = heldBody.pos.sub(box.pos).getMagnitude();
      return d < (2 * box.rad);
    }
    return false;
  }

  /**
   * Called in update() when applicable.
   * @param {number} dt The time elapsed in millseconds.
   */
  _accelControlPoint(dt) {
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

