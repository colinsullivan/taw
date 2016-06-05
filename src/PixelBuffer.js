/**
 *  @file       PixelBuffer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

/**
 *  @class        PixelBuffer
 *
 *  @classdesc    Handle an array of pixel color information.  Some useful
 *  utilities included.
 **/
class PixelBuffer {
  constructor(params) {
    var i;
    // how many pixels do we have
    this.length = params.length;

    // initialize pixel values (HSV)
    this.colors = [];
    for (i = 0; i < this.length; i++) {
      this.colors.push([0.0, 0.0, 0.0]);
    }
  }

  allOff() {
    var i;
    for (i = 0; i < this.colors.length; i++) {
      this.colors[i][0] = 0.0;
      this.colors[i][1] = 0.0;
      this.colors[i][2] = 0.0;
    }
  }
};

export default PixelBuffer;
