/**
 * @file StatsTab gui element.
 *
 * Contents for the "stats" tab in the upgrade menu.
 */
class StatsTab extends CompositeGuiElement {
  /**
   *
   * @param {number[]} sr The rectangle to align elements in.
   */
  constructor(sr) {
    super(sr);

    let r = padRect(...sr, -0.05);

    // reassign or append to this.children
    if (global.bonusSummary) {
      const dy = 0.15;
      r = [r[0], r[1], r[2], dy];
      global.bonusSummary.forEach((entry) => {
        const [icon, summary] = entry;
        this.addChild(new StatReadout(
          [...r], icon, () => summary).withScale(0.4));
        r[1] = r[1] + dy;
      });
    }
  }
}
