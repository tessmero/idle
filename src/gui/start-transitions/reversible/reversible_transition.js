/**
 * @file ReversibleTransition base class for animation segments
 * that would work for either part of the start transition (covering or uncovering)
 */
class ReversibleTransition extends StartAnimStage {
  reversed = false;

  /**
   *
   */
  asFadeOut() {
    return this;
  }

  /**
   *
   */
  asFadeIn() {
    this.reversed = true;
    return this;
  }
}
