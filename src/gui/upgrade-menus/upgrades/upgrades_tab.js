/**
 * @file UpgradesTab gui element
 *
 * Contents for the "upgrades" tab in the upgrades menu.
 */
class UpgradesTab extends CompositeGuiElement {

  /**
   *
   * @param sr
   */
  constructor(sr) {
    super(sr);

    // let sc = global.screenCorners
    // let sr = global.screenRect
    const m = 0.05;
    const w = sr[2] - 2 * m;
    const h = 0.05;
    let r0 = [sr[0] + m, sr[1] + m * 2, w, h];

    if (!global.upgradeTracks) { return; }
    const specs = global.upgradeTracks.state;
    const upgraders = Object.keys(specs).map((key) => {
      const agvRect = r0;
      r0 = [...r0];
      r0[1] = r0[1] + r0[3];
      return new StatUpgrader(agvRect, key);
    });
    this.setChildren(upgraders);
  }
}
