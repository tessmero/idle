/**
 * @file Emitter pseudo-body that spawns physics particles.
 * Otherwise this has no interaction similar to ControlPoint.
 */
class Emitter extends Body {

  // spawn timer
  #countdown = 0;
  #delay = 200;

  // speed of spawned particles
  #speed = 0;

  // physics particle subgroup instance
  #pps;

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   * @param {number} angle
   */
  constructor(sim, pos, angle = 0) {
    super(sim, pos, angle);
  }

  /**
   * Periodically emit particles.
   * @param  {number} dt The time elapsed.
   */
  update(dt) {
    this.#countdown = this.#countdown - dt;
    if (this.#countdown < 0) {
      const vel = vp(this.angle, this.#speed);
      this.#pps.spawnParticle(this.pos, vel);
      this.#countdown = this.#countdown + this.#delay;
    }

    return true;
  }

  /**
   * Override body. Just reserve a group for the emitted particles.
   * @param {ParticleSim} sim
   */
  register(sim) {

    // prepare to emit particles
    // PPS = physics particle subgroup instance
    this.#pps = sim.physicsGroup.newSubgroup();
  }

  /**
   * @param {ParticleSim} sim
   */
  unregister(sim) {
    sim.physicsGroup.deleteSubgroup(this.#pps);
  }
}
