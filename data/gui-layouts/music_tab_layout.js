/**
 * @file layout data for music tab in sandbox mode.
 * @param stretch add 1/3 to note width to align triplet note sequence
 */

_BTN = 0.05; // size of buttons
_NOTE = 0.05; // size of note sequence boxes
MUSIC_TAB_LAYOUT = {

  // helper
  _r0: {
    margin: 0.05,
    width: _NOTE * 16.5,
    left: 'auto',
  },

  // button to load song
  loadSongBtn: {
    parent: '_r0',
    width: 2.5 * _BTN,
    height: 2.5 * _BTN,
    left: 0.5 * _BTN,
  },

  // button to export song
  exportSongBtn: {
    parent: '_r0',
    width: 2.5 * _BTN,
    height: 2.5 * _BTN,
    right: 0.5 * _BTN,
  },

  // helper
  _measure: {
    parent: '_r0',
    width: 8.5 * _BTN, // matching _button container
    height: _BTN,
    left: 'auto',
  },

  // current measure number display
  measureLabel: {
    parent: '_measure',
    left: _BTN,
    width: 0.3,
  },

  // previous measure button
  prevMeasureBtn: {
    parent: '_measure',
    width: _BTN,
    left: 0,
  },

  // next measure button
  nextMeasureBtn: {
    parent: '_measure',
    width: _BTN,
    right: 0,
  },

  // helper
  _buttons: {
    parent: '_r0',
    top: 1.5 * _BTN,
    height: _BTN,
    width: 8.5 * _BTN,
    left: 'auto',
  },

  // button to play song from beginning
  playSongBtn: {
    parent: '_buttons',
    width: 2.5 * _BTN,
    left: 0,
  },

  // button to stop playing music
  stopBtn: {
    parent: '_buttons',
    width: _BTN,
    left: 3 * _BTN,
  },

  // button to play just current measure
  playOneMeasureBtn: {
    parent: '_buttons',
    width: _BTN,
    left: 4.5 * _BTN,
  },

  // button to play song
  // starting from current measure
  playFromMeasureBtn: {
    parent: '_buttons',
    width: 2.5 * _BTN,
    right: 0,
  },

  // rows for individual voices
  voiceRows: {
    parent: '_r0',
    height: 2 * _NOTE + 0.02,
    left: 'auto',
    top: _BTN * 3,
    repeat: 'down',
    margin: 0.01,
  },
};

// layout within one voice row voice_row.js
VOICE_ROW_LAYOUT = {

  _notesArea: {
    width: 16 * _NOTE,
    left: 0,
  },

  notes: {
    parent: '_notesArea',
    'width@stretch=0': _NOTE, // default note in score e.g. 16th note
    'width@stretch=1': 4 / 3 * _NOTE, // align triplet voice with fewer notes per measure
    repeat: 'right',
  },
};

// layout within one note music_note_elem.js
_BTN = _NOTE / 2;
MUSIC_NOTE_LAYOUT = {

  // label takes up the whole bounding rectangle
  label: {

  },

  // button to go up 1/2 step
  freqUpBtn: {
    // width: _BTN,
    height: _BTN,
    left: 'auto',
  },

  // button to go down 1/2 step
  freqDownBtn: {
    // width: _BTN,
    height: _BTN,
    left: 'auto',
    bottom: 0,
  },
};
