const charWidth = 5;
const charHeight = 7;

/**
 *
 * @param s
 * @param scale
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
 *
 * @param g
 * @param xpos
 * @param ypos
 * @param layout
 * @param center
 * @param fontSpec
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
 *
 * @param g
 * @param xpos
 * @param ypos
 * @param s
 * @param center
 * @param fontSpec
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
    drawLayout(g, x, y, charLayouts[c], false, fontSpec);
    x = x + dx;
  }
}

// draw text centered at point xy
/**
 *
 * @param g
 * @param x
 * @param y
 * @param s
 * @param center
 * @param fontSpec
 */
function drawText(g, x, y, s, center = true, fontSpec) {
  const lines = s.split('\n');
  const dy = fontSpec.scale * global.textPixelSize * (charHeight + global.textLineSpace);
  let yy = y;
  lines.forEach((l) => {
    _drawTextLine(g, x, yy, l, center, fontSpec);
    yy = yy + dy;
  });
}
