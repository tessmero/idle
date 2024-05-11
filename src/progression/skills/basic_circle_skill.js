class BasicCircleSkill extends Skill {
  constructor() {
    super('Basic Circle');
  }

  buildThumbnailSim(w, h) {
    const sim = new ThumbnailPSim();

    // add stable poi in center
    const poi = new CircleBody(sim, v(w / 2, h / 2), 1e-2);
    sim.addBody(poi);

    return sim;
  }
}
