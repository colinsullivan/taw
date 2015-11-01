var pixel = require("node-pixel");

var five = require("johnny-five");

var board = new five.Board({
  repl: false
});

var state = {
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
