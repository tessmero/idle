/**
 * @file Border default border style
 */
class Border {
  static default = new Border();

  /**
   * Helper to trace in graphics context.
   * @param {object} g The graphics context.
   * @param {number[]} rect The rectangle to align with.
   */
  path(g, rect) {
    g.beginPath();
    this.verts(rect).forEach((v) => g.lineTo(v.x, v.y));
    g.closePath();
  }

  /**
   * Helper to fill cutoffs in graphics context.
   * @param {object} g The graphics context.
   * @param {number[]} rect The rectangle to fill inside of.
   */
  fillCutoffs(g, rect) {
    const tris = this.cutoffs(rect);

    tris.forEach((triangle) => {
      g.beginPath();
      triangle.forEach((p) => g.lineTo(...p.xy()));
      g.closePath();
      g.fill();
    });
  }

  /**
   * trace the outline of this border.
   * @param {number[]} rect The rectangle to align with.
   * @returns {Vector[]} The vertices to loop over.
   */
  verts(rect) {
    return rectCorners(...rect);
  }

  /**
   * Get vertices enclosing regions within rect not enclosed by verts.
   * Used to trim progress indicator overlay.
   * @param {number[]} _rect The rectangle to align with.
   * @returns {Vector[][]} The lists of polygon vertices to fill in.
   */
  cutoffs(_rect) {
    // none, this encloses the whole rectangle with verts
    return [];
  }

  /**
   * Draw standard border rectangle.
   * @param {object} g The graphics context.
   * @param {number[]} rect The x,y,w,h of the rectangle.
   * @param {object} options
   * @param {boolean} options.hovered True if the user is hovering over the button.
   * @param {boolean} options.fill True if the interior of the button should be filled.
   * @param {object} options.border optional Border style instance.
   */
  static _draw(g, rect, options = {}) {
    let lineCol = global.colorScheme.fg;

    if (options.hovered) {
      lineCol = global.colorScheme.hl;
    }
    if (global.debugUiRects) {
      lineCol = 'red';
    }

    // g.fillStyle = global.colorScheme.bg

    const fill = options.hasOwnProperty('fill') ? options.fill : true;
    if (fill) {
      g.clearRect(...rect);
    }

    // g.strokeRect(...rect);
    const bord = (options.border ? options.border : Border.default);
    g.fillStyle = global.colorScheme.bg;
    bord.fillCutoffs(g, rect);
    g.fillStyle = global.colorScheme.fg;

    g.strokeStyle = lineCol;
    g.lineWidth = global.lineWidth;
    bord.path(g, rect);
    g.stroke();

    g.strokeStyle = global.colorScheme.fg;
  }
}
