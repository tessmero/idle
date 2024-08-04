/**
 * @file UpgradesTab gui element
 *
 * Contents for the "upgrades" tab in the upgrades menu.
 */
class UpgradesTab extends CompositeGuiElement {
  _layoutData = UPGRADES_TAB_LAYOUT;

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    if (!global.upgradeTracks) { return []; }
    const specs = global.upgradeTracks.state;
    const rows = this._layout.rows;
    const upgraders = Object.keys(specs).map((key, i) =>
      new StatUpgrader(rows[i], {
        gutse: specs[key],
        tooltipFunc: () => {
          const ttpr = UpgradeTooltip.pickRect(this.screen);
          return new UpgradeTooltip(ttpr, key);
        },
      })
    );
    return upgraders;
  }

}
