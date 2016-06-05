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
    this.pixels = [];
    for (i = 0; i < this.length; i++) {
      this.pixels.push([0.0, 0.0, 0.0]);
    }
  }

  setPixel(i, h, s, v) {

    // second parameter can be object with `h`, `s`, `v` props.
    if (typeof(h) == "object") {
      let hsv = h;
      h = hsv.h || this.pixels[i][0];
      s = hsv.s || this.pixels[i][1];
      v = hsv.v || this.pixels[i][2];
    }

    this.pixels[i][0] = h;
    this.pixels[i][1] = s;
    this.pixels[i][2] = v;
  }

  getPixel(i) {
    return this.pixels[i];
  }

  allOff() {
    var i;
    for (i = 0; i < this.pixels.length; i++) {
      this.setPixel(i, 0.0, 0.0, 0.0);
    }
  }
};

export default PixelBuffer;
