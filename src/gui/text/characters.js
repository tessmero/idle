/**
 * @file Logic for drawing text.
 */

const charWidth = 5;
const charHeight = 7;

/**
 * Compute the width and height of the rectangle needed to contain
 * the given text label on-screen.
 * @param {string} s The text to fit, which may contain newlines.
 * @param {number} scale The font size to accomodate.
 */
function getTextDims(s, scale = 1) {
  const lines = s.split(/\r?\n/);
  const longest = Math.max(...lines.map((l) => l.length));

  // dims in terms of number of characters
  const charDims = [longest, lines.length];

  // dims in terms of number of text pixels
  const w = charDims[0] * charWidth + (charDims[0] - 1) * global.textLetterSpace;
  const h = charDims[1] * charHeight + (charDims[1] - 1) * global.textLineSpace;

  const m = global.textPixelSize * scale;

  return [m * w, m * h];
}

/**
 * Draw a text character or icon.
 * @param {object} g The graphics context.
 * @param {number} xpos The x coord of the position to draw at.
 * @param {number} ypos The y coord of the position to draw at.
 * @param {string[]} layout The pixel layout to draw.
 * @param {boolean} center True if the layout should be centered at the given position,
 *                         otherwise it will extend down and to the right.
 * @param {object} fontSpec The font specifications.
 */
function drawLayout(g, xpos, ypos, layout, center = true, fontSpec) {
  if (!layout) { return; }

  const tps = global.textPixelSize * fontSpec.scale;
  const ch = layout.length;// charHeight
  const pad = fontSpec.pad;

  let x = xpos;
  let y = ypos;

  if (center) {
    x = x - tps * layout[0].length / 2;
    y = y - tps * layout.length / 2;
  }

  for (let iy = 0; iy < ch; iy++) {
    let ix = 0;
    for (const b of layout[iy]) {

      // skipPixel used in dissolving_font_spec.js
      if ((!fontSpec.skipPixel()) && (b !== ' ')) {
        const rect = [x + tps * ix - pad, y + tps * iy - pad, tps + pad * 2, tps + pad * 2];
        if (fontSpec.clear) {
          g.clearRect(...rect);
        }
        else {
          g.fillRect(...rect);
        }
      }
      ix = ix + 1;
    }
  }
}

/**
 * Draw one line of text. Called in drawText.
 * @param {object} g The graphics context.
 * @param {number} xpos The x coord of the position to draw at.
 * @param {number} ypos The y coord of the position to draw at.
 * @param {string} s The line of text to draw.
 * @param {boolean} center True if the line should be centered at the given position,
 *                         otherwise it will extend down and to the right.
 * @param {object} fontSpec The font specifications.
 */
function _drawTextLine(g, xpos, ypos, s, center, fontSpec) {
  // s = s.toUpperCase()
  const dx = fontSpec.scale * global.textPixelSize * (charWidth + global.textLetterSpace);

  let x = xpos;
  let y = ypos;

  if (center) {
    const [tw, th] = getTextDims(s, fontSpec.scale);
    x = x - tw / 2;
    y = y - th / 2;
  }

  for (const c of s) {
    drawLayout(g, x, y, CHAR_LAYOUTS[c], false, fontSpec);
    x = x + dx;
  }
}

/**
 * Draw text.
 * @param {object} g The graphics context.
 * @param {number} x The x coord of the position to draw at.
 * @param {number} y The y coord of the position to draw at.
 * @param {string} s The text to draw, which may contain newlines.
 * @param {boolean} center True if the text should be centered at the given position,
 *                         otherwise it will extend down and to the right.
 * @param {object} fontSpec The font specifications.
 */
function drawText(g, x, y, s, center, fontSpec) {
  g.fillStyle = global.colorScheme.fg;
  const lines = s.split('\n');
  const dy = fontSpec.scale * global.textPixelSize * (charHeight + global.textLineSpace);
  let yy = y;
  if (center) { yy = yy - 0.5 * dy * (lines.length - 1); }
  lines.forEach((l) => {
    _drawTextLine(g, x, yy, l, center, fontSpec);
    yy = yy + dy;
  });
}
