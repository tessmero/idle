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
    let r0 = [...layout.row];
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
