// used in pi_context_menu.js
// to continuously poll the state
// of one particle by subgroup and (index in subgroup)
/**
 *
 */
class TrackOneParticleGrabber extends Grabber {

  /**
   *
   * @param subgroup
   * @param i
   * @param f
   */
  constructor(subgroup, i, f) {
    super(f);
    this.subgroup = subgroup;
    this.i = i;
  }

  // implement Grabber
  /**
   *
   * @param subgroup
   * @param i
   * @param _x
   * @param _y
   */
  contains(subgroup, i, _x, _y) {
    return (subgroup === this.subgroup) &&
            (i === this.i);
  }

  // implement Grabber
  /**
   *
   * @param _g
   */
  drawDebug(_g) {
    // do nothing
  }

}
