/**
 * @file Icon object type and all unique instances
 * for animated pixel art icons that appear in the gui.
 */
class Icon {

  /**
   * Construct animated pixel art icon.
   * @param {string[][]} frames The pixel layout for each frame.
   */
  constructor(frames) {
    this.frames = frames;
  }

  /**
   *
   */
  getCurrentAnimatedLayout() {
    const n = this.frames.length;
    const i = Math.floor(global.t / global.baseAnimPeriod) % n;
    return this.frames[i];
  }
}

// load data/icon_layouts_data.js
for (const [key, frames] of Object.entries(ICON_LAYOUTS)) {
  const icn = new Icon(frames);
  window[`${key}Icon`] = icn;
}

