/**
 * @file Body base class for physics-enabled rigid
 * bodies that interact with particles.
 */
class Body {

  /**
   * unique key used to reference distinct Edge instance
   * @abstract
   * @type {string}
   */
  _edgeKey;

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   */
  constructor(sim, pos) {
    this.sim = sim;
    this.controlPoints = [];

    this.pos = pos;
    this.vel = v(0, 0);

    this.angle = 0;
    this.avel = 0;

    // increment to signal physics engine
    // call this.eatParticleFromEdge() ASAP
    this.eatsQueued = 0;
  }

  /**
   * Called in register().
   */
  buildEdge() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Build generic pizza grabber for whatever shape buildEdge() returns.
   * Called in register().
   */
  buildGrabber() {
    return new EdgeGrabber(
      this.pos, this.angle, this.edge,
      (...p) => this.grabbed(...p), 0);
  }

  /**
   * Default draw implementation using brute force.
   * Trace many small intervals along the edge.
   * @param {object} g The graphics context.
   */
  draw(g) {

    if (!this.edge) { return; }
    this.edge.trace(g, this.pos, this.angle);
    g.fillStyle = global.colorScheme.fg;
    g.fill();

  }

  /**
   * callback for this.grabber
   * called when a particle is grabbed
   * (particle_group.js)
   * @param {...any} p
   */
  grabbed(...p) {
    const [_subgroup, _i, _x, _y, _dx, _dy, hit] = p;

    // place particle on edge
    this.eps.spawnParticle(hit, 0);
  }

  /**
   * Called when user clicks this body.
   */
  clicked() {}

  /**
   * used in register
   */
  _pickEdgeKey() {
    const key = this._edgeKey;
    if (this.isMiniature) {
      return `mini ${key}`;
    }
    return key;
  }

  /**
   * called in particle_sim.js addBody()
   * @param {ParticleSim} sim
   */
  register(sim) {
    this.sim = sim;

    // lookup/build distinct edge shape
    const mgr = EdgeManager();
    const key = this._pickEdgeKey();
    if (!key) {
      throw new Error('_edgeKey not defined');
    }
    if (!mgr.hasEdge(key)) {
      const ne = this.buildEdge();
      if (ne.titleKey !== key) {
        throw new Error('newly constructed edge does not have expected key');
      }
      ne.computeEdgeShape();
    }
    this.edge = mgr.getEdge(key);

    // prepare particle grabber instance
    this.grabber = this.buildGrabber();
    sim.addGrabber(this.grabber);

    // prepare to emit particles
    // PPS = physics particle subgroup instance
    this.pps = sim.physicsGroup.newSubgroup();

    // prepare for particles sliding along edge
    // EPS = edge particle subgroup instance
    this.eps = sim.edgeGroup.newSubgroup(this);

    // indicate to grabber
    // not to grab from this edge
    // (parice_groupjs)
    this.grabber.eps = this.eps;

    // prepare to pass particles from edge to physics
    this.eps.pps = this.pps;
    this.eps.pos = this.pos;
    this.eps.angle = this.angle;

    // prepare to receive particles from edge
    // when this.eatsQueued is 1 or more
    this.eps.body = this;
  }

  /**
   * called in particle_sim.js removeBody()
   * @param {ParticleSim} sim
   */
  unregister(sim) {
    sim.removeGrabber(this.grabber);
    sim.physicsGroup.deleteSubgroup(this.pps);
    sim.edgeGroup.deleteSubgroup(this.eps);
  }

  /**
   * Apply translational force to this body.
   * @param {Vector} acc
   */
  accel(acc) {

    this.vel = this.vel.add(acc); // move this body

    if (this.eps) {

      // edge particle subgroup
      // pass momentum to particles on edge
      this.eps.acc = this.eps.acc.add(acc);
    }
  }

  /**
   * Apply torque to this body.
   * @param {number} spn
   */
  spin(spn) {
    this.avel = this.avel + spn; // rotate this body

    if (this.eps) {

      // edge particle subgroup
      // pass momentum to particles on edge
      this.eps.spn = this.eps.spn + spn;
    }
  }

  /**
   * Used by CircleBuddy.
   * Called in edge_particle_subgroup.js when this.eatsQueued > 0
   * @param {Vector} pos The position of the particle.
   */
  eatParticleFromEdge(pos) {
    const par = this.parent;
    if (par && (par instanceof CircleBuddy)) {
      par.gainExp(1);
      par.particlesCollected = par.particlesCollected + 1;
    }
    DefaultTool.collectRaindrop(this.sim, ...pos.xy());
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   */
  update(dt) {

    const stopForce = global.bodyFriction;
    const angleStopForce = global.bodyAngleFriction;

    // advance physics

    // translation
    const frictionAcc = this.vel.mul(-dt * stopForce);
    this.accel(frictionAcc);
    this.pos = this.pos.add(this.vel.mul(dt));

    // rotation
    const frictionSpn = this.avel * (-dt * angleStopForce);
    this.spin(frictionSpn);
    this.angle = this.angle + this.avel * dt;

    // push on-screen
    const sr = this.sim.rect;
    const pos = this.pos;
    if (pos.x < sr[0]) { this.pos = v(sr[0], pos.y); }
    if (pos.x > sr[0] + sr[2]) { this.pos = v(sr[0] + sr[2], pos.y); }
    if (pos.y < sr[1]) { this.pos = v(pos.x, sr[1]); }
    if (pos.y > sr[1] + sr[3]) { this.pos = v(pos.x, sr[1] + sr[3]); }

    // update grabber and edge particles
    this.grabber.pos = this.pos;
    this.grabber.angle = this.angle;
    this.eps.pos = this.pos;
    this.eps.vel = this.vel;
    this.eps.avel = this.avel;
    this.eps.angle = this.angle;

    return true;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawDebug(g) {
    if (global.showEdgeNormals) { this.drawNormals(g); }
    if (global.showEdgeSpokesA) { this.drawDistLutSpokes(g); }
    if (global.showEdgeSpokesB) { this.drawAngleLutSpokes(g); }
    if (global.showEdgeVel) { this.drawVel(g); }
    if (global.showEdgeAccel) { this.drawAccel(g); }
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawNormals(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, this.edge.circ, (a) => {
      const len = 3e-2;
      const [_ang, _r, norm] = this.edge.lookupDist(a);
      const p = this.eps.getPos(a);
      return [p, p.add(vp(norm + this.angle, len))];
    });
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawDistLutSpokes(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, this.edge.circ, (a) => {
      const p = this.eps.getPos(a);
      return [this.pos, p];
    });
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawAngleLutSpokes(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, twopi, (a) => {
      const [r, _r2, _d] = this.edge.lookupAngle(a - this.angle);
      const p = this.pos.add(vp(a, r));
      return [this.pos, p];
    });
  }

  /**
   * Draw velocity vectors along edge.
   * @param {object} g The graphics context.
   */
  drawVel(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, this.edge.circ, (a) => {
      const p = this.eps.getPos(a);
      const vel = this.eps.getVel(a);
      return [p, p.add(vel.mul(1e2))];
    });
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  drawAccel(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, this.edge.circ, (a) => {
      const p = this.eps.getPos(a);
      const acc = this.eps.getAccel(a);
      return [p, p.add(acc.mul(3e3))];
    });
  }

  /**
   *
   * @param {object} g The graphics context.
   * @param {number} t0 The starting 1D point.
   * @param {number} t1 The ending 1D point.
   * @param {Function} f The function to compute vector at 1D point.
   */
  _drawDebugVectors(g, t0, t1, f) {
    if (!this.edge) { return; }

    const circ = this.edge.circ;

    const density = 100; // ~lines per screen length
    const n = circ * density;
    g.strokeStyle = 'yellow';
    g.beginPath();
    g.lineWidth = 0.002;
    for (let i = 0; i < n; i++) {
      const a = avg(t0, t1, i / n);
      const [start, stop] = f(a);
      g.moveTo(...start.xy());
      g.lineTo(...stop.xy());
    }
    g.stroke();
    g.strokeStyle = global.colorScheme.fg;
  }
}
