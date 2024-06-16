
/**
 * @file TrackOneParticleGrabber
 *
 * used by particle inspector to poll the state
 * of one particle by subgroup and (index in subgroup)
 */
class TrackOneParticleGrabber extends Grabber {

  /**
   *
   * @param {object} subgroup
   * @param {number} i
   * @param {Function} f
   */
  constructor(subgroup, i, f) {
    super(f);
    this.subgroup = subgroup;
    this.i = i;
  }

  /**
   *
   * @param {object} subgroup
   * @param {number} i
   * @param {number} _x
   * @param {number} _y
   */
  contains(subgroup, i, _x, _y) {
    return (subgroup === this.subgroup) &&
            (i === this.i);
  }

}
