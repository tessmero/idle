class FastRainSkill extends Skill {
  constructor() {
    super('Downpour');
  }

  buildThumbnailSim() {
    const sim = new ThumbnailPSim();
    sim.fallSpeed = sim.fallSpeed * 4;
    return sim;
  }
}
