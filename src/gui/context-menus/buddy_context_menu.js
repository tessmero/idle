/**
 * @file BuddyContextMenu gui element
 * extended body context menu that also has buddy title and exp level.
 */
class BuddyContextMenu extends BodyContextMenu {

  // fot size
  #scale = 0.3;

  _buddy;
  #nextRowIndex = 0;

  /**
   *
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {Body} buddy The Buddy instance to highlight.
   */
  constructor(rect, buddy) {
    super(rect, buddy.getMainBody()); // draw reticle on main subbody
    this._buddy = buddy;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const result = super._buildElements();
    const buddy = this._buddy;

    // first row has exp level with progress overlay
    this.addBuddyContextRow(result, (r, s) => {
      const padLeft = 0;// r[2]/100
      const padr = [r[0] + padLeft, r[1], r[2] - padLeft, r[3]];
      return [
        new StatReadout(padr, buddy.expMechIcon, () => `LEVEL ${buddy.expLevel}`)
          .withDynamicTooltip(() => this._getExpLevelTooltip())
          .withScale(s)
          .withCenter(true),
        new ProgressIndicator(r, () => buddy.getLevelProgress()),
      ];
    });

    return result;
  }

  /**
   * @returns {string} The tooltip text for exp progress indicator.
   */
  _getExpLevelTooltip() {
    const b = this._buddy;
    return [
      `Level ${b.expLevel} ${b.expMechLabel}`,
      `${b.describeCurrentExpLevel()}`,
    ].join('\n');
  }

  /**
   * Allocate a new row and construct new elements in it.
   * @param {GuiElement[]} appendTo The list of elements to append to.
   * @param {Function} elems The function that returns elements for one row.
   */
  addBuddyContextRow(appendTo, elems) {

    // pick rectangle for new row
    const ri = this.#nextRowIndex;
    const rect = this._layout.rows[ri];
    this.#nextRowIndex = ri + 1;

    // align new elements in rectangle
    const newElems = elems(rect, this.#scale);
    newElems.forEach((e) => appendTo.push(e));
  }
}
