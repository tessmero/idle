
/**
 * used to construct an inverted copy
 * of an existing grabber
 */
class InverseGrabber extends Grabber {

  /**
   *
   * @param grabber The grabber to invert.
   * @param callback function to call when particle is grabbed.
   */
  constructor(grabber, callback) {
    super(callback);

    this.grabberToInverse = grabber;
  }

  /**
   *
   * @param {...any} p
   */
  contains(...p) {
    return !this.grabberToInverse.contains(...p);
  }
}
