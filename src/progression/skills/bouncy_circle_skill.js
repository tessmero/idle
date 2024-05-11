class BouncyCircleSkill extends Skill {
  constructor() {
    super('Bouncy Circle');
  }

  buildThumbnailSim() {
    const sim = new ThumbnailPSim();
    return sim;
  }
}
