
/**
 *  @class        LightVisualization
 *
 *  @classdesc    Similar to a LightAnimation in that we are manipulating
 *  LED colors, but here we are bound to data.
 **/
class LightVisualization {
  constructor() {

    var i;

    // number of pixels in this light animation is defined in subclasses.
    this.numPixels = this.getNumPixels();

    // initialize pixel values (HSV)
    this.pixelColors = [];
    for (i = 0; i < this.numPixels; i++) {
      this.pixelColors.push([0.0, 0.0, 0.0]);
    }
    
  }
};

export default LightVisualization;
