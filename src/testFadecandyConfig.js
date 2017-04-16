import OPC from "./opc";

import config from "./config";

var MAX_PIXELS = 64 * 8;
var PIXEL_ADDRESSES = config.PIXEL_ADDRESSES;

var client = new OPC("localhost", 7890),
  i;


var toTestAddressRangeNames = Object.keys(PIXEL_ADDRESSES);
var currentlyTestingIndex;
var currentlyTestingAddressRangeName;
var currentlyLitLEDIndex;
var currentlyLitLEDTime;

var black_out = function () {
  // black out all pixels
  for (i = MAX_PIXELS - 1; i >= 0; i--) {
    client.setPixel(i, 0, 0, 0);
  }
};

var start_new_range = function (index, t) {
  black_out();
  currentlyTestingIndex = index;
  currentlyTestingAddressRangeName = toTestAddressRangeNames[index];
  console.log(`Starting range '${currentlyTestingAddressRangeName}': ${PIXEL_ADDRESSES[currentlyTestingAddressRangeName]}`);
  currentlyLitLEDIndex = PIXEL_ADDRESSES[currentlyTestingAddressRangeName][0];
  console.log(`Lighting LED: ${currentlyLitLEDIndex}`);
  currentlyLitLEDTime = t;
}
start_new_range(0, new Date().getTime());


var t,
  timeSince,
  finished = false;

var draw = function () {
  t = new Date().getTime();

  // current pixel is illuminated
  client.setPixel(currentlyLitLEDIndex, 255, 255, 255);

  // if 1 second has passed
  timeSince = t - currentlyLitLEDTime;
  if (timeSince >= 1000) {
    
    // if we aren't at the end of the range
    if (currentlyLitLEDIndex < PIXEL_ADDRESSES[currentlyTestingAddressRangeName][1]) {
      // just move to the next LED in this range
      black_out();
      currentlyLitLEDIndex++;
      currentlyLitLEDTime = t;
      console.log(`Lighting LED: ${currentlyLitLEDIndex}`);
    } else {
      // if we aren't done
      if (currentlyTestingIndex < toTestAddressRangeNames.length - 1) {
        start_new_range(currentlyTestingIndex + 1, t);
      } else {
        finished = true;
      }
    }
  }
  
  client.writePixels();

  if (!finished) {
    setTimeout(draw, 30);
  }
};

setTimeout(draw, 30);
