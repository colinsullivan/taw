/**
 *  @file       LightAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import PixelBuffer from "./PixelBuffer";

//export const PLAYING_STATES = {
  //STOPPED: 0,
  //PLAYING: 1
//};


/**
 *  @class        LightAnimation
 *
 *  @classdesc    A manipulation of pixels over time.
 **/
class LightAnimation {
  constructor(params) {

    this.buffer = new PixelBuffer({
      // number of pixels in this light animation is defined in subclasses.
      length: this.getNumPixels()
    });

    // this animation hasn't started yet
    this.startTime = null;

    // it is initially stopped
    //this.playingState = PLAYING_STATES.STOPPED;
  }

  play() {
    this.startTime = (new Date()).getTime();
    //this.playingState = PLAYING_STATES.PLAYING;
  }

  stop() {
    //this.playingState = PLAYING_STATES.STOPPED;
  }

  render(t) {

    return;
    
  }
};

export default LightAnimation;
