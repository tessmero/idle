/**
 *
 */
class BasicLineSkill extends Skill {
  /**
   *
   */
  constructor() {
    super('Basic Line');
  }

  /**
   *
   * @param w
   * @param h
   */
  buildThumbnailSim(w, h) {
    const sim = new ThumbnailPSim();

    // add stable poi in center
    const c = v(w / 2, h / 2);
    const d = v(0.1 * w, 0.1 * h);
    const a = c.add(d);
    const b = c.sub(d);
    const rad = 2e-3;
    const poi = new SausageBody(sim, a, b, rad);
    sim.addBody(poi);

    return sim;
  }
}
