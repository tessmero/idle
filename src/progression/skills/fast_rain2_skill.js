class FastRain2Skill extends Skill {
  constructor() {
    super('Monsoon');
  }

  buildThumbnailSim() {
    const sim = new ThumbnailPSim();
    sim.fallSpeed = sim.fallSpeed * 8;
    sim.rainGroup.n = sim.rainGroup.n * 3;
    return sim;
  }
}
