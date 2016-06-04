function hsvToRGB (hsvArray) {
  /*
   * Converts an HSV color value to RGB.
   *
   * Normal hsv range is in [0, 1], RGB range is [0, 255].
   * Colors may extend outside these bounds. Hue values will wrap.
   *
   * Based on tinycolor:
   * https://github.com/bgrins/TinyColor/blob/master/tinycolor.js
   * 2013-08-10, Brian Grinstead, MIT License
   */

  var h = hsvArray[0];
  var s = hsvArray[1];
  var v = hsvArray[2];

  h = (h % 1) * 6;
  if (h < 0) h += 6;

  var j = h | 0,
      f = h - j,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s),
      r = [v, q, p, p, t, v][j],
      g = [t, v, v, q, p, p][j],
      b = [p, p, t, v, v, q][j];

  return [
    r * 255,
    g * 255,
    b * 255
  ];
}

export default {
  hsvToRGB: hsvToRGB
};
