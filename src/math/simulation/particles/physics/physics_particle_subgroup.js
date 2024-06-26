/**
 * @file PhysicsParticleSubgroup
 *
 * handles some particles owned by a PhysicsParticleGroup
 * has fixed particle address range i to i+n in the group
 *
 * "subgroup" meaning one garbage-collectable unit
 */
class PhysicsParticleSubgroup {

  /**
   *
   * @param {object} group
   * @param {number} subgroupIndex
   * @param {number} i
   * @param {number} n
   */
  constructor(group, subgroupIndex, i, n) {
    this.group = group;
    this.subgroupIndex = subgroupIndex;
    this.i = i;
    this.n = n;

    // set all particles as grabbed initially
    const m = this.i + this.n;
    for (let j = i; j < m; j++) { this.group.grabbedParticles.add(j); }
  }

  /**
   * called in PyhsicsPGroup generateParticles()
   * @param {number} dt The time elapsed in millseconds.
   * @param {number} vm The multiplier for all velocities (friction).
   * @param {number} vb The offset for all velocities (gravity).
   */
  * generateParticles(dt, vm, vb) {
    const grp = this.group;
    const nd = grp.ndims;
    for (let di = 0; di < this.n; di++) {
      const i = this.i + di;

      // check if currently grabbed
      const active = !grp.grabbedParticles.has(i);
      if (active) {

        let x = grp.state[i * nd + 0];
        let y = grp.state[i * nd + 1];

        // advance physics
        let vx = grp.state[i * nd + 2];
        let vy = grp.state[i * nd + 3];

        vx = vm * vx + vb.x;
        vy = vm * vy + vb.y;
        x = x + vx * dt;
        y = y + vy * dt;

        grp.state[i * nd + 0] = x;
        grp.state[i * nd + 1] = y;
        grp.state[i * nd + 2] = vx;
        grp.state[i * nd + 3] = vy;

        // check if off-screen
        let grab = false;
        if (!inRect(x, y, ...grp.sim.rect)) {

          // trigger callback
          // used for black box inner simulation
          this.group.sim.physicsParticlePassedOffscreen(v(x, y), v(vx, vy));

          grab = true;
        }

        // yield one particle
        const ungrab = false;
        yield [this, i, x, y, grab, ungrab, vx, vy];
      }

    }
  }

  /**
   *
   * @param {number} i
   */
  hasIndex(i) {
    return (i >= this.i) && (i < this.i + this.n);
  }

  /**
   * Add a particle to this subgroup.
   * @param {Vector} pos The position.
   * @param {Vector} vel The velocity.
   */
  spawnParticle(pos, vel) {
    const i = this.i;
    const m = i + this.n;
    const grp = this.group;
    const nd = this.group.ndims;

    // find available particle slot
    for (let j = i; j < m; j++) {
      if (grp.grabbedParticles.has(j)) {

        // spawn particle
        grp.grabbedParticles.delete(j);
        const k = j * nd;
        grp.state[k + 0] = pos.x;
        grp.state[k + 1] = pos.y;
        grp.state[k + 2] = vel.x;
        grp.state[k + 3] = vel.y;

        return;
      }
    }
  }
}
