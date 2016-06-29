/**
 *  @file       InstructionsSignLightsRenderer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LightRenderer from "./LightRenderer.js";
import ActiveSignAnimation from "./ActiveSignAnimation.js";
import config from "./config.js";

/**
 *  @class        InstructionsSignLightsRenderer
 *
 *  @classdesc    Renders lighting animations for the instructions sign based
 *  on state.
 **/
class InstructionsSignLightsRenderer extends LightRenderer {
  constructor(params) {
    super(params);

    this.activeSignAnimation = new ActiveSignAnimation({
      store: this.store,
      numPixels: config.INSTRUCTION_SIGN_NUM_LEDS
    });
    this.allAnimations.push(this.activeSignAnimation);

    this.currentAnimation = this.activeSignAnimation;

    this.currentAnimation.play();

    
    this.store.subscribe(() => {this.handleStateChange()});
  }
  handleStateChange() {
    
  }
};

export default InstructionsSignLightsRenderer;
