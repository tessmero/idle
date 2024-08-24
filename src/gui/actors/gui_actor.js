/**
 * @file GuiActor object moves gui elements
 * - tracks time, maintains anim state (0-1) and target state
 * - returns one updated layout param
 * - ...or multiple following script in data/gui-anims
 */
class GuiActor {
  #lytParam; // name of single layout parameter to animate
  #lytAnim; // ...or object in data/gui-anims

  // last update time
  #t;

  // between 0 and 1
  #state = 0;

  // 0 or 1
  #target = 0;

  // fraction of animation script per millisecond
  #speed;

  /**
   * @param {object} params The parameters.
   * @param {string} params.lytParam The layout parameter to animate
   * @param {object} params.lytAnim The object in data/gui-anims to animate multiple layout parameters
   * @param {string} params.param should use lytParam instead. Unpacked to throw error message.
   * @param {number} params.speed The amount per ms to move state towards target
   */
  constructor(params = {}) {
    const {
      lytAnim,
      param,
      lytParam,
      speed = 1e-3,
    } = params;

    if (param) {
      throw new Error('invalid parameter \'param\'. Should use \'lytParam\'.');
    }

    this.#lytParam = lytParam;
    this.#lytAnim = lytAnim;
    this.#speed = speed;
    this.#t = global.t;
  }

  /**
   * called in game_screen
   */
  resetGuiActor() {
    this.#t = global.t;
  }

  /**
   *
   */
  debug() {
    return `${this.#state}->${this.#target}`;
  }

  /**
   *
   * @param {s} s The new state in range [0,1]
   */
  setState(s) {
    this.#state = s;
    this.#t = global.t;
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

    // return animated layout parameter(s)
    return this._getLytParams();

  }

  /**
   * compute animated layout parameter(s)
   */
  _getLytParams() {

    if (this.#lytParam) {

      // return single param
      return { [this.#lytParam]: this.#state };

    }

    // return multiple params using anim data
    return GuiAnimParser.computeLayoutParams(this.#lytAnim, this.#state);
  }
}
