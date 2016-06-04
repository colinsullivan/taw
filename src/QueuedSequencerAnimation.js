import LightAnimation from "./LightAnimation.js";

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
      x = 0.5 * Math.sin(t * 0.01) + 0.5;
    for (i = 0; i < this.numPixels; i++) {
      this.pixelColors[i][0] = 0.4;
      this.pixelColors[i][1] = 0.8;
      this.pixelColors[i][2] = 0.4 + 0.4*x;
    }
  }


};

export default QueuedSequencerAnimation;
