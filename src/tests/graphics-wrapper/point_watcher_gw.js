/**
 * @file limited jscanvas graphics wrapper for tests
 * keep track of the color of certain points on screen.
 */
class PointWatcherGW extends GraphicsWrapper {

  #watchPositions;
  #watchStates;

  /**
   *
   * @param {number[]} rect The rectangle to position watch points in.
   * @param {number} nx
   * @param {number} ny
   */
  constructor(rect, nx, ny) {
    super();
    this._resetPoints(rect, nx, ny);
  }

  /**
   *  draw points for debugging
   */
  drawDebug() {
    super.drawDebug();
    const g = this._g;
    g.fillStyle = global.colorScheme.hl;

    // pick square size based on dist between first two points
    const wp = this.#watchPositions;
    const baseRad = 0.1 * wp[0].sub(wp[1]).getMagnitude();
    const filledRad = Math.max(0.001, 2 * baseRad);

    // draw square at each point
    const n = wp.length;
    for (let i = 0; i < n; i ++) {
      const pos = wp[i];
      const filled = this.#watchStates[i];
      const r = filled ? filledRad : baseRad;
      const debugRect = [pos.x - r, pos.y - r, 2 * r, 2 * r];
      g.fillRect(...debugRect);
    }
    g.fillStyle = global.colorScheme.fg;
  }

  /**
   * Set #watchPositions and #watchStates
   * @param {number[]} rect The rectangle to position watch points in.
   * @param {number} nx
   * @param {number} ny
   */
  _resetPoints(rect, nx, ny) {

    // arrange points in NxN grid
    const wp = [];
    for (let x = 0; x < nx; x ++) {
      for (let y = 0; y < ny; y ++) {
        const xpos = rect[0] + rect[2] * (x + 0.5) / nx;
        const ypos = rect[1] + rect[3] * (y + 0.5) / ny;
        wp.push(v(xpos, ypos));
      }
    }
    this.#watchPositions = wp;
    this.#watchStates = wp.map((_p) => false);
  }

  /**
   * get fraction of watch points
   * with foreground color
   */
  getFgRate() {
    const s = this.#watchStates;
    const total = s.length;
    const fg = s.filter(Boolean).length;
    return fg / total;
  }

  /**
   * Update watch states in the given rectangle.
   * @param {boolean} value The new filled/unfilled state to apply.
   * @param {number[]} rect The rectangle where states will be updated.
   */
  _setStatesInRect(value, rect) {
    const wp = this.#watchPositions;
    const n = wp.length;
    for (let i = 0; i < n; i ++) {
      if (vInRect(wp[i], ...rect)) {
        this.#watchStates[i] = value;
      }
    }
  }

  /**
   * Set watch states to reflect the given rectangle being filled.
   * @param {number[]} rect The rectangle where states will be updated.
   */
  rectFilled(rect) {
    this._setStatesInRect(true, rect);
  }

  /**
   * Set watch states to reflect the given rectangle being cleared.
   * @param {number[]} rect The rectangle where states will be updated.
   */
  rectCleared(rect) {
    this._setStatesInRect(false, rect);
  }
}
