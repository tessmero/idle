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
    const bsum = global.bonusSummary;
    if (!bsum) { return []; }

    return bsum.map((sumEntry, i) =>
      new GuiElement(this._layout.rows[i], {
        icon: sumEntry[0],
        labelFunc: () => sumEntry[1],
        scale: 0.4,
        textAlign: 'left',
      })
    );
  }
}
