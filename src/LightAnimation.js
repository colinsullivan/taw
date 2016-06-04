export const PLAYING_STATES = {
  STOPPED: 0,
  PLAYING: 1
};

class LightAnimation {
  constructor(params) {
    var i;

    // number of pixels in this light animation is defined in subclasses.
    this.numPixels = this.getNumPixels();

    // initialize pixel values (HSV)
    this.pixelColors = [];
    for (i = 0; i < this.numPixels; i++) {
      this.pixelColors.push([0.0, 0.0, 0.0]);
    }

    // this animation hasn't started yet
    this.startTime = null;

    // it is initially stopped
    this.playingState = PLAYING_STATES.STOPPED;
  }

  play() {
    this.startTime = (new Date()).getTime();
    this.playingState = PLAYING_STATES.PLAYING;
  }

  stop() {
    this.playingState = PLAYING_STATES.STOPPED;
  }

  render() {
    
  }

};

export default LightAnimation;
