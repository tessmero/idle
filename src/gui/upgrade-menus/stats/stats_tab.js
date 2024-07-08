/**
 * @file StatsTab gui element.
 *
 * Contents for the "stats" tab in the upgrade menu.
 */
class StatsTab extends CompositeGuiElement {
  _layoutData = STATS_TAB_LAYOUT;

  /**
   *
   * @param {number[]} sr The rectangle to align elements in.
   * @param {GameScreen} screen The screen for icon scale for css layout (needs cleanup)
   */
  constructor(sr, screen) {
    super(sr);
    const layout = this.layoutRects(screen);

    // reassign or append to this.children
    if (global.bonusSummary) {
      global.bonusSummary.forEach((entry, i) => {
        const [icon, summary] = entry;
        this.addChild(new StatReadout(
          layout.rows[i], icon, () => summary).withScale(0.4));
      });
    }
  }
}
