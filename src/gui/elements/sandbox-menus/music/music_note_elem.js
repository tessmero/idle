/**
 * @file MusicNoteElem
 * shows one note for one voice in music sequencer
 */
class MusicNoteElem extends CompositeGuiElement {
  _layoutData = MUSIC_NOTE_LAYOUT; // music_tab_layout.js

  // position in song data
  #songData;
  #voiceIndex;
  #measureIndex;
  #beatIndex;
  #beatInMeasure;

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   * @param {object} params.songData
   * @param {number} params.measureIndex
   * @param {number} params.voiceIndex
   * @param {number} params.beatIndex
   * @param {number} params.beatInMeasure
   */
  constructor(rect, params = {}) {
    super(rect, {
      // border: new DefaultBorder(),
      ...params,
    });

    const {
      songData, measureIndex,
      voiceIndex,
      beatIndex, beatInMeasure,
    } = params;
    this.#songData = songData;
    this.#measureIndex = measureIndex;
    this.#voiceIndex = voiceIndex;
    this.#beatIndex = beatIndex;
    this.#beatInMeasure = beatInMeasure;
  }

  /**
   * Extend composite element draw to highlight currently playing beat.
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    if (MusicManager().getBeatInMeasure(this.#voiceIndex) === this.#beatInMeasure) {
      ProgressIndicator.draw(g, this.bounds, 1);
    }
  }

  /**
   * get note value from song score
   */
  _getState() {
    const noteVal = this.#songData.score[this.#measureIndex][this.#voiceIndex][this.#beatInMeasure];
    if ((typeof(noteVal) === 'number') && (!Object.hasOwn(this._pState, 'lastPitch'))) {
      this._pState.lastPitch = noteVal;
    }
    return noteVal;
  }

  /**
   * modify score in song data
   * @param {string|number} noteVal
   */
  _setState(noteVal) {
    this.#songData.score[this.#measureIndex][this.#voiceIndex][this.#beatInMeasure] = noteVal;
    if (typeof(noteVal) === 'number') {
      this._pState.lastPitch = noteVal;
    }
  }

  /**
   * Toggle between note/rest/sustain
   */
  _labelClicked() {
    const current = this._getState();
    if (current === 'sustain') {
      this._setState('rest');
    }
    else if (current === 'rest') {
      const { lastPitch = 0 } = this._pState;
      this._setState(lastPitch);
    }
    else {
      this._setState('sustain');
    }
  }

  /**
   * Play this note, called after the pitch is changed by user.
   */
  _playSample() {
    const voice = this.#songData.voices[this.#voiceIndex];
    const duration = 0.2; // seconds
    const freq = _namedNotes[SongParser.getNoteName(voice, this._getState())];

    if (!freq) { return; }

    // schedule note to play
    new SoundEffect(MusicManager(), {
      ...voice,
      freq,
      duration,
    }).play();
  }

  /**
   *
   */
  _freqUpClicked() {
    const { lastPitch = 0 } = this._pState;
    this._setState(lastPitch + 1);
    this._playSample();
  }

  /**
   *
   */
  _freqDownClicked() {
    const { lastPitch = 1 } = this._pState;
    this._setState(lastPitch - 1);
    this._playSample();
  }

  /**
   *
   */
  _getDisplayLabel() {
    const noteVal = this._getState();
    if (noteVal === 'rest') {
      return '';
    }
    if (noteVal === 'sustain') {
      return '-';
    }
    if (typeof(noteVal) === 'number') {
      return noteVal.toString();
    }

    return '';
  }

  /**
   *
   */
  _mainTooltip() {
    const noteVal = this._getState();
    if (typeof(noteVal) === 'number') {
      const voice = this.#songData.voices[this.#voiceIndex];
      return SongParser.getNoteName(voice, noteVal);
    }
    return noteVal;
  }

  /**
   *
   */
  _buildElements() {
    const layout = this._layout;
    const suf = `${this.#voiceIndex}_${this.#beatIndex}`; // suffix for titleKeys
    const scale = 0.3;

    const mainButton =
      new Button(layout.label, { scale,
        titleKey: `noteLabelBtn_${suf}`,
        label: this._getDisplayLabel(),
        action: () => this._labelClicked(),
        tooltipFunc: () => this._mainTooltip(),
        border: new DefaultBorder(),
      });

    // some buttons will be hidden
    // until the user hovers over
    const buttonsToHide = [

      new Button(layout.freqUpBtn, { scale,
        titleKey: `freqUpBtn_${suf}`,
        icon: increaseIcon,
        action: () => this._freqUpClicked(),
        mute: true,
      }),

      new Button(layout.freqDownBtn, { scale,
        titleKey: `freqDownBtn_${suf}`,
        icon: decreaseIcon,
        action: () => this._freqDownClicked(),
        mute: true,
      }),
    ];

    // override draw for hidden buttons
    buttonsToHide.forEach((btn) => {
      btn.__sdraw = btn.draw;
      btn.draw = (g) => {
        if (mainButton.hovered) {
          btn.__sdraw(g);
        }
      };
    });

    return [

      mainButton,

      ...buttonsToHide,

    ];
  }
}
