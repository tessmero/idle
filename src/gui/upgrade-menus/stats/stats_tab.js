/**
 * @file StatsTab gui element.
 *
 * Contents for the "stats" tab in the upgrade menu.
 */
class StatsTab extends CompositeGuiElement {
  _layoutData = STATS_TAB_LAYOUT;

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    if (global.bonusSummary) {
      return global.bonusSummary.map((entry, i) => {
        const [icon, summary] = entry;
        return new StatReadout(
          this._layout.rows[i], icon, () => summary).withScale(0.4);
      });
    }
    return [];

  }
}
