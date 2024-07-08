/**
 * @file TabHeaderButton gui element
 * A button owned by a TabPaneGroup, used to switch tabs.
 */
class TabHeaderButton extends TextButton {

  /**
   * called in TabPaneGroup constructor
   * @param {GuiElement} parent The enclosing TabPaneGroup instance.
   * @param {number} tabIndex The index of this tab in the parent group.
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {string} label The tab title to display.
   * @param {Function} action The functon to be triggered when clicked.
   */
  constructor(parent, tabIndex, rect, label, action) {
    super(rect, label, action);

    this.parent = parent;
    this.tabIndex = tabIndex;
    this.debug = true;
  }

  /**
   * Override the standard button appearance to draw tab header.
   * @param {object} g The graphics context.
   */
  draw(g) {
    const rect = this.rect;
    let lineCol = global.colorScheme.fg;

    if (this.hovered) {
      lineCol = global.colorScheme.hl;
    }

    // g.fillStyle = global.colorScheme.bg
    g.strokeStyle = lineCol;
    g.clearRect(...rect);

    const selected = (this.parent.getSelectedTabIndex() === this.tabIndex);
    if (selected) {
      const [x, y, w, h] = rect;
      g.beginPath();
      g.moveTo(x, y + h);
      g.lineTo(x, y);
      g.lineTo(x + w, y);
      g.lineTo(x + w, y + h);
      g.stroke();
    }
    else {
      g.strokeRect(...rect);
    }

    drawText(g, ...rectCenter(...this.rect), this.label, this.center, new FontSpec(0, this.scale, false));

    if (global.debugUiRects) {

      // draw debug rectangle
      g.strokeStyle = 'red';
      g.lineWidth = global.lineWidth;
      g.strokeRect(...this.rect);
    }
  }
}
