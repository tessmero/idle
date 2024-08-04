/**
 * @file ColorScheme object type.
 *
 * Instance global.colorScheme determines canvas drawing colors
 * as well as css background-color (required for inversion effect)
 */
class ColorScheme {

  /**
   * Construct a new color scheme.
   * @param {string} fg The foreground color.
   * @param {string} bg The background color.
   * @param {string} hl The highlight color.
   * @param {string} mid The gray color between fg and bg.
   */
  constructor(fg, bg, hl, mid) {
    this.fg = fg;
    this.bg = bg;
    this.hl = hl;
    this.mid = mid;
  }

  static default = new ColorScheme(
    'black', '#AAA', 'white', '#999');
  static sandbox = new ColorScheme(
    'rgb(63,63,63)', 'rgb(220,220,204)', 'rgb(211,130,140)', 'rgb(190,190,180)');
}
