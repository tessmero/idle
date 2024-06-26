
/**
 * @file FadeOut base class for animated transitions
 * from start menu to black screen
 */
class FadeOut extends StartAnimStage {

  /**
   * Construct a random FadeIn implementation.
   */
  static random() {
    const result = randChoice([
      () => new GridTrans(),
      () => new DissolveTrans(),

      // new NoclearFadeOut(),
    ])();
    if (result instanceof ReversibleTransition) {
      return result.asFadeOut();
    }
    return result;
  }
}

