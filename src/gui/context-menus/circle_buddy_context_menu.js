/**
 * @file CircleBuddyContextMenu gui element.
 * buddy context menu with satiety display.
 */
class CircleBuddyContextMenu extends BuddyContextMenu {

  /**
   * Extend buddy context menu by adding a satiety indicator.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const result = super._buildElements();
    this.addBuddyContextRow(result, (r, s) => this._buddy.buildSatietyGuiElems(r, s));
    return result;
  }
}
