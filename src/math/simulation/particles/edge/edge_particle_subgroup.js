
/**
 * @file Edge Particle Subgroup object type.
 *
 * handles any particles stuck to or sliding along
 * one specific body
 *
 * a "subgroup" is a garbage-collectable unit
 * owned by an EdgePGroup
 *
 * members include
 *   - body outline shape (Edge instance)
 *   - body physics state (position,orientation,momentum)
 */
class EdgeParticleSubgroup {

  /**
   * called in EdgePGroup newSubgroup()
   * @param {object} group
   * @param {number} subgroupIndex
   * @param {number} i
   * @param {number} n
   * @param {object} edge
   */
  constructor(group, subgroupIndex, i, n, edge) {
    this.group = group;
    this.subgroupIndex = subgroupIndex;
    this.i = i;
    this.n = n;
    this.edge = edge; // Edge instance
    this._g = v(0, -edge.getG()); // gravity

    // set all particles as grabbed initially
    const m = this.i + this.n;
    for (let j = i; j < m; j++) { this.group.grabbedParticles.add(j); }

    // state
    this.pos = v(0, 0);
    this.vel = v(0, 0);
    this.angle = 0;
    this.avel = 0;

    // prepare to add up net translational force during body updates
    // so particles react accordingly in generateParticles()
    this.acc = v(0, 0);
    this.spn = 0;
  }

  /**
   * make gravity match nearby physics particles
   * needs cleanup
   */
  get g() {
    const angle = this.group.sim.particleG.getAngle();
    return vp(pi + angle, this._g.getMagnitude());
  }

  /**
   * called in EdgePGroup generateParticles()
   * @param {number} dt The time elapsed in millseconds.
   */
  * generateParticles(dt) {

    // prepare to multiply and offset velocities
    // to apply gravity and accel to all particles
    const f = this.edge.getFriction();
    const vm = (1 - f * dt);

    // update centripital foce due to body spinning
    this.spn = this.avel * dt;

    // anti-normal stickiness "force" for purposes of
    // deciding whether a particle remains stuck to edge
    const stickyAccMag = global.particleStickyForce.map((v) => v * dt);

    const bod = this.body;
    const grp = this.group;
    const tgs = grp.state;
    const nd = grp.ndims;
    const m = this.i + this.n;
    const circ = this.edge.circ;

    for (let i = this.i; i < m; i++) {

      // check if currently grabbed
      const active = !grp.grabbedParticles.has(i);
      if (active) {

        // advance physics
        const oldPos = tgs[i * nd + 0];
        const oldVel = tgs[i * nd + 1];

        const [_ea, _er, oldEdgeNorm] = this.edge.lookupDist(oldPos);
        const acc = this.getAccel(oldPos);

        const accAngle = acc.getAngle();
        const accMag = acc.getMagnitude();
        const norm = oldEdgeNorm + this.angle;
        let vel = oldVel + accMag * Math.sin(norm - accAngle);// accel particle along edge
        vel = vel * vm; // friction
        let pos = oldPos + vel * dt;
        pos = nnmod(pos, circ);
        const edgeNorm = this.edge.lookupDist(pos)[2];
        tgs[i * nd + 0] = pos;
        tgs[i * nd + 1] = vel;

        let grab = false;

        // normal force felt by particle anchored to edge at this particle's position
        const normAcc = -accMag * Math.cos(norm - accAngle);

        // additional normal force felt due to sliding along edge
        const slideCentrifugalAcc = 0; // poopy

        // check if just passed a sharp corner
        const dnorm = Math.abs(cleanAngle(oldEdgeNorm - edgeNorm));

        const passedSharpCorner = dnorm > 1.6;

        // check if this particle has been pulled off edge
        if (passedSharpCorner || (safeRandRange(...stickyAccMag) < (normAcc + slideCentrifugalAcc))) {

          // pass particle to physics group
          grab = true;
          const usePos = passedSharpCorner ? oldPos : pos;
          const useVel = passedSharpCorner ? oldVel : vel;
          const useNorm = passedSharpCorner ? oldEdgeNorm + this.angle : edgeNorm + this.angle;
          const [xyPos, xyVel] = this.getXyPosVel(i, usePos, useVel, useNorm);
          this.pps.spawnParticle(xyPos, xyVel);
        }

        // check if body is waiting to eat particle
        else if (bod && (bod.eatsQueued > 0)) {
          bod.eatsQueued = bod.eatsQueued - 1;
          const xyPos = this.getPos(pos);
          bod.eatParticleFromEdge(xyPos);
          grab = true;
        }

        // yield one particle to be grabbed/drawn
        const ungrab = false;
        const [x, y] = this.getPos(pos).xy();

        yield [this, i, x, y, grab, ungrab];
      }
    }

    // reset net force
    this.acc = v(0, 0);
  }

  /**
   * get 2d pysics state for existing particle on this edge
   * @param  {number} i The particle index
   * @param  {number} pos Optional 1D position along this edge,
   * @param  {number} vel Optional 1D veloicy along this edge,
   * @param  {number} norm Optional normal angle of this edge at pos,
   * @returns {Vector[]} xyPos,xyVel
   */
  getXyPosVel(i, pos, vel, norm) {
    const grp = this.group;
    const tgs = grp.state;
    const nd = grp.ndims;

    const p = pos ? pos : tgs[i * nd + 0];
    const v = vel ? vel : tgs[i * nd + 1];

    const nrm = norm ? norm : this.edge.lookupDist(p)[2] + this.angle;

    const xyPos = this.getPos(p);
    const xyVel = this.getVel(p).add(vp(nrm + pio2, v));
    return [xyPos, xyVel];
  }

  /**
   *
   * @param {Vector} pos
   * @param {Vector} vel
   */
  spawnParticle(pos, vel) {

    const i = this.i;
    const m = i + this.n;
    const nd = this.group.ndims;
    const tgs = this.group.state;

    // find available particle slot
    for (let j = i; j < m; j++) {
      if (this.group.grabbedParticles.has(j)) {

        // spawn particle
        this.group.grabbedParticles.delete(j);
        const k = j * nd;
        tgs[k + 0] = pos;
        tgs[k + 1] = vel;

        // console.log(`eps ${i}-${m} spawned ${j}`)
        return;
      }
    }
  }

  /**
   * get x,y position at given
   * distance along cirumference
   * @param {number} a The 1D position along the edge.
   */
  getPos(a) {
    const [ea, er, _norm] = this.edge.lookupDist(a);
    return this.pos.add(vp(ea + this.angle, er));
  }

  /**
   * compute velocity of a hypothetical particle
   * anchored to edge at given distance along cirumference
   * @param {number} a The 1D position along the edge.
   */
  getVel(a) {
    const [ea, er, _norm] = this.edge.lookupDist(a);
    return this.vel // translation
      .add(vp(this.angle + ea + pio2, er * this.avel)); // rotation
  }

  /**
   * compute net force that would be felt by a particle
   * achored to edge at given distance along cirumference
   * @param {number} a The 1D position along the edge.
   */
  getAccel(a) {
    const [ea, er, _norm] = this.edge.lookupDist(a);
    const acc = this.acc // translational force
      .add(this.g) // gravity
      .add(vp(ea + this.angle, -1e-3 * Math.abs(this.spn) * er)); // centripital force
    return acc;
  }

  /**
   *
   * @param {boolean} b
   */
  count(b) {
    let result = 0;
    for (let j = 0; j < this.n; j++) {
      if (this.isGrabbed(j) === b) { result = result + 1; }
    }
    return result;
  }

  /**
   *
   * @param {number} index
   */
  isGrabbed(index) {
    const i = index + this.i;
    return this.group.grabbedParticles.has(i);
  }

  /**
   * get angle/vel of particle
   * @param {number} index
   */
  get(index) {
    const i = index + this.i;
    const nd = this.group.ndims;
    const a = this.group.state[i * nd];
    const av = this.group.state[i * nd + 1];
    return [a, av];
  }

  /**
   *
   * @param {number} index
   * @param {number} a
   * @param {number} av
   */
  set(index, a, av) {
    const i = index + this.i;
    const nd = this.group.ndims;
    this.group.state[i * nd] = a;
    this.group.state[i * nd + 1] = av;
  }

  /**
   * set particle as grabbed
   * @param {number} index
   */
  grab(index) {
    const i = index + this.i;
    this.group.grabbedParticles.add(i);
  }

  /**
   *
   * @param {number} i
   */
  hasIndex(i) {
    return (i >= this.i) && (i < this.i + this.n);
  }
}
