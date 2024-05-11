// Edge Particle Subgroup
//
// handles any particles stuck to or sliding along
// one specific body
//
// a "subgroup" is a garbage-collectable unit
// owned by an EdgePGroup
//
// members include
//   - body outline shape (Edge instance)
//   - body physics state (position,orientation,momentum)
class EdgeParticleSubgroup {
  // called in EdgePGroup newSubgroup()
  constructor(group, subgroupIndex, i, n, edge) {
    this.group = group;
    this.subgroupIndex = subgroupIndex;
    this.i = i;
    this.n = n;
    this.edge = edge; // Edge instance
    this.g = v(0, -edge.getG()); // gravity

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

  // called in EdgePGroup *generateParticles()
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

        const [_ea, _er, oldNorm] = this.edge.lookupDist(oldPos);
        const acc = this.getAccel(oldPos);

        const accAngle = acc.getAngle();
        const accMag = acc.getMagnitude();
        const norm = oldNorm + this.angle;
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
        const dnorm = Math.abs(cleanAngle(oldNorm - edgeNorm));

        const passedSharpCorner = dnorm > 1.6;

        // check if this particle has been pulled off edge
        if (passedSharpCorner || (safeRandRange(...stickyAccMag) < (normAcc + slideCentrifugalAcc))) {

          // pass particle to physics group
          grab = true;
          const usePos = passedSharpCorner ? oldPos : pos;
          const useVel = passedSharpCorner ? oldVel : vel;
          const useNorm = passedSharpCorner ? oldNorm + this.angle : norm;
          const xyPos = this.getPos(usePos);
          const xyVel = this.getVel(usePos).add(vp(useNorm + pio2, useVel));
          this.pps.spawnParticle(xyPos, xyVel);

        }

        // check if body is waiting to eat particle
        else if (bod && (bod.eatsQueued > 0)) {
          bod.eatsQueued = bod.eatsQueued - 1;
          const xyPos = this.getPos(pos);
          bod.eatParticleFromEdge(...xyPos.xy());
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

  // get x,y position at given
  // distance along cirumference
  getPos(a) {
    const [ea, er, _norm] = this.edge.lookupDist(a);
    return this.pos.add(vp(ea + this.angle, er));
  }

  // compute velocity of a particle
  // achored to edge at given distance along cirumference
  getVel(a) {
    const [ea, er, _norm] = this.edge.lookupDist(a);
    return this.vel // translation
      .add(vp(this.angle + ea + pio2, er * this.avel)); // rotation
  }

  // compute net force that would be felt by a particle
  // achored to edge at given distance along cirumference
  getAccel(a) {
    const [ea, er, _norm] = this.edge.lookupDist(a);
    const acc = this.acc // translational force
      .add(this.g) // gravity
      .add(vp(ea + this.angle, -1e-3 * Math.abs(this.spn) * er)); // centripital force
    return acc;
  }

  count(b) {
    let result = 0;
    for (let j = 0; j < this.n; j++) {
      if (this.isGrabbed(j) === b) { result = result + 1; }
    }
    return result;
  }

  isGrabbed(index) {
    const i = index + this.i;
    return this.group.grabbedParticles.has(i);
  }

  // get angle/vel of particle
  get(index) {
    const i = index + this.i;
    const nd = this.group.ndims;
    const a = this.group.state[i * nd];
    const av = this.group.state[i * nd + 1];
    return [a, av];
  }

  set(index, a, av) {
    const i = index + this.i;
    const nd = this.group.ndims;
    this.group.state[i * nd] = a;
    this.group.state[i * nd + 1] = av;
  }

  // set particle as grabbed
  grab(index) {
    const i = index + this.i;
    this.group.grabbedParticles.add(i);
  }

  hasIndex(i) {
    return (i >= this.i) && (i < this.i + this.n);
  }
}
