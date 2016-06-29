/**
 *  @file       LightRenderer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

/**
 *  @class        LightRenderer
 *
 *  @classdesc    Abstract class for an entity that wants to render some
 *  lighting animations in response to state changes.
 **/
class LightRenderer {
  constructor(params) {
    
    this.store = params.store;
    this.allAnimations = [];
    this.currentAnimation = null;

  }

  render(t) {
    var i;
    for (i = 0; i < this.allAnimations.length; i++) {
      this.allAnimations[i].render(t);
    }
  }

  getOutputBuffer() {
    return this.currentAnimation.buffer || [];
  }
};

export default LightRenderer;
