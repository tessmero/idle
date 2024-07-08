/**
 * @file LayoutParser object that computes rectangles from css rules.
 */
class GuiLayoutParser {

  /**
   * Compute x,y,w,h rectangles from css rules.
   * @param {number[]} screenRect The overall bounding rectangle.
   * @param {?object} data reference to css in data folder.
   * @param {number} iconScale The scale factor for raw numeric distances.
   */
  static computeRects(screenRect, data, iconScale = 1) {
    const glp = new GuiLayoutParser(screenRect, data, iconScale);
    const rects = glp.#computedRects;
    return rects;
  }

  #computedRects = [];
  #xKeys = ['left', 'right', 'width'];
  #yKeys = ['top', 'bottom', 'height'];
  #parent = [0, 0, 1, 1];
  #iconScale;

  /**
   * Called in computeRects
   * @param {number[]} screenRect The overall bounding rectangle.
   * @param {?object} data The value in GUI_LAYOUTS
   * @param {number} iconScale The scale factor for raw numeric distances.
   */
  constructor(screenRect, data, iconScale) {
    this.#iconScale = iconScale;
    if (data) {
      for (const [key, cssRules] of Object.entries(data)) {
        this.#computedRects[key] = this._computeRect(screenRect, cssRules);
      }
    }
  }

  /**
   *
   * @param {number[]} screenRect
   * @param {object} cssRules
   */
  _computeRect(screenRect, cssRules) {

    // use screen rectangle as starting point
    // and default parent to align within
    this.#parent = screenRect;
    let result = screenRect;

    // modify rect once for each rule
    for (const [key, value] of Object.entries(cssRules)) {
      result = this._applyRule(result, key, value);
    }
    return result;
  }

  /**
   *
   * @param {number[]} r
   * @param {string} cssKey
   * @param {number|string} cssVal
   */
  _applyRule(r, cssKey, cssVal) {
    const p = this.#parent;

    // check for made up key
    if (cssKey === 'parent') {

      // use previously defined rectabgle
      // as parent rectangle to align within
      const newp = this.#computedRects[cssVal];

      if (!newp) {
        throw new Error(`parent css not defined: ${cssVal}`);
      }

      // set as parent and start alligning from parent
      this.#parent = newp;
      return newp;
    }

    // check for made up key
    if (cssKey === 'repeat') {
      const down = (cssVal === 'down');
      const [x, y, w, h] = r;
      const result = [];
      for (let i = 0; ; i++) {
        const ix = x + (down ? 0 : i * w);
        const iy = y + (down ? i * h : 0);
        if (down) {
          if ((iy + h) > (p[1] + p[3])) {
            return result;
          }
        }
        else if ((ix + w) > (p[0] + p[2])) {
          return result;
        }
        result.push([ix, iy, w, h]);
      }
    }

    // apply css layout rule, resulting in a new rectangle
    const d = this._parseDistanceVal(p, r, cssKey, cssVal);
    switch (cssKey) {
    case 'left':
      return [p[0] + d, r[1], r[2], r[3]];
    case 'right':
      return [p[0] + p[2] - r[2] - d, r[1], r[2], r[3]];
    case 'top':
      return [r[0], p[1] + d, r[2], r[3]];
    case 'bottom':
      return [r[0], p[1] + p[3] - r[3] - d, r[2], r[3]];
    case 'width':
      return [r[0], r[1], d, r[3]];
    case 'height':
      return [r[0], r[1], r[2], d];
    case 'margin':
      return padRect(...r, -d);
    default:
      return r;
    }
  }

  /**
   * Compute absolute distance represented by a css value.
   * @param  {number[]} p  The parent rectangle to align within.
   * @param {number[]} r The rectangle that to align.
   * @param  {string} cssKey The css key necessary to decide between
   *                         width and height when taking percentage.
   * @param  {number|string} cssVal The raw css distance value.
   */
  _parseDistanceVal(p, r, cssKey, cssVal) {

    if (typeof(cssVal) === 'string') {

      // pick whether width or height should be considered
      const ax = this.#xKeys.includes(cssKey) ? 0 : 1;

      if (cssVal === 'auto') {

        if ((cssKey === 'width') || (cssKey === 'height')) {
          // pick new side length to align with bottom or right of parent
          return p[ax] + p[ax + 2] - r[ax];
        }

        // assume key is 'top' or 'left'
        // pick distance to center inside parent
        return p[ax] + p[ax + 2] / 2 - r[ax + 2] / 2 - r[ax];
      }

      if (!cssVal.endsWith('%')) {
        throw new Error('css value must be number, percentage, or \'auto\'');
      }

      // compute percentage of parent width or height
      const mul = parseFloat(cssVal.slice(0, -1)) / 100;
      return p[ax + 2] * mul;
    }

    // not a string
    return cssVal * this.#iconScale;
  }
}
