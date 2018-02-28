/**
 *  @file       IdleMenuAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightAnimation from "./LightAnimation"
import config from "./config"

/**
 *  @class        IdleMenuAnimation
 *
 *  @classdesc    Render lights for a menu that is idle.
 **/

class IdleMenuAnimation extends LightAnimation {

  getNumPixels() {
    return config.MENU_NUM_LEDS;
  }
  constructor(params) {
    super(params);

    this.store = params.store;
    this.levelName = params.levelName;
    this.controlMenuIndex = params.controlMenuIndex;

    this.lastControlMenuState = null;
    this.handleStateChange();
    this.store.subscribe(() => { this.handleStateChange() });
  }

  handleStateChange () {
    var state = this.store.getState();
    var controlMenuState = state
      .rhythmicControls[this.levelName]
      .controlMenus[this.controlMenuIndex];
    var i;
    var cursorIndex;
    var h;
    if (this.lastControlMenuState !== controlMenuState) {

      if (controlMenuState.isActive) {
        h = 0.9;
      } else {
        h = 0.72;
      }

      // fill all LEDs with a dim color
      for (i = 0; i < this.buffer.length; i++) {
        this.buffer.setPixel(i, h, 0.2, 0.2);
      }

      // depending on control value, make active part of
      // menu brighter
      cursorIndex = Math.floor(controlMenuState.cursorPosition * (this.buffer.length - 1));
      for (i = 0; i < cursorIndex + 1; i++) {
        this.buffer.setPixel(i, {
          s: 0.5,
          v: 1.0
        });
      }

      this.lastControlMenuState = controlMenuState;
    }
  }

}

export default IdleMenuAnimation;
