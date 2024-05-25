// keep track of the color of certain points in graphics context
/**
 *
 */
class PointWatcherGW extends GraphicsWrapper {

  /**
   *
   * @param rect
   */
  constructor(rect) {
    super();

    this.resetPoints(rect);
  }

  // draw points for debugging
  /**
   *
   */
  drawDebug() {
    const g = this.g;
    g.fillStyle = global.colorScheme.hl;

    const wp = this.watchPositions;
    const n = wp.length;
    for (let i = 0; i < n; i ++) {
      const pos = wp[i];
      const filled = this.watchStates[i];
      const r = filled ? 0.008 : 0.005;
      const debugRect = [pos.x - r, pos.y - r, 2 * r, 2 * r];
      g.fillRect(...debugRect);
    }
    g.fillStyle = global.colorScheme.fg;
  }

  // arrange points in grid covering given rect
  /**
   *
   * @param rect
   */
  resetPoints(rect) {

    // arrange points in NxN grid
    const wp = [];
    const n = 9;
    for (let x = 0; x < n; x ++) {
      for (let y = 0; y < n; y ++) {
        const xpos = rect[0] + rect[2] * (x + 0.5) / n;
        const ypos = rect[1] + rect[3] * (y + 0.5) / n;
        wp.push(v(xpos, ypos));
      }
    }
    this.watchPositions = wp;
    this.watchStates = wp.map((_p) => false);
  }

  // get fraction of watch points
  // with foreground color
  /**
   *
   */
  getFgRate() {
    const s = this.watchStates;
    const total = s.length;
    const fg = s.filter(Boolean).length;
    return fg / total;
  }

  // replace some watchStates with given value
  /**
   *
   * @param value
   * @param {...any} rect
   */
  setStatesInRect(value, ...rect) {
    const wp = this.watchPositions;
    const n = wp.length;
    for (let i = 0; i < n; i ++) {
      if (vInRect(wp[i], ...rect)) {
        this.watchStates[i] = value;
      }
    }
  }

  /**
   *
   * @param {...any} rect
   */
  rectFilled(...rect) {
    this.setStatesInRect(true, ...rect);
  }

  /**
   *
   * @param {...any} rect
   */
  rectCleared(...rect) {
    this.setStatesInRect(false, ...rect);
  }
}
