
/**
 * @file ParticleGroup base class for groups of particles.
 *
 * All the particles in a group are in the same simulation and
 * the same fundamental type (procedural, physics, or edge).
 */
class ParticleGroup {

  /**
   *
   * @param {ParticleSim} sim
   * @param {number} n
   */
  constructor(sim, n) {
    // ParticleSim instance
    this.sim = sim;

    // indices of particels that have been grabbed
    this.grabbedParticles = new IntSet(n);
    this.n = n;
  }

  /**
   *
   */
  countActiveParticles() {
    return this.n - this.grabbedParticles.size();
  }

  /**
   * called in particle_sim.js
   * draw all the particles in this group
   * @param {object} g The graphics context.
   * @param {object} counter Performance logging object to increment.
   * @param {Function} pdraw Function to draw a particle.
   */
  draw(g, counter, pdraw) {

    const r = this.sim.particleRadius;

    // start iterating over particle positions
    for (const [subgroup, i, x, y, grab, ungrab, dx, dy] of this.generateParticles()) {

      // check if previously grabbed
      if (this.grabbedParticles.has(i)) {

        if (ungrab) {
          // console.log(`ungrab ${i}`)
          this.grabbedParticles.delete(i);
        }

      }
      else {

        // check if newly grabbed
        const grabbed = (grab || this.sim.grabbers.some((gr) => {

          // prevent body grabbing from its own edge
          // (body.js)
          if (subgroup && (gr.eps === subgroup)) { return false; }

          counter.grabCheckCount = counter.grabCheckCount + 1;
          const hit = gr.contains(subgroup, i, x, y);
          if (hit) {

            // check if grab callback defined
            if (gr.grabbed) {

              // run grab callback and
              // mark particle as grabbed unless
              // a truthy flag returned
              const rval = gr.grabbed(subgroup, i, x, y, dx, dy, hit);
              return !rval;
            }

            // no grab function defined,
            // mark particle as grabbed
            return true;
          }
          return false;
        }));

        // draw particle
        counter.pdrawCount = counter.pdrawCount + 1;
        pdraw(g, x, y, r);

        if (grabbed) {
          counter.grabCount = counter.grabCount + 1;

          // console.log(`despawn ${i}`)
          this.grabbedParticles.add(i);
        }
      }
    }
  }

  /**
   * yield particle x,y coords
   */
  * generateParticles() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
