/**
 *
 */
class FlipperLineSkill extends Skill {
  /**
   *
   */
  constructor() {
    super('Flipper');
  }

  /**
   *
   */
  buildThumbnailSim() {
    const sim = new ThumbnailPSim();
    return sim;
  }
}
