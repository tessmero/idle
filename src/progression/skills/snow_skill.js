/**
 *
 */
class SnowSkill extends Skill {
  /**
   *
   */
  constructor() {
    super('Wonderland');
  }

  /**
   *
   */
  buildThumbnailSim() {
    const sim = new ThumbnailPSim();
    sim.fallSpeed = sim.fallSpeed / 10;
    return sim;
  }
}
