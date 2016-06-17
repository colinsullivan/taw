import LightController from "./LightController.js";
import QueuedSequencerAnimation from "./QueuedSequencerAnimation.js";
import KnobActiveAnimation from "./KnobActiveAnimation.js";
import configureStore from "./configureStore.js"
import * as actions from "./actions.js"

var store = configureStore();

//var animation = new QueuedSequencerAnimation();
//var animation = new KnobActiveAnimation({
  //store: store,
  //knobId: "A"
//});



var lightController = new LightController(store);

setTimeout(() => {
  store.dispatch(actions.knobPosChanged("A", -25));
  store.dispatch({
    type: "SEQUENCE_PLAYING",
    name: "zaps"
  });
}, 10000);


setInterval(() => {
  lightController.render();
}, 10);

//// play animation
//animation.play();

//// stop after 2 seconds
//setTimeout(() => {
  //animation.stop();
  
  //// start again after 2 seconds
  //setTimeout(() => {
    //animation.play();
  //}, 2000);

//}, 2000);

