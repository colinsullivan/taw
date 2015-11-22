
var pixel = require("node-pixel");
var five = require("johnny-five");

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

    store.dispatch(actions.lightingInit());

    this.board = new five.Board({
      repl: false,
      debug: true,
      port: process.env.LIGHTING_ARDUINO_SERIALPORT
    });
    
    //var renderStrip = (strip) => {
      //var i;
      //var p;
      //console.log("renderStrip");
      //for (i = 0; i < this.store.getState().sequence.numSteps; i++) {
        //p = strip.pixel(i);
        //if (state.sequence.currentStep == i) {
          //p.color("teal");
        //} else {
          //p.color("black");
        //}
      //}
      //strip.show();
    //};

    //var renderInterval = null;
    //this.renderInterval = renderInterval;
   
    this.sequenceStrips = {};

    let handleBoardReady = (board) => {
      var numStripsReady = 0;
      var state = this.store.getState();
      var handleStripsReady = () => {
        this.store.dispatch(actions.lightingReady());

        //this.store.subscribe(() => {
          //this.handleStateChange();
        //});
        this.handleStateChange();
      };

      // create a strip for each sequence
      config.SEQUENCE_NAMES.forEach((sequenceName) => {
        this.sequenceStrips[sequenceName] = new pixel.Strip({
          data: config.SEQUENCE_NAME_TO_LED_PIN[sequenceName],
          length: 16,
          board: board,
          controller: "FIRMATA"
        });

        this.sequenceMeter[sequenceName] = null;
        this.sequenceTransport[sequenceName] = null;

        this.sequenceStrips[sequenceName].on("ready", () => {
          numStripsReady++;
          if (numStripsReady == config.SEQUENCE_NAMES.length) {
            handleStripsReady();
          }
        });
      });
    };

    this.board.on("ready", function () {
      // confusing - five changes context.  `this` refers to the board.
      handleBoardReady(this);
    });

    this.sequenceMeter = {};
    this.sequenceTransport = {};
  }

  handleSequenceChanged (seqName, seqState) {
    var numBeats = seqState.meter.numBeats;
    //console.log("numBeats");
    //console.log(numBeats);
    var strip = this.sequenceStrips[seqName];
    //console.log("strip");
    //console.log(strip);
    var stripLength = strip.stripLength();
    //console.log("stripLength");
    //console.log(stripLength);
    var i;
    // number of LEDs per beat (if less than one, there are more beats than
    // LEDS in the strip)
    var ledsPerBeat = 1.0 * stripLength / numBeats;

    var ledColors = [];
    for (i = 0; i < stripLength; i++) {
      ledColors.push([0.72, 0.01, 0.01]);
    }

    for (i = 0; i < numBeats; i++) {
      let ledIndex = Math.floor(ledsPerBeat * i) % stripLength;
      ledIndex = stripLength - 1 - ledIndex; // clockwise
      ledColors[ledIndex][1] = 0.2;
      ledColors[ledIndex][2] = 0.2;

      if (i === seqState.transport.beat) {
        ledColors[1] = 0.5;
        ledColors[2] = 0.5;
      }

    }
    
    for (i = 0; i < stripLength; i++) {
      let p = strip.pixel(i);
      p.color(null, {
        rgb: hsvToRGB(ledColors[i])
      });
    }
    strip.show();
  }

  handleStateChange() {
    var state = this.store.getState();

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
        this.handleSequenceChanged(seqName, seqState);
      }
    });
  }

  render () {
    //config.SEQUENCE_NAMES.forEach((seqName) => {
      //this.sequenceStrips[seqName].show();
    //});
  }
}
export default LightController;
