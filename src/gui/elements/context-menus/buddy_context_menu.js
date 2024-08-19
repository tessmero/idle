/**
 * @file BuddyContextMenu gui element
 * extended body context menu that also has buddy title and exp level.
 */
class BuddyContextMenu extends BodyContextMenu {
  _layoutData = BUDDY_CONTEXT_MENU_LAYOUT;

  // fot size
  #scale = 0.3;

  _buddy;
  #nextRowIndex = 0;

  /**
   *
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {object} params The parameters.
   * @param {Body} params.buddy The Buddy instance to highlight.
   */
  constructor(rect, params = {}) {
    super(rect, {
      body: params.buddy.getMainBody(), // draw reticle on main subbody
      ...params,
    });
    const { buddy } = params;
    this._buddy = buddy;
  }

  /**
   * Pick categorical title to show in small font at top of context menu.
   */
  _miniTitle() {
    const b = this._buddy;
    return `lvl ${b.expLevel}`;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const result = super._buildElements();
    const buddy = this._buddy;

    // first row has exp level with progress overlay
    this.#nextRowIndex = 0;
    this.addBuddyContextRow(result, (rect, scale) => [
      new GuiElement(rect, {
        icon: buddy.expMechIcon,
        labelFunc: () => `LEVEL ${buddy.expLevel}`,
        tooltipFunc: () => this._getExpLevelTooltip(),
        scale,
        textAlign: 'center',
      }),
      new ProgressIndicator(rect, {
        valueFunc: () => buddy.getLevelProgress(),
      }),
    ]);

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
