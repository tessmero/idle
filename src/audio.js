
/**
 * @file Unused base audio loop
 */

/**
 * @param {number} bpm
 * @param {number} dur
 */
function noteDurationToMs(bpm, dur) {
  return 60000 * 4 * dur / bpm;
}

currentSong = new Song();
function mainMusicLoop(ac, time, dur) {
  currentSong.playBeat(ac, time, dur);
}

const ac = new AudioContext();
let lastMusicLoop = ac.currentTime;
const step = noteDurationToMs(currentSong.bpm, 1 / 4) / 1000;
const chordDur = step * 3.5;
const lookAhead = step / 2;

const timer = () => {
  const diff = ac.currentTime - lastMusicLoop;
  if (diff >= lookAhead) {
    const nextNote = lastMusicLoop + step;
    mainMusicLoop(ac, nextNote, step);
    lastMusicLoop = nextNote;
  }
};

function startMusicLoop() {

  ac.resume();
  setInterval(timer, 15);
}
