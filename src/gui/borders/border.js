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
   * @param {number[]} rect The rectangle to align with.
   */
  path(g, rect) {
    g.beginPath();
    this.verts(rect).forEach((v) => g.lineTo(v.x + this.offsetX, v.y + this.offsetY));
    g.closePath();
  }

  /**
   * Helper to stroke outer rectangle and fill cut-off regions.
   * Used to trim indicators and simulations.
   * @param {object} g The graphics context.
   * @param {number[]} rect The rectangle to clean up.
   */
  cleanup(g, rect) {
    const corners = rectCorners(...rect);

    // trace rectangle with thick line
    g.strokeRect(...rect);

    // compute cutoffs shape
    const verts = this.verts(rect);
    const cutoff = [

      // trace inner shape clockwise
      ...verts, verts[0],

      // trace outer rectangle counter-clockwise
      corners[0], ...corners.reverse(),

    ];

    // fill cutoffs
    g.beginPath();
    cutoff.forEach((v) => g.lineTo(v.x, v.y));
    g.closePath();
    g.fill();
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
    let lineCol = global.colorScheme.fg;

    if (options.hovered) {
      lineCol = global.colorScheme.hl;
    }
    if (global.debugUiRects) {
      lineCol = 'red';
    }
    const bord = (options.border ? options.border : new DefaultBorder());

    const fill = options.hasOwnProperty('fill') ? options.fill : true;
    if (fill) {
      if (bord instanceof DefaultBorder) {
        g.clearRect(...rect);
      }
      else {
        g.fillStyle = global.colorScheme.bg;
        bord.path(g, rect);
        g.fill();
      }
    }

    // g.strokeRect(...rect);

    g.strokeStyle = lineCol;
    g.lineWidth = global.lineWidth;
    bord.path(g, rect);
    g.stroke();

    g.strokeStyle = global.colorScheme.fg;
  }
}
