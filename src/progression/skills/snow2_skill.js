class Snow2Skill extends Skill {
  constructor() {
    super('Blizzard');
  }

  buildThumbnailSim() {
    const sim = new ThumbnailPSim();

    const rg = sim.rainGroup;
    rg.n = rg.n * 10;

    return sim;
  }
}
