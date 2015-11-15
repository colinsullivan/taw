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
    AppClock.sched(0, {
      clock.gui();
    });

    //quant = 4;
    //numBeats = 16;
    //currentBeat = 0;
    outputChannel = params.outputChannel;

    patch = this.createPatch();

    store.subscribe(this);

    ^this;
  }

  createPatch {
    ^Patch("cs.synths.SineBeep");
  }

  //scheduleNextBeat {
    //var noteBeat,
      //noteLatency;
    
    ////"scheduleNextBeat".postln();

    ////noteBeat = clock.nextTimeOnGrid(
      ////0,
      ////0
    ////);
    ////noteLatency = clock.beats2secs(noteBeat) - clock.seconds;
    //noteLatency = clock.timeToNextBeat();
    //patch.playToMixer(
      //outputChannel,
      //atTime: noteLatency
    //);

  //}

  playBeat {
    patch.playToMixer(
      outputChannel
    );
  }

  startPlayingNextBar {
    clock.playNextBar({
      this.playBeat();
      store.dispatch((
        type: "SEQUENCE_PLAYING",
        name: name
      ));
    });
  }

  startPlaying {
    var noteLatency,
      me = this;

    //"startPlaying".postln();

    clock.play({
      this.playBeat();
      store.dispatch((
        type: "SEQUENCER_CLOCK_UPDATE",
        beats: clock.beats,
        name: name
      ));
      if (store.getState().sequencers[name.asSymbol()].playingState == "PLAYING", {
        1.0;
      }, {
        nil;
      });
    });
  }

  handleStateChange {
    var state = store.getState();
    var newPlayingState;

    //"TawSequencer.handleStateChange".postln();

    // if playing state has changed
    newPlayingState = state.sequencers[name.asSymbol()].playingState;
    if (playingState != newPlayingState, {

      if (playingState == "STOPPED" && newPlayingState == "QUEUED", {
        this.startPlayingNextBar();
      });

      if (playingState == "QUEUED" && newPlayingState == "PLAYING", {
        this.startPlaying();    
      });

      playingState = newPlayingState;
    });

  }

}
