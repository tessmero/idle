/**
 * @file Border base class for gui border style/shape
 */
class Border {
  offsetX = 0;
  offsetY = 0;

  /**
   * trace the outline of this border clockwise from top-left corner.
   * @param {number[]} _rect The rectangle to align in.
   * @returns {Vector[]} The vertices to loop over.
   * @abstract
   */
  _verts(_rect) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * trace additional shapes to draw on top of border.
   * @param {number[]} _rect The rectangle to align in.
   * @param {Vector[]} _verts The computed border shape.
   * @returns {Vector[][]} The vertices to loop over.
   */
  _decorations(_rect, _verts) {
    return [];
  }

  /**
   * Helper to get current animation frame from verts
   * @param {number[]} rect The rectangle to align in.
   * @returns {Vector[]} The vertices to loop over.
   */
  verts(rect) {
    const verts = this._verts(rect);

    if (verts[0] instanceof Vector) {

      // not animated
      return verts;
    }

    // return current animation frame
    const frameDur = 20;
    const i = Math.floor(global.t / frameDur) % verts.length;
    return verts[i];
  }

  /**
   * Helper to trace in graphics context.
   * @param {object} g The graphics context.
   * @param {Vector[]} verts The computed border shape.
   */
  path(g, verts) {
    g.beginPath();
    verts.forEach((v) => g.lineTo(v.x + this.offsetX, v.y + this.offsetY));
    g.closePath();
  }

  /**
   * Helper to draw decorations
   * @param {object} g The graphics context.
   * @param {number[]} rect The rectangle to align with.
   * @param {Vector[]} verts The computed border shape.
   */
  fillDecorations(g, rect, verts) {
    this._decorations(rect, verts).forEach((decVerts) => {
      g.beginPath();
      decVerts.forEach((v) => g.lineTo(v.x + this.offsetX, v.y + this.offsetY));
      g.closePath();
      g.fill();
    });
  }

  /**
   * Helper to stroke outer rectangle and fill cut-off regions.
   * Used to trim indicators and simulations.
   * @param {object} g The graphics context.
   * @param {number[]} rect The rectangle to clean up.
   */
  cleanup(g, rect) {
    const corners = rectCorners(...rect);

    // compute cutoffs shape
    const verts = this.verts(rect);
    const cutoff = [

      // trace inner shape clockwise
      ...verts, verts[0],

      // trace outer rectangle counter-clockwise
      corners[0], ...corners.reverse(),

    ];

    g.globalCompositeOperation = 'destination-out';

    // trace rectangle with thick line
    g.strokeRect(...rect);

    // fill cutoffs
    g.beginPath();
    cutoff.forEach((v) => g.lineTo(v.x, v.y));
    g.closePath();
    g.fill();

    g.globalCompositeOperation = 'source-over';
  }

  /**
   * Draw standard border rectangle or styled border.
   * @param {object} g The graphics context.
   * @param {number[]} rect The x,y,w,h of the rectangle.
   * @param {object} options
   * @param {boolean} options.hovered True if the user is hovering over the button.
   * @param {boolean} options.fill True if the interior of the button should be filled.
   * @param {object} options.border optional Border style instance.
   */
  static draw(g, rect, options = {}) {

    const {
      border = new DefaultBorder(),
      fill = true,
      hovered,
    } = options;

    let lineCol = global.colorScheme.fg;

    if (hovered) {
      lineCol = global.colorScheme.hl;
    }
    if (global.debugUiRects) {
      lineCol = 'red';
    }

    const verts = border.verts(rect);

    // clear interior if necessary
    if (fill) {
      g.globalCompositeOperation = 'destination-out';
      border.path(g, verts);
      g.fill();
      g.globalCompositeOperation = 'source-over';
    }

    // draw optional decorations in gray
    g.fillStyle = global.colorScheme.mid;
    border.fillDecorations(g, rect, verts);
    g.fillStyle = global.colorScheme.fg;

    // trace border
    g.strokeStyle = lineCol;
    g.lineWidth = global.lineWidth;
    border.path(g, verts);
    g.stroke();
    g.strokeStyle = global.colorScheme.fg;
  }
}
