
import { createStore, applyMiddleware } from "redux"
import osc from "node-osc"

import rootReducer from "./reducers.js"
import * as actions from "./actions.js"
import TAWScheduler from "./TAWScheduler.js"
import SCController from "./SCController.js"

class TAWServer {
  constructor () {
    var playListener;

    this.scController = null;

    this.oscServer = new osc.Server(3334, "127.0.0.1");
    this.oscServer.on("message", (msg, rinfo) => {
      console.log("msg");
      console.log(msg);
      console.log("rinfo");
      console.log(rinfo);

      var command = msg[0];
      switch (command) {
        case '/dispatch':
          let actionPairs = msg.slice(1);
          let i;
          let action = {};
          for (i = 0; i < actionPairs.length - 1; i+=2) {
            action[actionPairs[i]] = actionPairs[i + 1];
          }
          this.store.dispatch(action);
          break;
        
        default:
          break;
      }
    });

    const logger = store => next => action => {
      //console.group(action.type)
      console.info('dispatching', action)
      let result = next(action)
      console.log('next state', JSON.stringify(store.getState()))
      //console.groupEnd(action.type)
      return result
    };

    const forwardToSC = store => next => action => {
      if (this.scController) {
        this.scController.call("taw.dispatch", [action]);
      }
      return next(action);
    };

    let createStoreWithMiddleware = applyMiddleware(
      //forwardToSC,
      logger
    )(createStore);


    this.store = createStoreWithMiddleware(rootReducer, {
      tempo: {
        value: 96
      },
      sequencers: {
        lead: {
          name: "lead",
          quant: 4,
          numBeats: 16,
          currentBeat: 0,
          playingState: "STOPPED"
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

     /*console.log("this.store.getState()");
     console.log(JSON.stringify(this.store.getState()));*/
    });

    //this.scheduler = new TAWScheduler(this.store);
    
    this.scController = new SCController(this.store);

    setTimeout(() => {
      this.store.dispatch(actions.queueAllSequencers());
    }, 1000);

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
