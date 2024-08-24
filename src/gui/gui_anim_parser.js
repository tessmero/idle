/**
 * @file GuiAnimParser computes real-time values for
 * animation parameters defined with "@" in layout data
 */
class GuiAnimParser {

  /**
   * Called in gui_actor.js
   * Compute animation parameters at state between 0 and 1.
   * @param {object} data The object in data/gui-anims.
   * @param {number} state The animation state (t) in [0,1]
   */
  static computeLayoutParams(data, state) {
    return new GuiAnimParser()._computeLayoutParams(data, state);
  }

  /**
   * Called in gui_actor.js
   * Compute animation parameters at state between 0 and 1.
   * @param {object} data The object in data/gui-anims.
   * @param {number} state The animation state (t) in [0,1]
   */
  _computeLayoutParams(data, state) {
    const t = state;

    // check if t is outside of data
    if (t <= data[0].t) { return this._filter(data[0]); }
    const final = data.at(-1);
    if (t >= final.t) { return this._filter(final); }

    // iterate over animation segments
    for (let i = 1; i < data.length; i++) {
      const a = data[i - 1];
      const b = data[i];

      // check if this is the relevant segment
      if ((a.t <= t) && (b.t >= t)) {
        const r = (t - a.t) / (b.t - a.t);

        // return interpolated state
        return Object.fromEntries(
          Object.keys(a)
            .filter((param) => param !== 't')
            .map((param) =>
              [param, this._iVal(a[param], b[param], r)]
            )
        );
      }
    }

    // couldn't find matching segment
    return this._filter(data[0]);
  }

  /**
   * Filter out property 't'
   * @param {object} data
   */
  _filter(data) {
    return Object.fromEntries(Object.entries(data).filter(([key, _value]) => key !== 't'));
  }

  /**
   * Interpolate two values in anim data which may be numbers or arrays.
   * @param {number|number[]} a
   * @param {number|number[]} b
   * @param {number} r
   */
  _iVal(a, b, r) {
    if (typeof a === 'number') {
      return this._trunc(avg(a, b, r));
    }
    return a.map((aa, i) => this._trunc(avg(aa, b[i], r)));

  }

  /**
   *
   * @param {number} val
   */
  _trunc(val) {
    let v = val;
    if (v < 0) { v = 0; }
    if (v > 1) { v = 1; }
    return v;
  }
}
