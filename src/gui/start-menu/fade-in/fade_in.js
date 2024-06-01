
/**
 * @file FadeIn base class for animated transitions
 * from black screen to playing hud
 */
class FadeIn extends StartAnimStage {
  /**
   *
   */
  static random() {
    return randChoice([
      new GridFadeIn(),
    ]);
  }
}
