/**
 * @file GuiAnimParser computes real-time values for
 * animation parameters defined with at symbols
 * in layout data
 */
class GuiAnimParser {

  /**
   * Called in gui_actor.js
   * Compute animation parameters at state between 0 and 1.
   * @param {object} data The object in data/gui-anims.
   * @param {number} state The animation state (t) in [0,1]
   */
  static computeLayoutParams(data, state) {
    const t = state;

    // check if t is outside of data
    if (t <= data[0].t) { return data[0]; }
    const final = data.at(-1);
    if (t >= final.t) { return final; }

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
              [param, avg(a[param], b[param], r)]
            )
        );
      }
    }

    // couldn't find matching segment
    return data[0];
  }
}
