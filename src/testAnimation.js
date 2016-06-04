import AnimationTester from "./AnimationTester.js";

import QueuedSequencerAnimation from "./QueuedSequencerAnimation.js";

var animation = new QueuedSequencerAnimation();
var tester = new AnimationTester({
  animation: animation
});

setInterval(() => {
  tester.render();
}, 10);


