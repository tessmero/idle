/**
 * @file Grabber base class used to interact with particles.
 *
 * A grabber represents some criteria and resulting behavior.
 *
 * The grabber decides if a given particle is (or can be) "grabbed",
 * and if so the grabber's "grab"/"potential grab" callback is triggered.
 *
 * A grabber represents the player's click-and-drag
 * circular catching region.
 *
 * A grabber who's callback spawns edge particles
 * represents (one aspect of) the edge of a body.
 */
class Grabber {

  /**
   * Construct a grabber that will call f(x,y) when a particle is grabbed
   * @param {Function} f The grab event callback function.
   */
  constructor(f = null) {
    this.grabbed = f;
  }

  /**
   * check if point in grab region
   * if so, return nearest edge location
   * @param _subgroup
   * @param _i
   * @param _x
   * @param _y
   */
  contains(_subgroup, _i, _x, _y) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
