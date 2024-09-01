/**
 * @file VoiceRow one row/track in the "music" tab sequencer
 */
class VoiceRow extends CompositeGuiElement {
  _layoutData = VOICE_ROW_LAYOUT; // music_tab_layout.js

  #voiceIndex;

  songData = null;
  measureIndex = 0;

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   * @param {number} params.voiceIndex
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const { voiceIndex } = params;
    this.#voiceIndex = voiceIndex;
  }

  /**
   *
   */
  _buildElements() {
    if (!this.songData) { return []; }
    const scale = this.scale;

    const measureVoices = this.songData.score[this.measureIndex];
    if (this.#voiceIndex >= measureVoices.length) {
      return [];
    }

    // count total beats before this measure
    let beatIndex = 0;
    for (let i = 0; i < this.measureIndex; i++) {
      beatIndex = beatIndex + this.songData.score[i][this.#voiceIndex];
    }

    const noteRects = [...this._layout.notes];
    const noteElems = noteRects.map((rect, i) =>
      new MusicNoteElem(rect, { scale,
        titleKey: `mNoteElem_${this.#voiceIndex}_${beatIndex + i}`,

        // position in song data
        songData: this.songData,
        voiceIndex: this.#voiceIndex,
        measureIndex: this.measureIndex,
        beatIndex: beatIndex + i,
        beatInMeasure: i,
      })
    );

    return [
      ...noteElems,
    ];
  }

  /**
   * Update any actors and let them adjust layout parameters.
   */
  _updateLytParams() {

    let stretch = 0;
    if (this.songData) {
      const voices = this.songData.voices;

      if (this.#voiceIndex < voices.length) {

        // assume first voice uses default unstretched note
        const defaultNoteDur = voices[0].duration;
        const myNoteDur = voices[this.#voiceIndex].duration;
        if (myNoteDur > defaultNoteDur) { stretch = 1; }// (myNoteDur-defaultNoteDur) / defaultNoteDur;
      }
    }

    this._setLytParams({ stretch });
  }

}
