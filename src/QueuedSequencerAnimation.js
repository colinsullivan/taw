import LightAnimation, {PLAYING_STATES} from "./LightAnimation.js";
import config from "./config.js";

/**
 *  @class        QueuedSequencerAnimation
 *
 *  @classdesc    Pulsing animation for a single sequencer ring.
 **/
class QueuedSequencerAnimation extends LightAnimation {
  getNumPixels() {
    return config.SEQUENCE_NUM_LEDS;
  }

  render(t) {
    var i,
      x;

    if (this.playingState != PLAYING_STATES.PLAYING) {
      return;
    }

    x = 0.5 * Math.sin((t - this.startTime) * 0.01) + 0.5;
    for (i = 0; i < this.buffer.length; i++) {
      this.buffer.setPixel(i, 0.4, 0.7, 0.2 + 0.3*x);
    }
  }


};

export default QueuedSequencerAnimation;
