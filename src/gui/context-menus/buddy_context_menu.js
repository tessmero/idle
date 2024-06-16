/**
 * @file BuddyContextMenu gui element
 * extended body context menu that also shows particles collected
 */
class BuddyContextMenu extends BodyContextMenu {

  #rowRects;
  #nextRowIndex = 0;

  /**
   *
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {number[]} s0 The first content square to align elements in.
   * @param {number[]} s1 The second content square to align elements in.
   * @param {Body} buddy The Buddy instance to highlight.
   */
  constructor(rect, s0, s1, buddy) {
    super(rect, s0, s1, buddy.getMainBody());
    this.buddy = buddy;

    // divide second content squares into rows
    this.#rowRects = divideRect(...s1, 4, true);

    // first row has exp level with progress overlay
    this.addBuddyContextRow((r) => [
      new StatReadout(r, collectedIcon, () =>
        buddy.expLevel.toString())
        .withDynamicTooltip(() => `Level ${buddy.expLevel}\n${buddy.expMechDesc}`)
        .withAutoAdjustRect(false),
      new ProgressIndicator(r, () => buddy.getLevelProgress()),
    ]);
  }

  /**
   * Used in constructor. Used in Buddy implementations' buildContextMenu.
   * @param {Function} elems The function that returns elements for one row.
   */
  addBuddyContextRow(elems) {

    const ri = this.#nextRowIndex;
    const rect = this.#rowRects[ri];
    elems(rect).forEach((e) => this.addChild(e));
    this.#nextRowIndex = ri + 1;
  }
}
