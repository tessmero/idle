
/**
 * @file EdgeParticleGroup
 *
 * a group of particles stuck to edges.
 */
class EdgeParticleGroup extends ParticleGroup {

  /**
   *
   * @param sim
   * @param n
   */
  constructor(sim, n) {
    super(sim, n);
    this.isEdgeGroup = true; // particle_group.js draw()

    // preare to keep track of up to
    // n particles with 2 props (pos,vel in 1D)
    const ndims = 2;
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

  // return new subgroup instance
  // for bodies that emit particles
  //
  // should be called in [Body subclass]::register(sim):
  //      sim.edgeGroup.newSubgroup(edge)
  /**
   *
   * @param edge
   */
  newSubgroup(edge) {

    if (this.freeSubgroupIndices.size === 0) {
      return null;
    }

    const subgroupIndex = this.freeSubgroupIndices.find(true);
    const n = this.nsub;
    const i = subgroupIndex * n;
    const sg = new EdgeParticleSubgroup(this, subgroupIndex, i, n, edge);
    this.subgroups.add(sg);
    this.freeSubgroupIndices.delete(subgroupIndex);
    return sg;
  }

  // should be called in [Body subclass]::unregister(sim):
  //      sim.edgeGroup.deleteSubgroup(edge)
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

    for (const eps of this.subgroups) {
      yield* eps.generateParticles(dt);
    }
  }
}
