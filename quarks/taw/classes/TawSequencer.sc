TawSequencer {

  var <name,
    clock,
    store,
    patch,
    outputChannel,
    currentState;
  
  *new {
    arg params;

    ^super.new.init(params);
  }

  init {
    arg params;
    var instr,  
      state;

    store = params.store;
    state = store.getState();
    name = params.name;

    currentState = state.sequencers[name.asSymbol()];


    //clock = TempoClock.new(state.tempo / 60.0, 0, 0);
    /*AppClock.sched(0, {
      clock.gui();
    });*/

    //quant = 4;
    //numBeats = 16;
    //currentBeat = 0;
    clock = TempoClock.default();
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
    //"TawSequencer.startPlayingNextBar".postln();
    clock.playNextBar({
      //"playing first beat".postln();
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
        type: "SEQUENCER_TRANSPORT_UPDATED",
        beat: (currentState.transport.beat + 1) % currentState.meter.numBeats,
        name: name
      ));
      if (currentState.playingState == "PLAYING", {
        currentState.meter.beatDur;
      }, {
        nil;
      });
    });
  }

  handleStateChange {
    var state = store.getState();
    var newState;

    //"TawSequencer.handleStateChange".postln();

    newState = state.sequencers[name.asSymbol()];

    // if playing state has changed
    if (currentState.playingState != newState.playingState, {

      if (currentState.playingState == "STOPPED" && newState.playingState == "QUEUED", {
        this.startPlayingNextBar();
      });

      if (currentState.playingState == "QUEUED" && newState.playingState == "PLAYING", {
        this.startPlaying();    
      });

    });

    currentState = newState;
  }

}
