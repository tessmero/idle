/**
 * @file LayoutContextMenu used to test layouts
 * Has sliders for @ parameters in layout data
 */
class LayoutContextMenu extends ContextMenu {

  // data/gui-layouts/context_menu_layout.js
  _layoutData = LAYOUT_CONTEXT_MENU_LAYOUT;

  // require outer bounds to be fully expanded
  _minExpandToBuildElements = 1;

  // context
  #title;
  #testLayoutData;
  #testIconScale;
  #presets;
  #anims;

  // adjustable params state
  #testLayoutAnimParams;
  #testAspectRatio = 0.5;

  // handles for some children
  #display;
  #arSlider;
  #presetButtons;
  #paramSliders;
  #animSliders;

  // adjustable rect drawn within #display
  #displayRect;

  #arKey = '_aspect_ratio';

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   * @param {object} params.context the layout test context
   */
  constructor(rect, params = {}) {
    super(rect, params);

    // unpack context from gui element params
    const { context = {} } = params;

    // unpack many class-specific params from context
    const {
      testLayoutData,
      title = 'layout test',
      testIconScale,
      presets = [],
      anims = [],
    } = context;

    this.#title = title;
    this.#testLayoutData = testLayoutData;
    this.#presets = presets;
    this.#anims = anims;
    this.#testIconScale = testIconScale;
    this.#testLayoutAnimParams = this._pickDefaultAnimParams(testLayoutData);

    // apply first preset if available
    if (presets && presets.length > 0) {
      this._applyPreset(presets[0]);
    }
  }

  /**
   *
   * @param {object} layoutData
   */
  _pickDefaultAnimParams(layoutData) {

    // list of unique params referenced in data
    const paramNames = GuiLayoutParser.listAnimParams(layoutData);

    // give each param default value of 1
    const params = Object.fromEntries(paramNames.map((name) => [name, 1]));

    return params;
  }

  /**
   * compute test layout rectangles and draw them
   * @param {object} g The graphics context.
   * @param {number[]} rect
   */
  _drawLayoutDisplay(g, rect) {
    const fixedScale = this.#testIconScale;
    const iconScale = fixedScale ? fixedScale : Math.min(rect[2], rect[3]);
    const data = this.#testLayoutData;
    const animParams = this.#testLayoutAnimParams;
    const computed = GuiLayoutParser.computeRects(
      rect, data, iconScale, animParams);
    Object.entries(computed).forEach(([_name, r]) => {
      if (typeof r[0] === 'number') {
        // single rectangle
        g.strokeRect(...r);
      }
      else {
        // list of rectangles
        for (const rr of r) {
          g.strokeRect(...rr);
        }
      }
    });
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;

    // title label at top
    const title = new GuiElement(layout.title, {
      label: this.#title,
      scale: 0.3,
    });

    // display in top/left square
    const display = new GuiElement(layout.squares[0]);
    display.draw = (g) => {
      this._drawLayoutDisplay(g, this.#displayRect);
      Border.draw(g, this.#displayRect, {
        hovered: false,
        fill: false,
        border: new RoundedBorder(),
      });
    };
    this.#display = display;
    this.#displayRect = display.rect;

    // slider for aspect ratio of layout container in display
    const arSlider = new SliderButton(layout.arSlider, {
      titleKey: `ctm_param_${this.#arKey}`,

      // label: `aspect ratio`,
      // scale: 0.2,
      action: () => this._updateFromArSlider(),
      tooltipFunc: () => this._arTooltip(),
    });
    this.#arSlider = arSlider;

    // buttons for presets
    const presetButtons = this.#presets
      .map((presetParams, presetIndex) =>
        new Button(layout.presets[presetIndex], {
          titleKey: `lcmPresetBtn_${presetIndex}`,
          label: `PRESET ${presetIndex}`,
          scale: 0.2,
          tooltip: JSON.stringify(presetParams, null, 2),
          action: () => {
            this._applyPreset(presetParams);
            this._updateSliders();
          },
        })
      );
    this.#presetButtons = presetButtons;

    // start adding elements to rows
    // in bottom/right content square
    const rows = layout.rows;
    let rowIndex = 1;
    if (presetButtons.length > 0) { rowIndex++; } // buttons may use first row

    // slider for each layout param
    const paramSliders = Object.fromEntries(
      Object.entries(this.#testLayoutAnimParams)
        .filter(([param, _value]) => param !== this.#arKey)
        .map(([param, _value]) => [
          param,
          new SliderButton(rows[rowIndex++], {
            titleKey: `ctm_param_${param}`,
            label: param,
            scale: 0.2,
            action: () => this._updateFromParamSlider(param),
            tooltipFunc: () => this._paramSliderTooltip(param),
          }),
        ])
    );
    this.#paramSliders = paramSliders;

    // slider for each layout animation object
    const animSliders = Object.fromEntries(
      this.#anims.map((animName) => [
        animName,
        new SliderButton(rows[rowIndex++], {
          titleKey: `ctm_anim_${animName}`,
          label: animName,
          scale: 0.2,
          action: () => this._updateFromAnimSlider(animName),
          tooltipFunc: () => this._animSliderTooltip(animName),
        }),
      ])
    );
    this.#animSliders = animSliders;

    // update sliders
    this._updateSliders();

    return [title, display,
      ...presetButtons,
      arSlider,
      ...Object.values(animSliders),
      ...Object.values(paramSliders),

      new Button(layout.closeBtn, {
        titleKey: 'lcmCloseBtn',
        icon: xIcon,
        action: () => this.screen.setContextMenu(null),
        scale: 0.4,
        tooltip: 'close layout tester',
      }),

    ];
  }

  /**
   * Set layout anim parameters and/or aspect ratio according to preset.
   * @param {object} presetParams The preset parameters.
   */
  _applyPreset(presetParams) {
    this.#testLayoutAnimParams = {
      ...this.#testLayoutAnimParams,
      ...presetParams,
    };
  }

  /**
   *
   */
  _updateSliders() {
    let { [this.#arKey]: ar } = this.#testLayoutAnimParams;
    if (!ar) { ar = this.#testAspectRatio; }
    if (ar) {
      this._updateAr(ar);
      this.#arSlider.setSliderVal(ar);
    }

    // update sliders to match params
    Object.entries(this.#testLayoutAnimParams)
      .filter(([param, _value]) => param !== this.#arKey)
      .forEach(([param, value]) =>
        this.#paramSliders[param].setSliderVal(value));
  }

  /**
   * Explain layout container aspect ratio setting.
   */
  _arTooltip() {
    const ar = this.#testAspectRatio;
    return [
      `container aspect ratio: ${ar.toFixed(2)}`,
      '(0-1 where 0.5 = square)',
    ].join('\n');
  }

  /**
   * explain param defined in layout data with @
   * @param {string} param The layout parameter name
   */
  _paramSliderTooltip(param) {
    const val = this.#testLayoutAnimParams[param];
    const sval = (typeof val === 'number') ? val.toFixed(2) : val.map((v) => v.toFixed(2));
    return [
      `${param}: ${sval}`,
      'defined in data/gui-layouts',
    ].join('\n');
  }

  /**
   * Explain animation data object in data/gui-anims.
   * @param  {string} animName The animation object name
   */
  _animSliderTooltip(animName) {
    return [
      `${animName}: defined in data/gui-anims`,
    ].join('\n');
  }

  /**
   * Update layout container aspect ratio based on slider.
   */
  _updateFromArSlider() {

    // get truncated state from slider
    let ar = this.#arSlider.sliderVal;
    const minAr = 0.05;
    if (ar < minAr) { ar = minAr; }
    if (ar > (1 - minAr)) { ar = (1 - minAr); }
    this.#testAspectRatio = ar;
    this.#testLayoutAnimParams[this.#arKey] = ar;

    // update aspect ratio for layout container
    this._updateAr(ar);
  }

  /**
   * update aspect ratio for layout container.
   * @param  {number} ar The aspect ratio 0-1
   */
  _updateAr(ar) {

    // immutable rectangle of the element
    // in which we will draw the layout
    const rect = this.#display.rect;
    const lax = Math.min(rect[2], rect[3]);
    const [x, y] = rectCenter(...rect);

    // adjust rectangle used for parsing layout and drawing display
    const w = lax * (ar < 0.5 ? 1 : 2 * (1 - ar));
    const h = lax * (ar > 0.5 ? 1 : 2 * ar);
    this.#displayRect = [x - w / 2, y - h / 2, w, h];
  }

  /**
   * Set all non-dragging param sliders to nearest extreme.
   * Update parameters to reflect sliders.
   * @param  {string} sliderParam The name of the parameter
   *                              for the slider being dragged
   */
  _updateFromParamSlider(sliderParam) {
    const sliders = this.#paramSliders;
    Object.entries(sliders).forEach(([param, slider]) => {

      // if this slider isn't being dragged,
      if (param !== sliderParam) {

        // set to nearest extreme
        slider.setSliderVal(Math.round(this.#testLayoutAnimParams[param]));

      }

      // update anim to reflect slider position
      this.#testLayoutAnimParams[param] = slider.sliderVal;
    });
  }

  /**
   * Update parameters to based on an animation slider.
   * Set all param sliders to match anim state, or nearest extreme.
   * @param  {string} sliderAnim The name of the animation
   *                              for the slider being dragged
   */
  _updateFromAnimSlider(sliderAnim) {
    const slider = this.#animSliders[sliderAnim];
    const state = slider.sliderVal;
    const anim = window[sliderAnim];

    // round current params to extremes
    Object.entries(this.#testLayoutAnimParams).forEach(([param, value]) => {
      if (param !== this.#arKey) {
        this.#testLayoutAnimParams[param] = Math.round(value);
      }
    });

    // update layout params based on animation
    const animParams = GuiAnimParser.computeLayoutParams(anim, state);
    this.#testLayoutAnimParams = {
      ...this.#testLayoutAnimParams,
      ...animParams,
    };

    // update param sliders
    const prmSliders = this.#paramSliders;
    Object.entries(prmSliders).forEach(([param, parSlider]) => {
      parSlider.setSliderVal(this.#testLayoutAnimParams[param]);
    });
  }
}
