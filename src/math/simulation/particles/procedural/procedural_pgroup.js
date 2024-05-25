// group of falling rain particles
//
// instantiated in particle_sim.js
/**
 *
 */
class ProceduralPGroup extends ParticleGroup {

  /**
   *
   * @param sim
   * @param n
   */
  constructor(sim, n) {
    super(sim, n);
    this.lastDrawTime = 0;
    this.wiggle = 0.05; // horizontal movement
    this.rngSeed = randomSeed();
  }

  /**
   *
   */
  * generateParticles() {
    resetRand(this.rngSeed);
    const n = this.n;
    const sr = this.sim.rect;
    const animAngle = this.sim.t * 1e-4;
    const wiggle = this.wiggle;
    global.particlesInMouseRange.clear();
    for (let i = 0; i < n; i++) {
      const a = animAngle + rand() * Math.PI * 2;
      const r = randRange(0, wiggle);
      const x = sr[0] + rand() * sr[2] + r * Math.cos(a * Math.floor(rand() * 10));
      const yr = randRange(0, sr[3]);
      const rawy = this.sim.fallSpeed * this.sim.t + yr;
      const prawy = this.sim.fallSpeed * this.lastDrawTime + yr;

      // if this particle just looped, ungrab it
      const ungrab = (Math.floor(rawy / sr[3]) !== Math.floor(prawy / sr[3]));
      const y = sr[1] + nnmod(rawy, sr[3]); // + r*Math.sin(a)

      // yield one particle
      yield [null, i, x, y, false, ungrab];
    }
    this.lastDrawTime = this.sim.t;
  }
}
