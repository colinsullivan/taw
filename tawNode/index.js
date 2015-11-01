var pixel = require("node-pixel");

var five = require("johnny-five");

var supercolliderjs = require("supercolliderjs");

supercolliderjs.resolveOptions(null, {
  debug: true,
  stdin: false
}).then(function(options) {

  var lang = new supercolliderjs.sclang(options);
  /*lang.boot().then(function () {
    return lang.initInterpreter();
  }).then(function () {
    lang.interpret("API.mountDuplexOSC").then(function (result) {
      console.log("result");
      console.log(result);
    });
  });*/
  /*.then(function () {
  });*/
  var api = new supercolliderjs.scapi(options.host, options.langPort);
  api.log.dbug(options);

  console.log("connecting...");
  api.connect();
  console.log("calling...");
  api.call(0, "taw.hello", []).then(function (resp) {
    console.log("resp");
    console.log(resp);
  });

  /*var Server = supercolliderjs.scsynth;
  var s = new Server(options);
  s.boot();*/

  //console.log("resolveOptions done");
  //console.log("options");
  //console.log(options);

});



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


