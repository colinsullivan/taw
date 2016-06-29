import AnimationTester from "./AnimationTester.js";

import QueuedSequencerAnimation from "./QueuedSequencerAnimation.js";

var animation = new QueuedSequencerAnimation();
var tester = new AnimationTester({
  animation: animation
});

setInterval(() => {
  tester.render();
}, 10);

// play animation
animation.play();

// stop after 2 seconds
setTimeout(() => {
  animation.stop();
  
  // start again after 2 seconds
  setTimeout(() => {
    animation.play();
  }, 2000);

}, 2000);

