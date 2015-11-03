
TawController {
  classvar <>instance;

  var <>clock,
    <>playCallback,
    // MixerChannel instance
    <>outputChannel,
    <>patch;

  *new {
    arg params;

    ^super.new.init(params);
  }
  
  create_output_channel {
    ^MixerChannel.new(
      "TawController",
      Server.default,
      2, 2,
      outbus: 0
    );
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
    
    this.outputChannel = this.create_output_channel();
    
    Instr("SineBeep", {
      arg freq = 440, amp = 0.5;

      var out,
        envShape;

      envShape = Env.perc(0.01, 0.2);

      out = SinOsc.ar(freq);

      out = EnvGen.ar(envShape) * [out, out];
    });
    this.patch = Patch("SineBeep");

    ^this;
  }

  handlePlayCallback {
    arg beats, time, clock;
    var t = this.clock,
      noteBeat,
      noteLatency;

    "TawController.handlePlayCallback".postln();
    
    noteBeat = t.beatsPerBar + t.nextTimeOnGrid(
      1,
      0
    );
    noteLatency = t.beats2secs(noteBeat) - t.seconds;
    this.patch.playToMixer(
      this.outputChannel,
      atTime: noteLatency
    );

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
