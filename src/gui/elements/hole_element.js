/**
 * @file HoleElement signals a request
 * to show rectangle through opaque ancestors
 * (composite_gui_element.js)
 */
class HoleElement extends GuiElement {

  /**
   * Override GuiElement. Draw this element's border as inner hole shape.
   * @param {object} g The graphics context.
   */
  draw(g) {
    const rect = this.rect;
    const border = this.border;
    const verts = border.verts(rect);

    g.globalCompositeOperation = 'destination-out';
    border.path(g, verts);
    g.fill();
    g.globalCompositeOperation = 'source-over';

    g.fillStyle = global.colorScheme.mid;
    border.fillDecorations(g, rect, verts);
    g.fillStyle = global.colorScheme.fg;
  }
}
