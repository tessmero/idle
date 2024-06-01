/**
 * @file FloaterGroup object type.
 *
 * Floaters are small text labels
 * that float upwards and dissolve.
 *
 * All the floaters in a group are on the same screen
 * and the same layer in the drawing process
 */
class FloaterGroup {

  // rng for dissolving effect
  #rngSeed = randomSeed();

  // lifetime for a single floater
  #duration = 1000;

  // looping index of next floater to spawn
  #spawnIndex = 0;

  // number of active floaters
  // set at end of this.draw
  #activeCount = 0;

  // system time of last draw
  // to compute elapsed time for animation
  #lastT;

  #n;
  #ndims;
  #state;
  #labels;
  #fontSpecs;

  /**
   * Allocate a new group with up to
   * n floaters visible at one time.
   * @param {number} n the desired maximum number of floaters.
   */
  constructor(n) {
    this.#n = n;

    // prepare to keep track of up to
    // n floaters with 3 props (x,y,remaining time)
    const ndims = 3;
    this.#ndims = ndims;
    this.#state = new FloatArray(n * ndims).get();

    // prepare to keep track of up to
    // n label strings
    this.#labels = new Array(n).fill('');

    const letterPixelPad = 0.002;
    const scale = 0.3;
    this.#fontSpecs = [
      new DissolvingFontSpec(letterPixelPad, scale, true),
      new DissolvingFontSpec(0, scale, false),
    ];
  }

  /**
   * Get number of active floaters.
   * @returns {number} The active floater count.
   */
  get activeCount() {
    return this.#activeCount;
  }

  /**
   * Display a new floater.
   * @param {Vector} pos The position for the new floater.
   * @param {string} label The text content of the new floater.
   */
  spawnFloater(pos, label) {

    // pick address and advance for next call
    const si = this.#spawnIndex;
    this.#spawnIndex = (si + 1) % this.#n;

    // spawn new floater
    this.#labels[si] = label;
    const st = this.#state;
    const i = si * this.#ndims;
    st[i + 0] = pos.x;
    st[i + 1] = pos.y;
    st[i + 2] = this.#duration;
  }

  /**
   * Helper to display a floater indicating
   * a gain or loss in player money.
   * @param {Vector} pos The position for the new floater.
   * @param {number} amt The signed value to display.
   */
  signalChange(pos, amt) {
    if (!amt) { return; }
    let label = Math.round(amt).toString();
    if (amt > 0) { label = (`+${label}`); }
    this.spawnFloater(pos, label);
  }

  /**
   * Draw all the active floaters in this group.
   * @param {object} g The graphics context.
   */
  draw(g) {

    // comput ellapsed time
    // since last draw
    const t = global.t;
    let t0 = this.#lastT;
    if (!t0) { t0 = t; }
    const dt = t - t0;
    this.#lastT = t;

    //
    let activeCount = 0;
    const center = true;
    const st = this.#state;
    let seed = [...this.#rngSeed];
    for (let i = 0; i < this.#n; i++) {

      // advance distinct rng for each floater
      seed = seed.map((v) => v + 1);
      resetRand(seed);

      // lookup state for one floater
      const j = i * this.#ndims;
      const remainingTime = st[j + 2];
      if (remainingTime > 0) {
        activeCount = activeCount + 1;
        const label = this.#labels[i];
        const x = st[j + 0];
        const y = st[j + 1];

        // advance one floater
        st[j + 1] = y - 1e-4 * dt; // move up
        st[j + 2] = remainingTime - dt; // dissolve

        // draw one floater
        const r = (remainingTime / this.#duration);
        const dissolveStart = 0.5;
        let sld = (r + dissolveStart);
        if (sld < 1) { sld = sld * (1 - dissolveStart); }
        this.#fontSpecs.forEach((fs) => {
          fs.solidity = sld;
          drawText(g, x, y, label, center, fs);
        });
      }
    }

    this.#activeCount = activeCount;
  }
}
