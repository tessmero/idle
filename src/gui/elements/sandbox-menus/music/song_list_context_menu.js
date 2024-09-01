/**
 * @file SongListContextMenu
 */
class SongListContextMenu extends ContextMenu {
  _titleKey = 'song-list-context-menu';

  // context_menu_layout.js
  _layoutData = SONG_LIST_CONTEXT_MENU_LAYOUT;

  // handles for some children
  #songButtons;

  //
  #songList = [
    'BLANK_SONG',
    'CERULEAN_CITY_SONG',
    'TO_BILLS_ORIGIN_SONG',
  ];

  // sequencer interface to load songs into
  #musicTabParent;

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   * @param {GuiElement} params.musicTabParent
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const { musicTabParent } = params;
    this.#musicTabParent = musicTabParent;
  }

  /**
   * Clicked in list of songs.
   * @param {string} songName
   */
  _songClicked(songName) {
    this._pState.selectedSongName = songName;
  }

  /**
   * Clicked "load" button for selected song.
   */
  _loadClicked() {
    const songData = window[this._pState.selectedSongName];
    if (!songData) { return; }
    this.#musicTabParent.loadSong(songData);

    // close this menu
    this.screen.setContextMenu(null);
  }

  /**
   * Get text to show in selected song info area.
   * @returns {string} The text to display.
   */
  _getInfo() {
    const selectedSong = this._pState.selectedSongName;
    if (selectedSong) {
      const data = window[selectedSong];

      // get info from song data
      const info = data.info
        .split('\n')
        .map((line) => line.trim()) // trim each line
        .filter((line) => line) // remove empty lines
        .join('\n');

      // add stats based on song data
      return `${info}\n${data.voices.length} voices\n${data.score.length} measures`;
    }

    // no song selected
    return '';

  }

  /**
   * Extend composite element draw by highlighting the button
   * for the selected song.
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    const selectedSong = this._pState.selectedSongName;
    if (selectedSong && this.#songButtons) {
      const rect = this.#songButtons[selectedSong].bounds;
      ProgressIndicator.draw(g, rect, 1);
    }
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;

    this.#songButtons = Object.fromEntries(
      this.#songList.map((songName, rowIndex) => [
        songName,
        new Button(layout.songRows[rowIndex], {
          titleKey: `songlist_${songName}`,
          label: songName,
          action: () => this._songClicked(songName),
          scale: 0.3,
        }),
      ])
    );

    return [

      ...Object.values(this.#songButtons),

      // selected song info
      new GuiElement(layout.info, {
        titleKey: 'songListInfo',
        labelFunc: () => this._getInfo(),
        scale: 0.3,
      }),

      // load button
      new Button(layout.loadBtn, {
        titleKey: 'songListLoadSongBtn',
        label: 'Load Song',
        scale: 0.3,
        action: () => this._loadClicked(),
      }),

      // close button
      new Button(layout.closeBtn, {
        titleKey: 'songlistCloseBtn',
        icon: xIcon,
        action: () => this.screen.setContextMenu(null),
        scale: 0.4,
        tooltip: 'close menu',
      }),

    ];

  }
}
