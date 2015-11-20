
var pixel = require("node-pixel");
var five = require("johnny-five");

import * as actions from "./actions.js"

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
   
    this.strip = null; 

    let handleBoardReady = (board) => {
      this.strip = new pixel.Strip({
        data: 6,
        length: 16,
        board: board,
        controller: "FIRMATA"
      });

      this.strip.on("ready", () => {
        this.store.dispatch(actions.lightingReady());

        this.store.subscribe(() => {
          this.handleStateChange();
        });
        this.handleStateChange();
      });
    };

    this.board.on("ready", function () {
      // confusing - five changes context.  `this` refers to the board.
      handleBoardReady(this);
    });

    this.meter = null;
    this.transport = null;
    this.ledColors = [];
  }

  handleStateChange() {
    var state = this.store.getState();
    var numBeats = state.sequencers.lead.meter.numBeats;
    var stripLength = this.strip.stripLength();
    var i;
    // number of LEDs per beat (if less than one, there are more beats than
    // LEDS in the strip)
    var ledsPerBeat = 1.0 * stripLength / numBeats;

    if (
      state.sequencers.lead.meter !== this.meter
      || state.sequencers.lead.transport !== this.transport
    ) {
      this.ledColors = [];
      for (i = 0; i < stripLength; i++) {
        this.ledColors.push([0.72, 0.01, 0.01]);
      }

      for (i = 0; i < numBeats; i++) {
        let ledIndex = Math.floor(ledsPerBeat * i) % stripLength;
        ledIndex = stripLength - 1 - ledIndex; // clockwise
        this.ledColors[ledIndex][1] = 0.2;
        this.ledColors[ledIndex][2] = 0.2;

        if (i === state.sequencers.lead.transport.beat) {
          this.ledColors[ledIndex][1] = 0.5;
          this.ledColors[ledIndex][2] = 0.5;
        }

      }
      
      for (i = 0; i < stripLength; i++) {
        let p = this.strip.pixel(i);
        p.color(null, {
          rgb: hsvToRGB(this.ledColors[i])
        });
      }

      this.meter = state.sequencers.lead.meter;
      this.transport = state.sequencers.lead.transport;
      this.strip.show();
    }
  }

  render () {
    var stripLength = this.strip.stripLength();
    var i;



    /*for (i = 0; i < stripLength; i++) {
      let p = this.strip.pixel(i);
      if (seq.clock.beatInBar === i) {
        p.color("teal");
      } else {
        p.color("black");
      }
    }*/


    this.strip.show();
  }
}
export default LightController;
