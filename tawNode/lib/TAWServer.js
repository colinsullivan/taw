
import { createStore } from "redux"

import rootReducer from "./reducers.js"
import * as actions from "./actions.js"
import TAWScheduler from "./TAWScheduler.js"

class TAWServer {
  constructor () {
    this.store = createStore(rootReducer, {
      sequencers: {
        lead: {
          quant: {
            value: 4
          },
          numBars: {
            value: 2
          },
          currentBeat: {
            value: 0
          }
        }
      }
    });

    this.store.subscribe(() => {
      console.log("this.store.getState().sequencers.lead.currentBeat");
      console.log(this.store.getState().sequencers.lead.currentBeat);
    });

    this.scheduler = new TAWScheduler(this.store);

  }
}
export default TAWServer;


/*var pixel = require("node-pixel");

var five = require("johnny-five");





var board = new five.Board({
  repl: false
});

var state = {
  clock: {
    beats: null
  },
  sequence: {
    numSteps: 8,
    currentStep: 0
  }
};

var renderStrip = function (strip) {
  var i;
  var p;
  for (i = 0; i < state.sequence.numSteps; i++) {
    p = strip.pixel(i);
    if (state.sequence.currentStep == i) {
      p.color("teal");
    } else {
      p.color("black");
    }
  }
  strip.show();
};

var renderInterval = null;

board.on("ready", function () {
  var strip = new pixel.Strip({
    data: 6,
    length: 8,
    board: this,
    controller: "FIRMATA"
  });

  strip.on("ready", function () {
    renderInterval = setInterval(function () {
      renderStrip(strip);
    }, 30);
  });
});


*/
