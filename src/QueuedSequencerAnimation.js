import LightAnimation, {PLAYING_STATES} from "./LightAnimation.js";

/**
 *  @class        QueuedSequencerAnimation
 *
 *  @classdesc    Pulsing animation for a single sequencer ring.
 **/
class QueuedSequencerAnimation extends LightAnimation {
  getNumPixels() {
    return 16;
  }

  render(t) {
    var i,
      x;

    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }

    x = 0.5 * Math.sin((t - this.startTime) * 0.01) + 0.5;
    for (i = 0; i < this.buffer.length; i++) {
      this.buffer.setPixel(i, 0.4, 0.8, 0.4 + 0.4*x);
    }
  }


};

export default QueuedSequencerAnimation;
