/**
 * @file ParticleSim object type.
 * Owned by a GameScreen instance.
 * Contains one of each type of particle group:
 * one procedural group, one physics group, and one edge group.
 */
class ParticleSim {

  #grabbers = new Set();
  #bodies = new Set();
  #particlesCollected = 0;

  /**
   *
   */
  get particlesCollected() {
    return this.usesGlobalCurrency ?
      global.particlesCollected : this.#particlesCollected;
  }

  /**
   *
   */
  set particlesCollected(pc) {
    if (this.usesGlobalCurrency) {
      global.particlesCollected = pc;
    }
    else {
      this.#particlesCollected = pc;
    }
  }

  /**
   * Create a new Particle Simulation.
   * @param {number} n The max number of particles in each group.
   * @param {number[]} rect The bounding rectangle for the simulation.
   */
  constructor(n, rect) {
    this.rect = rect;
    this.t = 0;
    this.paused = false;

    // prepare toolList
    this.toolList = [
      new DefaultTool(this, global.mouseGrabRadius),
      new CircleTool(this),
      new LineTool(this),
      new BoxTool(this),
      new PiTool(this, global.mouseGrabRadius),
    ];

    // particles
    this.rainGroup = new ProceduralPGroup(this, n);
    this.physicsGroup = new PhysicsParticleGroup(this, n);
    this.edgeGroup = new EdgeParticleGroup(this, n);

    // prepare extra subgroup for various leftover physics particles
    // e.g. particles emitted by body, then body was deleted
    this.leftoverPPS = this.physicsGroup.newSubgroup();
    this.floaters = new FloaterGroup(1000);
    this.poiMaxArea = 1e-2;
    this.poiShrinkRate = 1e-6;// vunits^2 area lost per ms

    // physics params
    this.fallSpeed = 2e-4; // terminal velocity dist/ms
    this.particleRadius = 0.005;
    this.particleG = v(0, 1e-7); // gravity accel dis/ms/ms

    // state
    this.particlesCollected = 0;

    // circles for mouse to click and drag
    this.controlPointRadius = 0.05;

    this.hoveredControlPoint = null; // ControlPoint instance
    this.draggingControlPoint = null; // ControlPoint instance
  }

  /**
   * Called when default tool is clicked on a body.
   * Trigger context menu if applicable.
   * @param {Body} body The body that was clicked.
   */
  bodyClicked(body) {
    // trigger callback
    body.clicked();

    // find Buddy instance (top level CompoundBody)
    // or "main" Body of CompoundBody
    // or use given Body with no heirarchy
    let b = body;
    while (b.parent) {
      b = b.parent;
    }
    if (b instanceof Buddy) {
      // do nothing
    }
    else if (b instanceof CompoundBody) {
      b = b.getMainBody();
    }

    this.selectedBody = b;
    this.selectedParticle = null;
  }

  /**
   * Called when particle inspector tool
   * grabs a particle.
   * @param {object} p Data about the particle.
   */
  particleClicked(p) {
    this.selectedParticle = p;
    this.selectedBody = null;
  }

  /**
   * Get the tool currently represented by the cursor.
   */
  get tool() {
    return this._tool;
  }

  /**
   * Prevent changing tool with equal sign.
   */
  set tool(_t) {
    throw new Error('should use setTool');
  }

  /**
   * Unregister the current tool and switch to the new tool.
   * @param {Tool} t The new tool show for the cursor for this sim
   */
  setTool(t) {
    const prev = this._tool;
    if (t === prev) { return; }

    if (prev) {
      prev.unregister(this);
    }
    this._tool = t;
    if (t) { t.setSim(this); }
  }

  /**
   * Prevent assigning grabbers list with equals sign.
   */
  set grabbers(_g) {
    throw new Error('not allowed');
  }

  /**
   *
   */
  get grabbers() {
    return [...this.#grabbers];
  }

  /**
   *
   */
  clearGrabbers() {
    this.#grabbers.clear();
  }

  /**
   *
   * @param b
   */
  addGrabber(b) {
    this.#grabbers.add(b);
  }

  /**
   *
   * @param b
   */
  removeGrabber(b) {
    this.#grabbers.delete(b);
  }

  /**
   * Get a copy of the list of bodies in this sim.
   */
  get bodies() {
    return [...this.#bodies];
  }

  /**
   * Add a body to this simulation.
   * @param {Body} b The body that should be added
   */
  addBody(b) {
    if (this.#bodies.length >= global.maxBodyCount) {
      return;
    }

    if (this.#bodies.has(b)) {
      return;
    }

    this.#bodies.add(b);
    b.sim = this;
    b.register(this);
  }

  /**
   * Unregister and
   * @param b
   */
  removeBody(b) {
    this.#bodies.delete(b);
    b.unregister(this);
  }

  /**
   * remove all bodies
   */
  clearBodies() {
    [...this.#bodies].forEach((b) => this.removeBody(b));
    this.selectedBody = null;
  }

  /**
   * Reset this simulation.
   */
  reset() {
    const s = this;
    s.clearBodies();
    s.clearGrabbers();
    s.setTool(null);
    s.selectedParticle = null;
    s.selectedBody = null;
    s.particlesCollected = 0;
    s.draggingControlPoint = null;
    s.hoveredControlPoint = null;

    // activate all procedural particles
    this.rainGroup.grabbedParticles.fill(false);

    // grab/remove all others
    this.physicsGroup.grabbedParticles.fill(true);
    this.edgeGroup.grabbedParticles.fill(true);

    // s.t = 0
  }

  /**
   * Advance time and bodies in simulation.
   * @param {number} dt The time elapsed since last update.
   */
  update(dt) {
    global.livePerformanceStats.flagSim(this, 'updated');
    if (dt > 0) {
      global.livePerformanceStats.flagSim(this, 'time passing');
    }

    this.t = this.t + dt;

    // update bodies
    const toRemove = [...this.#bodies].filter((p) => {
      const alive = p.update(dt);
      return !alive;
    });
    toRemove.forEach((b) => this.removeBody(b));
  }

  /**
   * Update member hoveredControlPoint
   * @param {Vector} p The position of the mouse.
   */
  updateControlPointHovering(p) {

    // update control point hovering status
    if (!this.draggingControlPoint) {
      const cps = this.bodies.flatMap((b) => b.controlPoints);
      this.hoveredControlPoint = cps.find(
        (cp) => (cp.pos.sub(p).getD2() < cp.r2));
    }
  }

  /**
   * callback used for black box inner simulation
   * called in physics_particle_subgroup.js
   * @param {Vector} _pos The position of the particle.
   * @param {Vector} _vel The velocity of the particle.
   */
  physicsParticlePassedOffscreen(_pos, _vel) {}

  /**
   * Draw this simulation.
   * @param {object} g The graphics context.
   * @param hidden 05/26/2024 hacky flag to make persistent screens work
   */
  draw(g, hidden = false) {
    if (hidden) { global.livePerformanceStats.flagSim(this, 'DRAWN HIDDEN'); }
    const pdraw = hidden ? (() => {}) : ((gg, x, y, r) => gg.fillRect(x - r, y - r, 2 * r, 2 * r));

    // start counting for performance stats
    const counter = {
      grabCheckCount: 0,
      grabCount: 0,
      pdrawCount: 0,
    };

    resetRand();
    if (!hidden) {
      g.fillStyle = global.colorScheme.fg;
      this.#bodies.forEach((p) => p.draw(g));
      this.#bodies.forEach((p) => p.drawDebug(g));
    }

    const c = hidden ? false : global.colorcodeParticles;
    if (c) { g.fillStyle = 'red'; }
    this.rainGroup.draw(g, counter, pdraw);

    if (c) { g.fillStyle = 'green'; }
    this.physicsGroup.draw(g, counter, pdraw);

    if (c) { g.fillStyle = 'blue'; }
    this.edgeGroup.draw(g, counter, pdraw);

    if (global.debugGrabbers) {
      this.#grabbers.forEach((gr) => gr.drawDebug(g));
    }

    if (!hidden) {
      let cp = this.draggingControlPoint;
      if (!cp) { cp = this.hoveredControlPoint; }
      if (cp) {
        cp.draw(g, global.colorScheme.hl, true);
      }

      g.fillStyle = global.colorScheme.fg;

      // draw tool overlay if applicable
      const tool = this._tool;
      if (tool && tool.draw) {
        tool.draw(g);
      }

      // draw floaters
      this.floaters.draw(g);
    }

    // log performance stats
    // added 05/26/2024 hack
    if (!this.lastDrawTime) {
      this.lastDrawTime = 0;
    }
    const suf = (this.lastDrawTime === this.t) ? ' (no update)' : '';
    this.lastDrawTime = this.t;
    global.livePerformanceStats.flagSim(this, `drawn${suf}`);

    Object.keys(counter).forEach((key) => {
      global.livePerformanceStats.flagSim(this, `${key}${suf}`, counter[key]);
    });
  }
}
