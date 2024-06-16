/**
 * @file SausageGrabber grabs particles within a thick line with circular ends.
 */
class SausageGrabber extends CompoundGrabber {

  #rad;
  #line;
  #circle0;
  #circle1;

  /**
   *
   * @param {Vector} a The position of one end.
   * @param {Vector} b The position of the other end.
   * @param {number} rad Half of the thickness.
   * @param {Function} f The function to call when a particle is grabbed.
   */
  constructor(a, b, rad, f) {
    super(f);

    const len = b.sub(a).getMagnitude();
    const cap = pi * rad;

    this.#rad = rad;
    this.#line = new LineGrabber(a, b, rad, null, 0, len + cap);
    this.#circle0 = new CircleGrabber(b, rad, null, len);
    this.#circle1 = new CircleGrabber(a, rad, null, len + cap + len);

    this.setChildren([
      this.#line, this.#circle0, this.#circle1,
    ]);
  }

  /**
   * Called periodically. set member vars
   * for objects in this.children
   * do not add or remove children
   * @param {Vector} a
   * @param {Vector} b
   */
  updateEndpoints(a, b) {
    const line = this.#line;
    line.a = a;
    line.b = b;

    this.#circle0.pos = b;
    this.#circle1.pos = a;
  }
}
