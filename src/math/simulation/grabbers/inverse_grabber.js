
/**
 * @file InversGrabber wrapper that inverts
 * the grabbing criteria of an existing grabber.
 *
 * This grabs only what the original grabber would not grab.
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
