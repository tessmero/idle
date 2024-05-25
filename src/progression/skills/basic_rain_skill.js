/**
 *
 */
class BasicRainSkill extends Skill {
  /**
   *
   */
  constructor() {
    super('Drizzle');
  }

  /**
   *
   */
  buildThumbnailSim() {
    const sim = new ThumbnailPSim();
    return sim;
  }
}
