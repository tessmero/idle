/**
 *
 */
class TabHeaderButton extends TextButton {

  // called in TabPaneGroup constructor
  /**
   *
   * @param parent
   * @param tabIndex
   * @param rect
   * @param label
   * @param action
   */
  constructor(parent, tabIndex, rect, label, action) {
    super(rect, label, action);

    this.parent = parent;
    this.tabIndex = tabIndex;
    this.debug = true;
  }

  /**
   *
   * @param g
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
  }
}
