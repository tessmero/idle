/**
 * @file BuddyContextMenu gui element
 * extended body context menu that also shows particles collected
 */
class BuddyContextMenu extends BodyContextMenu {
  /**
   *
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {number[]} s0 The first content square to align elements in.
   * @param {number[]} s1 The second content square to align elements in.
   * @param buddy
   */
  constructor(rect, s0, s1, buddy) {
    super(rect, s0, s1, buddy.getMainBody());
    this.buddy = buddy;

    // divide content squares into rows
    // const topRows = divideRect(...s0, 4, true);
    const botRows = divideRect(...s1, 4, true);

    this.setChildren(this.children.concat([

      new StatReadout(botRows[0], collectedIcon, () =>
        buddy.particlesCollected.toString())
        .withStyle('hud')
        .withDynamicTooltip(() => `${buddy.particlesCollected} rain drops collected`)
        .withAutoAdjustRect(true),
    ]));
  }
}
