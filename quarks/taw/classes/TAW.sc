TawController {
  classvar <>instance;

  var <>clock,
    <>playCallback;

  *new {
    arg params;

    ^super.new.init(params);
  }

  init {
    arg params;
    var me = this;

    "TawController.init".postln();

    this.clock = TempoClock.default;

    this.playCallback = {
      arg beats, time, clock;
      me.handlePlayCallback(beats, time, clock);
    };

    ^this;
  }

  handlePlayCallback {
    arg beats, time, clock;

    "TawController.handlePlayCallback".postln();

    [beats, time, clock].postln();
  }

  play {
    arg task;
    "TawController.play".postln();
    this.clock.play(this.playCallback);
    this.clock.play(task);
  }

  *getInstance {

    "TawController.getInstance".postln();

    "this.instance:".postln;
    this.instance.postln;
    if (this.instance == nil, {
      this.instance = TawController.new(());
    });

    ^this.instance;
  }
}
