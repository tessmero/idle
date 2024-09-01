/**
 * @file MusicTab music sequencer gui element.
 *
 * Contents for the "music" tab in sandbox mode.
 */
class MusicTab extends CompositeGuiElement {
  _layoutData = MUSIC_TAB_LAYOUT;
  _titleKey = 'music-tab';

  // moved to this._pState
  // #songData;
  // #nMeasures;
  // #measureIndex = 0;
  // #beatIndex = 0;

  // handles for some children
  #voiceRows;

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   */
  constructor(rect, params = {}) {
    super(rect, params);
  }

  /**
   * Open the song list context menu.
   */
  _loadSongClicked() {

    // check if already open
    if (this.screen.contextMenu instanceof SongListContextMenu) {

      // close menu
      this.screen.setContextMenu(null);
    }
    else {

      // open menu
      this.screen.setContextMenu(
        new SongListContextMenu(this.screen.rect, {
          musicTabParent: this,
        })
      );
    }
  }

  /**
   *
   */
  _exportClicked() {
    if (!this._pState.songData) {
      return;
    }
    const score = this._pState.songData.score;

    // build score data with formatting and shorthands
    const result = [];
    for (const measure of score) {
      result.push('\n    [');
      for (const voiceMeasure of measure) {
        result.push('\n      [');
        for (const noteVal of voiceMeasure) {
          if (noteVal === 'rest') {
            result.push('_,');
          }
          else if (noteVal === 'sustain') {
            result.push('s,');
          }
          else {
            result.push(`${noteVal},`);
          }
        }
        result.push('],');
      }
      result.push('\n    ],');
    }

    // copy to clipboard
    navigator.clipboard.writeText(result.join(''));

  }

  /**
   * Called by song_list_context_menu.js
   * When a new song is loaded.
   * @param {object} songData
   */
  loadSong(songData) {
    MusicManager().stopMusic();

    // make copy of song data
    this._pState.songData = JSON.parse(JSON.stringify(songData));

    this._pState.nMeasures = songData.score.length;
    this._pState.measureIndex = 0;
  }

  /**
   *
   */
  _stopClicked() {
    MusicManager().stopMusic();
  }

  /**
   *
   */
  _playSongClicked() {
    const my = this._pState;
    my.lastPlayMode = 'wholeSong';
    MusicManager().startMusicLoop(my.songData);
  }

  /**
   *
   */
  _playOneMeasureClicked() {
    const my = this._pState;
    my.lastPlayMode = 'oneMasure';
    const { voices, score: fullScore } = my.songData;

    // copy of song data that ends after this measure
    const cutEnd = {
      voices,
      score: [
        ...fullScore.slice(0, my.measureIndex + 1),
        [['rest'], ['rest'], ['rest'], ['rest'], ['rest'], ['rest'], ['rest']],
      ],
    };

    // start playing song and skip ahead to this measure
    MusicManager().startMusicLoop(
      cutEnd, this._getMeasureStartTime());
  }

  /**
   * start playing song and skip ahead to this measure
   */
  _playFromMeasureClicked() {
    const my = this._pState;
    my.lastPlayMode = 'wholeSong';
    MusicManager().startMusicLoop(
      my.songData, this._getMeasureStartTime());
  }

  /**
   * called by previous and next measure buttons
   * @param {number} d The change -1 or 1
   */
  _changeMeasureClicked(d) {
    const mgr = MusicManager();
    const my = this._pState;

    const wasPlaying = mgr.isPlaying();

    this._stopClicked(); // stop playing music
    my.measureIndex = Math.min(my.nMeasures - 1, Math.max(0, my.measureIndex + d));

    if (wasPlaying) {

      // resume playing from different measure
      if (my.lastPlayMode === 'oneMeasure') {
        this._playOneMeasureClicked();
      }
      else {
        this._playFromMeasureClicked();
      }
    }
  }

  /**
   *
   */
  _getMeasureStartTime() {
    const my = this._pState;
    const { voices, score } = my.songData;
    const beatDur = voices[0].duration;
    let skipTime = beatDur;
    for (let i = 0; i < my.measureIndex; i++) {
      skipTime = skipTime + (beatDur * score[i][0].length);
    }
    return skipTime;
  }

  /**
   *
   * @param {number} dt
   * @param {boolean} disableHover
   */
  update(dt, disableHover) {
    const result = super.update(dt, disableHover);

    // check for lag
    if (dt > 40) { // limited to 50 in setup.js
      if (this._pState.laggedLastUpdate) {

        // lagged two updates in a row
        // skip graphical effects to reduce lag
        global.gfxEnabled = false;
      }
      this._pState.laggedLastUpdate = true;
    }
    else {
      this._pState.laggedLastUpdate = false;
    }

    if (!this._pState.songData) {
      this.loadSong(BLANK_SONG);
    }

    this._checkPlayingIndex();
    return result;
  }

  /**
   *
   */
  _checkPlayingIndex() {

    const my = this._pState;
    let { measureIndex = 0, beatIndex = 0 } = my;

    const playingIndex = MusicManager().getPlayingBeatIndex();
    if (playingIndex) {
      if (!Object.hasOwn(playingIndex, 'measure')) {
        // throw new Error('no measure');
        return;
      }
      if (typeof(playingIndex.measure) !== 'number') {
        return;
      }
      measureIndex = playingIndex.measure;
      beatIndex = playingIndex.beat;
    }

    // update children
    if (this.#voiceRows) {
      this.#voiceRows.forEach((voiceRow) => {
        voiceRow.songData = my.songData;
        voiceRow.measureIndex = measureIndex;
      });
    }

    my.measureIndex = measureIndex;
    my.beatIndex = beatIndex;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const scale = 0.3;

    const rows = [...layout.voiceRows];
    this.#voiceRows = rows.map((rect, voiceIndex) =>
      new VoiceRow(rect, { scale,
        lytParams: {
          stretch: 0,
        },
        voiceIndex,
      })
    );
    this._checkPlayingIndex();

    const my = this._pState;

    return [
      ...this.#voiceRows,

      // open song list context menu
      new Button(layout.loadSongBtn, { scale,
        titleKey: 'loadSongBtn',
        label: 'song\nlist',
        tooltip: 'Load a song from data/songs',
        action: () => this._loadSongClicked(),
      }),

      // export score to clipboard
      new Button(layout.exportSongBtn, { scale,
        titleKey: 'exportSongBtn',
        label: 'copy\nscore',
        tooltip: 'copy score to clipboard\nto paste into data/songs',
        action: () => this._exportClicked(),
      }),

      // stop playing music
      new Button(layout.stopBtn, { scale,
        titleKey: 'stopMusicBtn',
        icon: pauseIcon,
        tooltip: 'stop playing',
        action: () => this._stopClicked(),
      }),

      // play song from beginning
      new Button(layout.playSongBtn, { scale,
        titleKey: 'playSongBtn',
        icon: playIcon,
        label: 'song',
        tooltip: 'play song from beginning',
        action: () => this._playSongClicked(),
      }),

      // play one measure
      new Button(layout.playOneMeasureBtn, { scale,
        titleKey: 'playOneMeasureBtn',
        icon: playIcon,
        tooltipFunc: () => `play just measure ${my.measureIndex + 1}`,
        action: () => this._playOneMeasureClicked(),
      }),

      // play song from current measure
      new Button(layout.playFromMeasureBtn, { scale,
        titleKey: 'playFromMeasureBtn',
        icon: playIcon,
        labelFunc: () => `m${my.measureIndex + 1}`,
        tooltipFunc: () => `play from measure ${my.measureIndex + 1}`,
        action: () => this._playFromMeasureClicked(),
      }),

      // go to previous measure
      new Button(layout.prevMeasureBtn, { scale,
        titleKey: 'prevMeasureBtn',
        icon: prevIcon,
        tooltip: 'previous measure',
        action: () => this._changeMeasureClicked(-1), // -1 for previous measure
      }),

      // label showing current measure and total number of measures
      new GuiElement(layout.measureLabel, { scale,
        labelFunc: () => `measure ${my.measureIndex + 1}/${my.nMeasures}`,
      }),

      // go to next measure
      new Button(layout.nextMeasureBtn, { scale,
        titleKey: 'nextMeasureBtn',
        icon: nextIcon,
        tooltip: 'next measure',
        action: () => this._changeMeasureClicked(1), // +1 for next measure
      }),
    ];
  }
}
