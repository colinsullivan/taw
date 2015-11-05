var pixel = require("node-pixel");

var five = require("johnny-five");

var supercolliderjs = require("supercolliderjs");




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


supercolliderjs.resolveOptions(null, {
  debug: true,
  stdin: false
}).then(function(options) {

  /*var lang = new supercolliderjs.sclang(options);
  lang.boot().then(function () {
    return lang.initInterpreter();
  }).then(function () {
  });*/

  var api = new supercolliderjs.scapi(options.host, options.langPort);
  api.log.echo = true;

  api.on("error", function (err) {
    console.log("API ERROR: ");
    console.log(err);
  });

  console.log("connecting...");
  api.connect();
  console.log("calling...");

  var apiCallIndex = 0;
  function getAPICallIndex () {
    if (apiCallIndex < Number.MAX_SAFE_INTEGER - 1) {
      apiCallIndex++;
    } else {
      apiCallIndex = 0;
    }
    return apiCallIndex;
  }

  var incrementStripPositionQuantized;

  var incrementStripPosition = function () {
    state.sequence.currentStep = (state.sequence.currentStep + 1) % state.sequence.numSteps;
  };
  incrementStripPositionQuantized = function () {
    api.call(getAPICallIndex(), "taw.playNote", []).then(function (resp) {
      console.log("resp");
      console.log(resp);
      if (state.clock.beats != resp.beats) {
        state.clock.beats = resp.beats;
        incrementStripPosition();
        console.log("state.sequence.currentStep");
        console.log(state.sequence.currentStep);
      }
      incrementStripPositionQuantized();
    });
  };
  incrementStripPositionQuantized();

  var scheduleTickUpdate;
  var tickUpdate = function (resp) {
    console.log("tickUpdate.resp");
    console.log(resp);
  };
  scheduleTickUpdate = function () {
    api.call(getAPICallIndex(), "taw.onNextTick", []).then(function (resp) {
      tickUpdate(resp);
      scheduleTickUpdate();
    });
  };
  scheduleTickUpdate();

  /*var Server = supercolliderjs.scsynth;
  var s = new Server(options);
  s.boot();*/

  //console.log("resolveOptions done");
  //console.log("options");
  //console.log(options);

});
