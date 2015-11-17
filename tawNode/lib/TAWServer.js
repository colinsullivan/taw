
import { createStore, applyMiddleware } from "redux"
import osc from "node-osc"

import rootReducer from "./reducers.js"
import * as actions from "./actions.js"
import TAWScheduler from "./TAWScheduler.js"
import SCController from "./SCController.js"
import LightController from "./LightController.js"
import InputController from "./InputController.js"

class TAWServer {
  constructor () {
    var playListener;

    this.scController = null;

    this.oscServer = new osc.Server(3334, "127.0.0.1");
    this.oscServer.on("message", (msg, rinfo) => {
      //console.log("msg");
      //console.log(msg);
      //console.log("rinfo");
      //console.log(rinfo);

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


    this.store = createStoreWithMiddleware(rootReducer);

    this.isRendering = false;
    this.renderInterval = null;

    playListener = this.store.subscribe(() => {
      var state = this.store.getState();
      /*console.log("this.store.getState().sequencers.lead.currentBeat");
      console.log(this.store.getState().sequencers.lead.currentBeat);*/
      
      // once supercollider and arduino are ready
      if (!this.isRendering && state.supercolliderIsReady && state.lightingIsReady) {
       
        // if we're not already rendering, start
        this.renderInterval = setInterval(() => {
          this.render();
        }, 30);
        this.isRendering = true;
        
        // testing
        setTimeout(() => {
          this.store.dispatch(actions.queueAllSequencers());

        }, 1000);

      }

    });

    //this.scheduler = new TAWScheduler(this.store);
    
    this.scController = new SCController(this.store);
    this.lightController = new LightController(this.store);
    this.inputController = new InputController(this.store);


  }

  render () {
    this.lightController.render();
  }
}
export default TAWServer;


/*






var state = {
  clock: {
    beats: null
  },
  sequence: {
    numSteps: 8,
    currentStep: 0
  }
};




*/
