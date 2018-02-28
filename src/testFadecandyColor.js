import OPC from "./opc";

var MAX_PIXELS = 64 * 8;

var client = new OPC("localhost", 7890),
  i;

var draw = function () {
  
  
  
  
  
  // set all pixels to the given color [0 - 255]
  let colorRGB = [0, 0, 0];
  // or specify color in hsv [0 - 1.0]
  colorRGB = OPC.hsv(0.1, 1.0, 1.0);
  
  
  
  
  
  
  for (i = MAX_PIXELS - 1; i >= 0; i--) {
    client.setPixel(i, colorRGB[0], colorRGB[1], colorRGB[2]);
  }
  
  client.writePixels();

  setTimeout(draw, 30);
};

setTimeout(draw, 30);
