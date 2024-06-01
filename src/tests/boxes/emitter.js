/**
 * @file Emitter body used for box tests.
 *
 * Spawns physics particles.
 * Otherwise this has no interaction similar to ControlPoint.
 */
class Emitter extends Body {

  // spawn timer
  #countdown = 0;
  #delay = 200;

  // speed of spawned particles
  #speed = 0;

  /**
   *
   * @param sim
   * @param pos
   * @param angle
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
      this.sim.leftoverPPS.spawnParticle(this.pos, vel);
      this.#countdown = this.#countdown + this.#delay;
    }

    return true;
  }

  /**
   * no direct interaction with particles
   * @param _sim
   */
  register(_sim) {}

  /**
   * no direct interaction with particles
   * @param _sim
   */
  unregister(_sim) {}
}
