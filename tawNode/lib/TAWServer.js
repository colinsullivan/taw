
import { createStore } from "redux"

import rootReducer from "./reducers.js"
import * as actions from "./actions.js"
import TAWScheduler from "./TAWScheduler.js"
import SCController from "./SCController.js"

class TAWServer {
  constructor () {
    var playListener;

    this.store = createStore(rootReducer, {
      sequencers: {
        lead: {
          quant: {
            value: 4
          },
          numBeats: {
            value: 16
          },
          currentBeat: {
            value: 0
          }
        }
      }
    });

    playListener = this.store.subscribe(() => {
      /*console.log("this.store.getState().sequencers.lead.currentBeat");
      console.log(this.store.getState().sequencers.lead.currentBeat);*/
      
      // once supercollider is initialized
      /*if (this.store.getState().supercolliderInitCompleted) {

        playListener();
      }*/
    });

    //this.scheduler = new TAWScheduler(this.store);
    
    this.scController = new SCController(this.store);

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
