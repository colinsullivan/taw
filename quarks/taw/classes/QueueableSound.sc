QueuableSound {
  var currentState,
    clock,
    outputChannel,
    store,
    name,
    patch;

  *new {
    arg params;
    ^super.new.init(params);
  }

  init {
    arg params;


    store = params.store;
    name = params.name;
    currentState = store.getState().sounds[params.name.asSymbol()];

    clock = TempoClock.default();
    outputChannel = this.create_output_channel(params.outputChannel);
    patch = this.createPatch();
    store.subscribe(this);

    ^this;
  }
  create_output_channel {
    arg parentOutputChannel;
    ^MixerChannel.new(
      "QueueableSound[" ++ currentState.name ++ "]" ,
      Server.default,
      2, 2,
      outbus: parentOutputChannel
    );
  }
  createPatch {
    ^Patch("cs.synths.SineBeep");
  }
  queue {
    "QueueableSound.queue".postln();
    patch.playToMixer(
      outputChannel,
      atTime: clock.beats2secs(clock.nextBar) - clock.seconds
    );
    clock.playNextBar({
      //"playing first beat".postln();
      //this.playBeat();
      store.dispatch((
        type: "SOUND_PLAYING",
        name: name
      ));
    });
  }

  queueStop {
    store.dispatch((
      type: "SOUND_STOP_QUEUED",
      name: name
    ));
    clock.playNextBar({
      store.dispatch((
        type: "SOUND_STOPPED",
        name: name
      ));
    });
  }

  //play {
    //var noteLatency,
      //me = this;

    ////"play".postln();

    //clock.play({
      //store.dispatch((
        //type: "SEQUENCER_TRANSPORT_UPDATED",
        //beat: (currentState.transport.beat + 1) % currentState.meter.numBeats,
        //name: name
      //));
      //if (currentState.playingState == "PLAYING", {
        //currentState.meter.beatDur;
      //}, {
        //nil;
      //});
    //});
  //}
  handleStateChange {
    var newState;

    //"QueueableSound.handleStateChange".postln();

    newState = store.getState().sounds[name.asSymbol()];

    // if playing state has changed
    if (currentState.playingState == "STOPPED" && newState.playingState == "QUEUED", {
      this.queue();
    });

    if (currentState.playingState == "QUEUED" && newState.playingState == "PLAYING", {
      this.queueStop();    
    });

    //if (currentState.playingState == "PLAYING" && newState.playingState == "STOP_QUEUED", {
    //});

    currentState = newState;
  }
}
