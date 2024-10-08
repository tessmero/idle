/**
 * @file ScreenManager keeps track of GameScreen instances
 */
function ScreenManager() {
  if (ScreenManager._instance) {
    return ScreenManager._instance;
  }
  if (!(this instanceof ScreenManager)) {
    // eslint-disable-next-line idle/no-new-singleton
    return new ScreenManager();
  }
  ScreenManager._instance = this;

  this.constructedScreens = new Map();

  /**
   * Called in GameScreen constructor.
   * @param {GameScreen} screen The new instance to register.
   */
  this.submitNewScreen = function(screen) {
    const key = screen.titleKey;
    const as = this.constructedScreens;
    if (as.has(key)) {
      throw new Error(`screen (${key}) constructed multiple times`);
    }
    as.set(key, screen);
  };
}
