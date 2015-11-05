
TawController {
  classvar <>instance;

  var <>clock,
    <>tickClock,
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
    var now = thisThread.clock.seconds;
    var tempo = 1;
    var tickClock;

    "TawController.init".postln();

    this.clock = TempoClock.new(tempo, 0, now);
    //this.clock.tempo = 150.0/60.0;
    this.tickClock = TempoClock.new(tempo * 32.0, 0, now);
    tickClock = this.tickClock;
    this.tickClock.schedAbs(0, {
      tickClock.beatsPerBar = 32;
    });

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

    //"TawController.handlePlayCallback".postln();
    
    noteBeat = t.beatsPerBar + t.nextTimeOnGrid(
      0,
      0
    );
    noteLatency = t.beats2secs(noteBeat) - t.seconds;
    this.patch.playToMixer(
      this.outputChannel,
      atTime: noteLatency
    );

    //[beats, time, clock].postln();
  }

  play {
    arg task;
    var eventBeat, eventTime;
    "TawController.play".postln();

    eventBeat = this.clock.nextTimeOnGrid(1, 0);
    "eventBeat:".postln;
    eventBeat.postln;

    this.clock.play(this.playCallback);
    this.clock.play(task);
  }

  onNextTick {
    arg task;
    this.tickClock.sched(1, task);
  }

  scheduleAction {
    arg action, quant, task;
    // TODO: use quant to select clock
    this.clock.sched(1, task);
  }

  *getInstance {

    //"TawController.getInstance".postln();

    //"this.instance:".postln;
    //this.instance.postln;
    if (this.instance == nil, {
      this.instance = TawController.new(());
    });

    ^this.instance;
  }
}
