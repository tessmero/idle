// physics-enabled object that interacts with particles
class Body {

  // sim is a ParticleSim instance
  constructor(sim, pos, angle = 0) {
    this.sim = sim;
    this.controlPoints = [];

    this.pos = pos;
    this.vel = v(0, 0);

    this.angle = angle;
    this.avel = 0;

    // increment to signal physics engine
    // call this.eatParticleFromEdge() ASAP
    this.eatsQueued = 0;
  }

  // called in register()
  buildEdge() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  // called in register()
  buildGrabber() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  // default draw method
  draw(g) {

    // draw edge shape by brute-force
    if (!this.edge) { return; }
    this.edge.trace(g, this.pos, this.angle);
    g.fillStyle = global.colorScheme.fg;
    g.fill();

  }

  // callback for this.grabber
  // when a particle is grabbed (particle_group.js)
  grabbed(subgroup, i, x, y, dx, dy, hit) {

    // place particle on edge
    this.eps.spawnParticle(hit, 0);

  }

  // called in particle_sim.js addBody()
  register(sim) {

    const edge = this.buildEdge();// new SausageEdge(len,this.rad)
    this.edge = edge;

    // prepare particle grabber instance
    this.grabber = this.buildGrabber();// new LineGrabber(a,b,rad,(x,y) => this.grabbed(x,y))
    sim.addGrabber(this.grabber);

    // prepare to emit particles
    // PPS = physics particle subgroup instance
    this.pps = sim.physicsGroup.newSubgroup();

    // prepare for particles sliding along edge
    // EPS = edge particle subgroup instance
    edge.computeEdgeShape();
    edge.pos = this.pos;
    this.eps = sim.edgeGroup.newSubgroup(edge);

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

  // called in particle_sim.js removeBody()
  unregister(sim) {
    sim.removeGrabber(this.grabber);
    sim.physicsGroup.deleteSubgroup(this.pps);
    sim.edgeGroup.deleteSubgroup(this.eps);
  }

  // apply translational force
  accel(acc) {
    this.vel = this.vel.add(acc); // move this body
    this.eps.acc = this.eps.acc.add(acc);// pass momentum to particles on edge
  }

  // apply torque
  spin(spn) {
    this.avel = this.avel + spn; // spin this body
    this.eps.spn = this.eps.spn + spn; // pass momentum to particles on edge
  }

  // called in edge_particle_subgroup.js
  // when this.eatsQueued > 0
  eatParticleFromEdge(x, y) {
    const par = this.parent;
    if (par && (par instanceof Buddy)) {
      par.particlesCollected = par.particlesCollected + 1;
    }
    DefaultTool._grabbed(this.sim, null, null, x, y, null, null, null);
  }

  update(dt, beingControlled = false) {

    const stopForce = global.bodyFriction;
    const angleStopForce = global.bodyAngleFriction;
    if (!beingControlled) {
      // stopForce *= 1e3
      // angleStopForce *= 1e3
    }

    // advance physics for poi

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
    if (this.pos.x < sr[0]) { this.pos.x = sr[0]; }
    if (this.pos.x > sr[0] + sr[2]) { this.pos.x = sr[0] + sr[2]; }
    if (this.pos.y < sr[1]) { this.pos.y = sr[1]; }
    if (this.pos.y > sr[1] + sr[3]) { this.pos.y = sr[1] + sr[3]; }

    // update grabber and edge particles
    this.grabber.pos = this.pos;
    this.grabber.angle = this.angle;
    this.eps.pos = this.pos;
    this.eps.vel = this.vel;
    this.eps.avel = this.avel;
    this.eps.angle = this.angle;

    return true;
  }

  // debug

  drawDebug(g) {
    if (global.showEdgeNormals) { this.drawNormals(g, this.pos, this.angle); }
    if (global.showEdgeSpokesA) { this.drawDistLutSpokes(g, this.pos, this.angle); }
    if (global.showEdgeSpokesB) { this.drawAngleLutSpokes(g, this.pos, this.angle); }
    if (global.showEdgeVel) { this.drawVel(g, this.pos, this.angle); }
    if (global.showEdgeAccel) { this.drawAccel(g, this.pos, this.angle); }
  }

  drawNormals(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, this.edge.circ, (a) => {
      const len = 3e-2;
      const [_ang, _r, norm] = this.edge.lookupDist(a);
      const p = this.eps.getPos(a);
      return [p, p.add(vp(norm + this.angle, len))];
    });
  }

  drawDistLutSpokes(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, this.edge.circ, (a) => {
      const p = this.eps.getPos(a);
      return [this.pos, p];
    });
  }

  drawAngleLutSpokes(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, twopi, (a) => {
      const [r, _r2, _d] = this.edge.lookupAngle(a - this.angle);
      const p = this.pos.add(vp(a, r));
      return [this.pos, p];
    });
  }

  drawVel(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, this.edge.circ, (a) => {
      const p = this.eps.getPos(a);
      const vel = this.eps.getVel(a);
      return [p, p.add(vel.mul(1e2))];
    });
  }

  drawAccel(g) {
    if (!this.edge) { return; }
    this._drawDebugVectors(g, 0, this.edge.circ, (a) => {
      const p = this.eps.getPos(a);
      const acc = this.eps.getAccel(a);
      return [p, p.add(acc.mul(3e3))];
    });
  }

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
