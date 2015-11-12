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

  queueToNextBar {
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
    {
      noteLatency.wait();
      store.dispatch((
        type: "SEQUENCE_PLAYING",
        name: name
      ));
    }.fork();
  }

  handleStateChange {
    var state = store.getState();
    var newPlayingState;

    // if playing state has changed
    newPlayingState = state.sequencers[name.asSymbol()].playingState;
    if (playingState != newPlayingState, {
      if (playingState == "STOPPED" && newPlayingState == "QUEUED", {
        this.queueToNextBar();
      });

      playingState = newPlayingState;
    });

  }

}
