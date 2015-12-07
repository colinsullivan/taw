"use strict";

var OPC = require("./opc.js");

var opcClient = new OPC("localhost", 7890);

var rings = 3;
var ringSize = 16;

opcClient.setPixelCount(rings * ringSize);

var draw = function () {

  var r, i;
  var now = new Date().getTime();

  var angle = Math.sin(now * 0.001);

  for (r = 0; r < rings; r++) {

    for (i = 0; i < ringSize; i++) {
      let hue = 0.5 * angle + 0.5;
      let color = OPC.hsv(hue, 0.5, 1.0);
      opcClient.setPixel(r * ringSize + i, color[0], color[1], color[2]);
    }
  }

  opcClient.writePixels();

  
};

setInterval(draw, 10);
