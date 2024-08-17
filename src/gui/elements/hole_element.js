/**
 * @file HoleElement signals a request
 * for opaque ancestors to not draw over this rectangle
 * (composite_gui_element.js)
 */
class HoleElement extends GuiElement {

  /**
   * Override GuiElement. Draw this element's border as inner hole shape.
   * @param {object} g The graphics context.
   */
  draw(g) {
    const border = this.border;
    if (!border) { return; }

    const rect = this.rect;
    const outerCorners = rectCorners(...padRect(...rect, 0.001));
    const verts = border.verts(rect);

    // invert border
    // trace bounding rect then border shape to fill between them
    const innerShape = verts;
    const inverts = [

      // trace outer rectangle counter-clockwise
      outerCorners[0], ...outerCorners.reverse(),

      // trace animated inner shape clockwise
      ...innerShape, innerShape[0],

    ];

    g.globalCompositeOperation = 'destination-out';
    border.path(g, inverts);
    g.fill();
    g.globalCompositeOperation = 'source-over';

    g.fillStyle = global.colorScheme.mid;
    border.fillDecorations(g, rect, verts);
    g.fillStyle = global.colorScheme.fg;
  }
}
