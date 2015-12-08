TawController {
  classvar <>instance;

  var <>clock,
    <>tickClock,
    <>playCallback,
    // MixerChannel instance
    outputChannel,
    <>patch,
    <>state,
    <>store,
    <>sequencers,
    sounds,
    //dispatchListener,
    sequencerNameToClass,
    bufManager,
    ambientSoundscape;


  *new {
    arg params;

    ^super.new.init(params);
  }

  init {
    arg params;
    var me = this;
    var now = thisThread.clock.seconds;
    var tempo = 150.0/60.0;
    var tickClock;
    var projDir = File.getcwd();

    "TawController.init".postln();

    outputChannel = MixerChannel.new(
      "TawController",
      Server.default,
      2, 2,
      outbus: 0
    );

    outputChannel.level = 0.25;

    //  create the buffer manager that will load the samples we need for this
    //  patch.
    bufManager = BufferManager.new().init((
      rootDir: projDir +/+ "sounds"
    ));

    //ambientSoundscape = Soundscape.new().init((
      //bufManager: bufManager,
      //outbus: outputChannel
    //));

    sequencerNameToClass = (
      zaps: LazersSequencer,
      orgperc: OrganicPercussionSequencer,
      pad: RightSequencer
    );


    //this.clock = TempoClock.new(tempo, 0, now);
    //this.clock.tempo = 150.0/60.0;
    /*this.tickClock = TempoClock.new(tempo * 32.0, 0, now);
    tickClock = this.tickClock;
    this.tickClock.schedAbs(0, {
      tickClock.beatsPerBar = 32;
    });*/

    /*this.playCallback = {
      arg beats, time, clock;
      me.handlePlayCallback(beats, time, clock);
    };*/

    //this.tickClock.play(this.playCallback);

    this.sequencers = List.new();
    sounds = List.new();


    /*dispatchListener = OSCFunc.newMatching({
      arg msg, time, addr, recvPort;

      "msg:".postln;
      msg.postln;
    }, "/dispatch", NetAddr.new("127.0.0.1", 3333));*/
    
    ^this;
  }

  initSequencer {
    arg sequencer;

    this.sequencers.add(
      sequencerNameToClass[sequencer.name.asSymbol()].new((
        store: this.store,
        name: sequencer.name,
        outputChannel: outputChannel,
        bufManager: bufManager
      ))
    );
  }

  initSound {
    arg sound;

    sounds.add(
      QueuableSound.new((
        store: this.store,
        name: sound.name,
        outputChannel: outputChannel,
        bufManager: bufManager
      ));
    );
  }

  initFromAPI {
    arg initialState;
    var state,
      me = this;

    this.store = StateStore.new(initialState);
    state = this.store.getState();

    TempoClock.default.tempo = state.tempo / 60.0;

    // TODO: Kill any currently running sequencers

    // load all bufs
    "loading buffers...".postln();
    bufManager.load_bufs(state.bufferList, {
      "initializing sounds...".postln();
      state.sounds.do({
        arg sound;
        me.initSound(sound);
      });

      "initializing sequencers...".postln();
      // create sequencers
      state.sequencers.do({
        arg sequencer;
        "sequencer:".postln;
        sequencer.postln;
        me.initSequencer(sequencer);
      });


    });


  
    
    //this.clock.play(this.playCallback);
  }

  handlePlayCallback {
    arg beats, time, clock;

    "TawController.handlePlayCallback".postln();
    
    //this.sequencers[0].scheduleNextBeat(clock);

    [beats, time, clock].postln();

    ^1.0;
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
    this.clock.playNextBar(task);
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
