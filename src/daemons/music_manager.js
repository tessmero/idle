/**
 * @file MusicManager
 */
function MusicManager() {
  if (MusicManager._instance) {
    return MusicManager._instance;
  }
  if (!(this instanceof MusicManager)) {
    // eslint-disable-next-line idle/no-new-singleton
    return new MusicManager();
  }
  MusicManager._instance = this;

  // start MusicManager constructor
  setInterval(() => this._loop(), 15); // millisecs
  this._step = 100 / 1000; // seconds, must be greater than interval
  this._lookAhead = this._step / 2;
  this._lastSnData = { measure: 0, beat: 0 }; // returned from most recent call to ScheduleNotes
  this.soundManager = new SoundManager();
  this._ac = this.soundManager.getAudioContext();

  /**
   * @param {number} time
   * @param {number} dur
   */
  this.mainMusicLoop = function(time, dur) {
    this._lastSnData = this._songScheduler(time, 1.5 * dur);
    if (this._lastSnData.finished) {
      this._playing = false;
    }
  };

  /**
   *
   */
  this.isPlaying = function() {
    return this._playing;
  };

  /**
   *
   */
  this.getPlayingBeatIndex = function() {
    if (this._playing) {
      return this._lastSnData;
    }
    return null;
  };

  /**
   * @param {number} voiceIndex
   */
  this.getBeatInMeasure = function(voiceIndex) {
    if (!this._playing) {
      return -1;
    }
    if (!this._lastSnData.beatInMeasure) {
      return -1;
    }
    return this._lastSnData.beatInMeasure[voiceIndex];
  };

  /**
   */
  this.stopMusic = function() {
    this._playing = false;
  };

  /**
   *
   * @param {object} songData
   * @param {number} skipTime
   */
  this.startMusicLoop = function(songData, skipTime = 0) {
    this._lastMusicLoop = this._ac.currentTime;
    this._songScheduler = SongParser.getScheduler(songData, this._ac.currentTime - skipTime);

    this._ac.resume();
    this._playing = true;
  };

  /**
   * underlying loop function that gets called periodically
   * even if music is not playing
   */
  this._loop = function() {
    if (this._playing) {
      const diff = this._ac.currentTime - this._lastMusicLoop;
      if (diff >= this._lookAhead) {
        const nextNote = this._lastMusicLoop + this._step;
        this.mainMusicLoop(nextNote, this._step);
        this._lastMusicLoop = nextNote;
      }
    }
  };
}
