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
    outputChannel = this.create_output_channel(params.outputChannel);

    this.createPat();
    patch = this.createPatch();

    store.subscribe(this);

    ^this;
  }
  
  create_output_channel {
    arg parentOutputChannel;
    ^MixerChannel.new(
      "TawController",
      Server.default,
      2, 2,
      outbus: parentOutputChannel
    );
  }

  createPat {
    
  }

  createPatch {
    ^Patch("cs.synths.SineBeep");
  }

  preparePatch {
    
  }

  scheduleNextBeat {
    var noteBeat,
      noteLatency;
    
    //"scheduleNextBeat".postln();

    this.preparePatch();
    noteBeat = clock.nextTimeOnGrid(
      currentState.meter.beatDur,
      0
    );
    noteLatency = clock.beats2secs(noteBeat) - clock.seconds;
    //noteLatency = clock.timeToNextBeat();
    patch.playToMixer(
      outputChannel,
      atTime: noteLatency
    );

  }

  playBeat {
    patch.playToMixer(
      outputChannel
    );
  }

  queue {
    //"TawSequencer.queue".postln();
    patch.playToMixer(
      outputChannel,
      atTime: clock.beats2secs(clock.nextBar) - clock.seconds
    );
    clock.playNextBar({
      //"playing first beat".postln();
      //this.playBeat();
      store.dispatch((
        type: "SEQUENCE_PLAYING",
        name: name
      ));
    });
  }

  queueStop {
    clock.playNextBar({
      store.dispatch((
        type: "SEQUENCE_STOPPED",
        name: name
      ));
    });
  }

  play {
    var noteLatency,
      me = this;

    //"play".postln();

    clock.play({
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
    if (currentState.playingState == "STOPPED" && newState.playingState == "QUEUED", {
      this.queue();
    });

    if (currentState.playingState == "QUEUED" && newState.playingState == "PLAYING", {
      this.play();    
    });

    if (currentState.playingState == "PLAYING" && newState.playingState == "STOP_QUEUED", {
      this.queueStop();    
    });

    if (newState.playingState == "PLAYING", {
      if (newState.transport.beat != currentState.transport.beat, {
        this.scheduleNextBeat();    
      });
    });

    currentState = newState;
  }

}
