/**
 * @file LayoutParser object that computes rectangles from css rules.
 */
class GuiLayoutParser {
  #maxRepeat = 20;

  /**
   * Get a list of unique '@' param names used in the data object.
   * Used in LayoutContextMenu.
   * @param {?object} data The css data object in data folder.
   */
  static listAnimParams(data) {
    const glp = new GuiLayoutParser([0, 0, 1, 1], data, 1);
    return [...glp.#animParamsInData];
  }

  /**
   * Compute x,y,w,h rectangles from css rules.
   * @param {number[]} screenRect The overall bounding rectangle.
   * @param {?object} data reference to css in data folder.
   * @param {number} iconScale The scale factor for raw numeric distances.
   * @param {object} animParams the animation state which may have one non-extreme
   */
  static computeRects(screenRect, data, iconScale = 1, animParams = {}) {

    // check if a param calls for interpolation
    const interp = Object.entries(animParams).find(
      ([_prm, val]) => ((typeof(val) === 'number') ? (val > 0) && (val < 1) :
        (val.some((vv) => (vv > 0) && (vv < 1))))
    );

    if (interp) {
      const [iParam, iVal] = interp;

      // compute extremes versions of layout
      const ext = {};
      for (const si of [0, 1]) {
        ext[si] = GuiLayoutParser._computeRects(
          screenRect, data, iconScale, {
            ...animParams,
            [iParam]: si,
          });
      }

      // return interpolated layout
      return GuiLayoutParser._iLayouts(ext[0], ext[1], iVal);
    }

    // no interpolation needed
    return GuiLayoutParser._computeRects(
      screenRect, data, iconScale, animParams);
  }

  /**
   * interpolate two layouts
   * @param {number[]} l0 The layout at extreme position 0.
   * @param {number[]} l1 The layout at extreme position 1.
   * @param {number|number[]} side The animation state (or states) in range [0,1]
   */
  static _iLayouts(l0, l1, side) {
    const result = {};
    Object.keys(l0).forEach((param) => {
      const r0 = l0[param];
      const r1 = l1[param];
      if (typeof r0[0] === 'number') {
        // single rectangle
        result[param] = GuiLayoutParser._iRects(r0, r1, side);
      }
      else {
        // list of rectangles
        const n = Math.min(r0.length, r1.length);
        const slist = (typeof side === 'number') ? Array(n).fill(side) : side;
        const ilist = [];
        for (let i = 0; i < n; i++) {
          ilist.push(GuiLayoutParser._iRects(r0[i], r1[i], slist[i]));
        }
        result[param] = GuiLayoutParser._safeRepeat(ilist);
      }

    });
    return result;
  }

  /**
   * interpolate two rectangles
   * @param {number[]} r0 The bounds at extreme position 0.
   * @param {number[]} r1 The bounds at extreme position 1.
   * @param {number} side The animation state in range [0,1]
   */
  static _iRects(r0, r1, side) {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result[i] = avg(r0[i], r1[i], side);
    }
    return result;
  }

  /**
   * Compute x,y,w,h rectangles from css rules.
   * @param {number[]} screenRect The overall bounding rectangle.
   * @param {?object} data reference to css in data folder.
   * @param {number} iconScale The scale factor for raw numeric distances.
   * @param {object} animParams Assumed to be at extremes
   */
  static _computeRects(screenRect, data, iconScale = 1, animParams = {}) {
    const glp = new GuiLayoutParser(screenRect, data, iconScale, animParams);
    return glp.#computedRects;
  }

  /**
   * Wrap a list of rectangles so if an index >= n is accessed,
   * it returns the last available rectangle.
   * @param {number[][]} rlist The list of rectangles.
   */
  static _safeRepeat(rlist) {
    return new Proxy({}, {
      get(_target, prop) {
        if (typeof prop === 'symbol') {
          // being unpacked like [a,b,c] = myProxy
          return rlist[prop];
        }
        const index = Number(prop);
        if (!isNaN(index) && (index >= rlist.length)) {
          return rlist[rlist.length - 1];
        }
        return rlist[prop];
      },
    });
  }

  // to decide which axis is relevant
  // when computing % of parent length
  #xKeys = ['left', 'right', 'width', 'max-width'];
  #yKeys = ['top', 'bottom', 'height', 'max-height'];

  // screen scale factor set in constructor
  #iconScale;

  // current animation state set in constructor
  #currentAnim;

  // animation parameter names encountered during parsing
  #animParamsInData = new Set();

  // current parent rectangle set during parsing
  #parent;

  // final parsed absolute rectangles
  #computedRects = [];

  /**
   * Called in computeRects
   * @param {number[]} screenRect The overall bounding rectangle.
   * @param {?object} data The value in GUI_LAYOUTS
   * @param {number} iconScale The scale factor for raw numeric distances.
   * @param {object} animParams
   */
  constructor(screenRect, data, iconScale, animParams = {}) {
    this.#iconScale = iconScale;
    this.#currentAnim = animParams;

    if (data) {

      // check for extra layer with @params keys
      let currentData = data;
      for (const [rawKey, newDataName] of Object.entries(data)) {

        // @param by itself points to layout object
        const { key, params } = this._parseKey(rawKey);
        if (key === '') {
          if (this._shouldParse(params)) {

            // set layout data source
            currentData = window[newDataName];
          }
        }
      }

      // start parsing
      // iterate over rulesets
      for (const [rawKey, cssRules] of Object.entries(currentData)) {

        // check for @ parameter
        const { key: rulesetKey, params: rulesetParams } = this._parseKey(rawKey);

        if (this._shouldParse(rulesetParams)) {

          // parse ruleset
          let computed = this._computeRect(screenRect, cssRules);

          //
          if (typeof computed[0] !== 'number') {

            // result is list of rectangles
            // wrap it to safely access any index
            computed = GuiLayoutParser._safeRepeat(computed);
          }

          this.#computedRects[rulesetKey] = computed;
        }
      }
    }
  }

  /**
   * @param  {object} keyParams The parsed @ parameter content
   */
  _shouldParse(keyParams) {
    for (const [name, value] of Object.entries(keyParams)) {
      let current = this.#currentAnim[name];
      if (Array.isArray(current)) { current = current[0]; }
      if (current <= 0 && value >= 1) { return false; }
      if (current >= 1 && value <= 0) { return false; }
    }
    return true;
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

    // iterate over rules
    for (const [rawKey, value] of Object.entries(cssRules)) {

      // check for @ params
      const { key: ruleKey, params: ruleParams } = this._parseKey(rawKey);
      if (this._shouldParse(ruleParams)) {

        // modify rectangle
        result = this._applyRule(result, ruleKey, value);
      }
    }

    // return final rectangle
    return result;
  }

  /**
   * Parse ruleset or rule key which may have @anim=0 or @anim=1
   * @param  {string} rawKey The raw key from layout data
   * @returns {object}     The parsed key,params={}
   */
  _parseKey(rawKey) {
    const [key, paramsString] = rawKey.split('@');

    const params = {};
    if (paramsString) {
      const paramPairs = paramsString.split('&');
      paramPairs.forEach((pair) => {
        const [paramKey, paramValue] = pair.split('=');
        params[paramKey] = parseInt(paramValue);

        //
        this.#animParamsInData.add(paramKey);
      });
    }

    if (Object.keys(params).length > 1) {
      throw new Error('layout parser only supports one @param per key');
    }

    return { key, params };
  }

  /**
   * Get integer in square brackets if present.
   * @param {string} str The raw css value.
   */
  _parseIndexFromString(str) {
    const match = str.match(/\[(\d+)\]/);
    if (match) {
      const name = str.split('[')[0];
      const index = parseInt(match[1]);
      return [name, index];
    }
    return null;
  }

  /**
   *
   * @param {number[]} rect
   * @param {string} cssKey
   * @param {number|string} cssVal
   */
  _applyRule(rect, cssKey, cssVal) {
    const p = this.#parent;

    // check for made up key
    if (cssKey === 'parent') { // refe

      // lookup previously defined rectangle
      const pi = this._parseIndexFromString(cssVal);
      const cr = this.#computedRects;
      let newp;
      if (pi) {
        const [parent, index] = pi;
        newp = cr[parent][index];
      }
      else {
        newp = cr[cssVal];
      }

      if (!newp) {
        throw new Error(`parent css not defined: ${cssVal}`);
      }

      // set as parent and start aligning from parent
      this.#parent = newp;
      return newp;
    }

    // check for made up key
    if (cssKey === 'repeat') {

      // parse value up/down/auto
      const down = (cssVal === 'down') || ((cssVal === 'auto') && (p[3] > p[2]));

      // return array of rectangles
      const [x, y, w, h] = rect;
      const result = [];
      for (let i = 0; i < this.#maxRepeat; i++) {
        const ix = x + (down ? 0 : i * w);
        const iy = y + (down ? i * h : 0);
        if (down) {
          if ((iy + h) > (0.001 + p[1] + p[3])) {
            return result;
          }
        }
        else if ((ix + w) > (0.001 + p[0] + p[2])) {
          return result;
        }
        result.push([ix, iy, w, h]);
      }
      return result;
    }

    // apply css layout rule, resulting in a new rectangle
    const single = (typeof rect[0] === 'number');
    const rlist = (single ? [rect] : rect);
    const d = this._parseDistanceVal(p, rlist[0], cssKey, cssVal);
    const nlist = rlist.map((r) => {
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
      case 'max-width':
        return [r[0], r[1], Math.min(d, r[2]), r[3]];
      case 'height':
        return [r[0], r[1], r[2], d];
      case 'max-height':
        return [r[0], r[1], r[2], Math.min(d, r[3])];
      case 'margin':
        return padRect(...r, -d);
      default:
        return r;
      }
    });
    return single ? nlist[0] : nlist;
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
        return p[ax + 2] / 2 - r[ax + 2] / 2;

      }

      if (cssVal.startsWith('gold-')) {

        // pick new side length to form golden rectangle
        const long = (cssVal === 'gold-lax');
        return r[3 - ax] * (long ? 2 / phi : phi / 2);
      }

      if (!cssVal.endsWith('%')) {
        throw new Error('css value must be number, percentage, \'auto\', \'gold-sax\', or \'gold-lax\'');
      }

      // compute percentage of parent width or height
      const mul = parseFloat(cssVal.slice(0, -1)) / 100;
      return p[ax + 2] * mul;
    }

    // not a string
    return cssVal * this.#iconScale;
  }
}
