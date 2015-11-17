
var pixel = require("node-pixel");
var five = require("johnny-five");

import * as actions from "./actions.js"

class LightController {
  constructor (store) {
    this.store = store;

    store.dispatch(actions.lightingInit());

    this.board = new five.Board({
      repl: false
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
        length: 8,
        board: board,
        controller: "FIRMATA"
      });

      this.strip.on("ready", () => {
        this.store.dispatch(actions.lightingReady());
      });
    };

    this.board.on("ready", function () {
      // confusing - five changes context.  `this` refers to the board.
      handleBoardReady(this);
    });
  }

  render () {
    var state = this.store.getState();
    var seq = state.sequencers.lead;
    var i;

    for (i = 0; i < this.strip.stripLength(); i++) {
      let p = this.strip.pixel(i);
      if (seq.clock.beatInBar === i) {
        p.color("teal");
      } else {
        p.color("black");
      }
    }
    this.strip.show();
  }
}
export default LightController;
