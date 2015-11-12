TawSequencer {

  var <name,
    clock,
    store,
    patch,
    outputChannel,
    playingState;
  
  *new {
    arg params;

    ^super.new.init(params);
  }

  init {
    arg params;
    var instr,  
      state,
      initialState;

    store = params.store;
    state = store.getState();
    name = params.name;

    initialState = state.sequencers[name.asSymbol()];

    playingState = initialState[\playingState];

    clock = TempoClock.new(state.tempo, 0, 0);

    //quant = 4;
    //numBeats = 16;
    //currentBeat = 0;
    outputChannel = params.outputChannel;

    patch = Patch("cs.synths.SineBeep");

    store.subscribe(this);

    ^this;
  }

  scheduleNextBeat {
    arg clock;

    var noteBeat,
      noteLatency;

    noteBeat = clock.beatsPerBar + clock.nextTimeOnGrid(
      0,
      0
    );
    noteLatency = clock.beats2secs(noteBeat) - clock.seconds;
    patch.playToMixer(
      outputChannel,
      atTime: noteLatency
    );

  }

  handleStateChange {
    var state = store.getState();

    "playingState:".postln;
    playingState.postln;


    // if playing state has changed
    if (playingState != state.sequencers[name.asSymbol()].playingState, {
      "playing state has changed".postln();    
    });

  }

}
