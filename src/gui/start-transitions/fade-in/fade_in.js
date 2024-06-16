
/**
 * @file FadeIn base class for animated transitions
 * from black screen to playing hud
 */
class FadeIn extends StartAnimStage {

  /**
   * Construct a random FadeIn implementation.
   */
  static random() {
    const result = randChoice([
      () => new GridTrans(),
      () => new DissolveTrans(),
    ])();
    if (result instanceof ReversibleTransition) {
      return result.asFadeIn();
    }
    return result;
  }
}
