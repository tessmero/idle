/**
 * @file UpgradesTab gui element
 *
 * Contents for the "upgrades" tab in the upgrades menu.
 */
class UpgradesTab extends CompositeGuiElement {
  _layoutData = UPGRADES_TAB_LAYOUT;

  /**
   *
   * @param {number[]} sr The rectange to align elements in.
   * @param {GameScreen} screen The screen for icon scale for css layout (needs cleanup)
   */
  constructor(sr, screen) {
    super(sr);
    const layout = this.layoutRects(screen);
    if (!global.upgradeTracks) { return; }
    const specs = global.upgradeTracks.state;
    const upgraders = Object.keys(specs).map((key, i) => new StatUpgrader(layout.rows[i], screen, key));

    this.setChildren(upgraders);
  }
}
