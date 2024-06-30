/**
 * @file RainBoy special sealed black box with internal upgrades.
 */
class RainBoy extends BoxBuddy {
  expMechLabel = 'handheld console';
  expMechIcon = screenIcon;

  /**
   * Inner Particle Out Of Bounds
   * Override typical box behavior by letting the particles disappear.
   * @param {Vector} _innerPos
   * @param {Vector} _innerVel
   */
  _innerPoob(_innerPos, _innerVel) {
    // do nothing
  }

  /**
   * Revert special box buddy edge back to regular solid edge.
   * @param {...any} p Data about the particle.
   */
  grabbed(...p) {

    // use method assigned in BoxBuddy constructor.
    return this.square._grabbedAsSolidBody(...p);
  }
}
