
//var pixel = require("node-pixel");
//var five = require("johnny-five");

import OPC from "./opc.js"

import * as actions from "./actions.js"
import config from "./config.js"

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

class LightController {
  constructor (store) {
    this.store = store;

    this.store.dispatch(actions.lightingInit());

    //this.socket = new net.Socket();
    //this.socket.setNoDelay();
    this.opcClient = new OPC("localhost", 7890);

    this.opcClient.setPixelCount(
      config.SEQUENCE_NAMES.length * config.SEQUENCE_NUM_LEDS
    );

    /*let handleSocketClosed = () => {
      console.log("Lighting connection closed.");
      this.connect();
    }
    this.socket.on("close", handleSocketClosed);
    this.socket.on("error", handleSocketClosed);*/
    console.log("Connecting to fadecandy...");
    this.opcClient.writePixels();

    var handleConnected = () => {
      console.log("Connected to fadecandy.");
      this.store.dispatch(actions.lightingReady());
      this.handleStateChange();
      this.store.subscribe(() => { this.handleStateChange(); })
    }

    this.opcClient.socket.on("connect", );

    //this.opcStream = createOPCStream();
    //this.opcStream.pipe(this.socket);

    /*this.fadecandyPixels = createOPCStrand(
      config.SEQUENCE_NAMES.length * config.SEQUENCE_NUM_LEDS
    );*/
    //this.fadecandyPixels = createOPCStrand(
      //512
    //);

    //this.connect();


    // cache the meter and transport of each sequence so we can handle when
    // it changes.
    this.sequenceMeter = {};
    this.sequenceTransport = {};

    // create a strip for each sequence
    this.sequencePixels = {};

    config.SEQUENCE_NAMES.forEach((sequenceName) => {
      var pixelAddrs = config.SEQUENCE_NAME_TO_PIXEL_ADDRESSES[sequenceName];
      //this.sequenceStrips[sequenceName] = new pixel.Strip({
        //data: config.SEQUENCE_NAME_TO_LED_PIN[sequenceName],
        //length: 16,
        //board: board,
        //controller: "FIRMATA"
      //});

      this.sequenceMeter[sequenceName] = null;
      this.sequenceTransport[sequenceName] = null;
      this.sequencePixels[sequenceName] = this.opcClient.pixelBuffer.slice(
        pixelAddrs[0],
        pixelAddrs[1]
      );

      //this.sequenceStrips[sequenceName].on("ready", () => {
        //numStripsReady++;
        //if (numStripsReady == config.SEQUENCE_NAMES.length) {
          //handleStripsReady();
        //}
      //});
    });


  }

  //connect () {
    //console.log("Connecting to fadecandy...");
    //this.socket.connect(7890);
  //}

  handleSequenceChanged (seqName, seqState) {
    var numBeats = seqState.meter.numBeats;
    //console.log("numBeats");
    //console.log(numBeats);
    var pixels = this.sequencePixels[seqName];
    //console.log("strip");
    //console.log(strip);
    var i;
    // number of LEDs per beat (if less than one, there are more beats than
    // LEDS in the strip)
    var ledsPerBeat = 1.0 * pixels.length / numBeats;
    var color;

    //console.log(`handleSequenceChanged(${seqName})`);

    var ledColors = [];
    for (i = 0; i < pixels.length; i++) {
      ledColors.push([0.72, 0.5, 0.5]);
    }

    for (i = 0; i < numBeats; i++) {
      let ledIndex = Math.floor(ledsPerBeat * i) % pixels.length;
      //ledIndex = pixels.length - 1 - ledIndex; // clockwise
      ledColors[ledIndex][1] *= 1.25;
      ledColors[ledIndex][2] *= 1.25;

      if (i === seqState.transport.beat) {
        console.log("seqState.transport.beat");
        console.log(seqState.transport.beat);
        //ledColors[1] = 0.5;
        //ledColors[2] = 1.0;
      }

    }
  
    console.log("pixels.length");
    console.log(pixels.length); 
    for (i = 0; i < pixels.length; i++) {
      color = hsvToRGB(ledColors[i]);
      pixels.setPixel(i, 255, 0, 0);
      //pixels.setPixel.apply(pixels, [i].concat(color));
    }
  }

  handleStateChange() {
    var state = this.store.getState();

    //console.log("handleStateChange");

    // for each sequence
    config.SEQUENCE_NAMES.forEach((seqName) => {
      let seqState = state.sequencers[seqName];

      // if transport or meter have changed
      if (
        seqState.meter !== this.sequenceMeter[seqName]
      || seqState.transport !== this.sequenceTransport[seqName]
      ) {
        this.sequenceMeter[seqName] = seqState.meter;
        this.sequenceTransport[seqName] = seqState.transport;

        // re-render lights for that sequence
        //this.handleSequenceChanged(seqName, seqState);
      }
    });
  }

  render () {
    console.log("render");
    //console.log(render);

    //var i;
    //for (i = 0; i < this.fadecandyPixels.length; i++) {
      //this.fadecandyPixels.setPixel(i, 255, 0, 0);
    //}
    //this.opcStream.writePixels(0, this.fadecandyPixels.buffer);
    opcClient.writePixels();
  }
}
export default LightController;
