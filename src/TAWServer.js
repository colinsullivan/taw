/**
 *  @file       TAWServer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2016 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import { createStore, applyMiddleware } from "redux"
import osc from "node-osc"

import rootReducer from "./reducers.js"
import * as actions from "./actions.js"
import SCController from "./SCController.js"
import LightController from "./LightController.js"
import InputController from "./InputController.js"

/**
 *  @class        TAWServer
 *
 *  @classdesc    Entry point into the application.  Starts all controllers.
 *  Sets up logging.
 **/
class TAWServer {
  constructor () {
    var playListener;

    this.scController = null;

    // TODO: this should be in SCController
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

    this.oscClient = new osc.Client("127.0.0.1", 3333);

    /**
     *  logging of state-store messages
     **/
    const logger = store => next => action => {
      let now = new Date();
      //console.group(action.type)
      console.info(`${now.toString()}: [TAW] dispatching`, action);
      //let result = next(action)
      //console.log('next state', JSON.stringify(store.getState()))
      //console.groupEnd(action.type)
      //return result
      return next(action);
    };

    //const forwardToSC = store => next => action => {
      //if (this.scController) {
        //this.scController.call("taw.dispatch", [action]);
      //}
      //return next(action);
    //};
    
    /**
     *  Start the [redux](http://redux.js.org/docs/api/Store.html) state store.
     **/

    let createStoreWithMiddleware = applyMiddleware(
      //forwardToSC,
      logger
    )(createStore);


    this.store = createStoreWithMiddleware(rootReducer);

    this.isRendering = false;
    this.renderInterval = null;

    playListener = this.store.subscribe(() => {
      var state = this.store.getState();
      
      // once supercollider and arduino are ready
      if (
        // we haven't started rendering yet
        !this.isRendering
        // if we are running with sc, make sure sc is ready
        && state.supercolliderIsReady
        // if we are running with lighting, make sure lighting is ready
        && state.lightingIsReady
      ) {
       
        // if we're not already rendering, start
        console.log("[TAWServer] starting render loop...");
        this.renderInterval = setInterval(() => {
          this.render();
        }, 10);
        this.isRendering = true;
        
        // testing
        //setTimeout(() => {
          //this.store.dispatch(actions.queueAllSequencers());

        //}, 1000);

      }

    });


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
