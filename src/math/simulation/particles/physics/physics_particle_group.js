
/**
 * @file PhysicsParticleGroup
 *
 * A group of paticles with 2d positions and velocities.
 */
class PhysicsParticleGroup extends ParticleGroup {

  /**
   *
   * @param sim
   * @param n
   */
  constructor(sim, n) {
    super(sim, n);

    // preare to keep track of up to
    // n particles with 4 props x,y,vx,vy
    const ndims = 4;
    this.ndims = ndims;
    this.state = new FloatArray(n * ndims).get();

    // maximum number of particles per subgroup
    // subgroup = (garbage-collectable unit)
    this.maxSubgroups = 100;
    this.nsub = Math.floor(n / this.maxSubgroups);
    this.freeSubgroupIndices = new IntSet(this.maxSubgroups, true);

    // prepare to keep track of subgroups
    this.subgroups = new Set();

    // set all particles as grabbed initially
    this.grabbedParticles.fill(true);
  }

  /**
   * return new subgroup instance
   */
  newSubgroup() {

    if (this.freeSubgroupIndices.size() === 0) {
      return null;
    }

    const subgroupIndex = this.freeSubgroupIndices.find(true);
    const n = this.nsub;
    const i = subgroupIndex * n;
    const sg = new PhysicsParticleSubgroup(this, subgroupIndex, i, n);
    this.subgroups.add(sg);
    this.freeSubgroupIndices.delete(subgroupIndex);
    return sg;
  }

  /**
   *
   * @param sg
   */
  deleteSubgroup(sg) {
    this.freeSubgroupIndices.add(sg.subgroupIndex);
    this.subgroups.delete(sg);
  }

  /**
   *
   */
  * generateParticles() {
    resetRand();

    let dt = 0;
    if (this.lastDrawTime) { dt = this.sim.t - this.lastDrawTime; }
    this.lastDrawTime = this.sim.t;

    // set terminal velocity to match falling rain
    const mg = this.sim.particleG.getMagnitude();
    const particleFriction = mg / this.sim.fallSpeed;

    // prepare to multiply and offset velocities
    // to apply friction and gravity to all particles
    const vm = (1 - particleFriction * dt);

    const vb = this.sim.particleG.mul(dt);

    for (const pps of this.subgroups) {
      yield *pps.generateParticles(dt, vm, vb);
    }
  }
}
