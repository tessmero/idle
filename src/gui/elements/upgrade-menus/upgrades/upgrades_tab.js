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

    const rows = this._layout.rows;
    const useThickLayout = rows[0][2] < 0.9;

    const specs = global.upgradeTracks.state;
    const upgraders = Object.entries(specs).map(([_key, gutse], i) => {
      const rowIndex = useThickLayout ? 2 * i : i;
      let rect = rows[rowIndex];
      if (useThickLayout) {
        rect = [rect[0], rect[1], rect[2], 2 * rect[3]];
      }
      return new StatUpgrader(rect, {
        useThickLayout,
        gutse,
        tooltipFunc: () => {
          const ttpr = UpgradeTooltip.pickRect(this.screen);
          return new UpgradeTooltip(ttpr, { gutse });
        },
      });
    });
    return upgraders;
  }

}
