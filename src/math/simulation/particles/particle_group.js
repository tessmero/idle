
/**
 * base class for groups of similar particles
 * particles may be grabbed by Grabber instances
 */
class ParticleGroup {

  /**
   *
   * @param sim
   * @param n
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
   * @param g
   * @param counter
   * @param pdraw
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
        const grabbed = (grab || this.sim.getGrabbers().some((gr) => {

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
