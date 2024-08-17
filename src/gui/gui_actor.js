/**
 * @file GuiActor object moves gui elements
 * - tracks time, maintains anim state (0-1) and target state
 * - returns one updated layout param
 * - ...or multiple following script in data/gui-anims
 */
class GuiActor {
  #param; // name of single parameter to adjust
  #data; // ...or object in data/gui-anims

  // last update time
  #t;

  // between 0 and 1
  #state = 0;

  // 0 or 1
  #target = 0;

  // fraction of animation script per millisecond
  #speed;

  /**
   * @param {object} params.data The object in data/gui-anims
   * @param {object} params The parameters.
   */
  constructor(params = {}) {
    const {
      data,
      param,
      speed = 1e-5,
    } = params;

    this.#param = param;
    this.#data = data;
    this.#speed = speed;
    this.#t = global.t;
  }

  /**
   *
   * @param {s} s The new state in range [0,1]
   */
  setState(s) {
    this.#state = s;
  }

  /**
   *
   * @param {number} t The new target 0 or 1
   */
  setTarget(t) {
    this.#target = t;
  }

  /**
   *
   */
  get target() { return this.#target; }

  /**
   *
   */
  get state() { return this.#state; }

  /**
   * Update animation and return new layout parameters.
   */
  update() {

    // track time
    const newt = global.t;
    const dt = newt - this.#t;
    this.#t = newt;

    // update state
    const ds = this.#speed * dt;
    let s = this.#state;
    const trg = this.#target;
    if (s < trg) {
      s = Math.min(s + ds, trg);
    }
    else if (s > trg) {
      s = Math.max(s - ds, trg);
    }
    this.#state = s;

    // return updated layout parameters
    if (this.#param) {

      // return state as single animated parameter set in constructor
      return { [this.#param]: s };

    }

    // compute state based on anim data set in constructor
    return GuiAnimParser.computeLayoutAnimParams(this.#data, s);

  }
}
