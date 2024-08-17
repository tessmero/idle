/**
 * @file TabHeaderButton gui element
 * A button owned by a TabPaneGroup, used to switch tabs.
 */
class TabHeaderButton extends TextButton {

  /**
   * called in TabPaneGroup constructor
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {object} params The parameters.
   * @param {object} params.parent The enclosing TabPaneGroup instance.
   * @param {number} params.tabIndex The index of this tab in the parent group.
   * @param {string} params.label The text to display.
   * @param {Function} params.action The function to call when clicked.
   */
  constructor(rect, params = {}) {
    super(rect, {
      tooltipScale: 0.4,
      border: new OctBorder(),
      ...params,
    });

    const { parent, tabIndex } = params;

    this.parent = parent;
    this.tabIndex = tabIndex;
  }
}
