QueuableSound {
  var currentState,
    clock,
    outputChannel,
    store,
    name,
    bufManager,
    currentlyPlayingBuf,
    patch;

  *new {
    arg params;
    ^super.new.init(params);
  }

  init {
    arg params;


    store = params.store;
    name = params.name;
    bufManager = params.bufManager;
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
    var buf;
    buf = bufManager.bufs[currentState.bufName.asSymbol()];

    ^Patch("cs.sfx.PlayBuf", (
      buf: buf,
      gate: 1,
      attackTime: 0.01,
      releaseTime: 0.01,
      amp: 1.0,
      playbackRate: 1.0
    ));
  }
  queue {
    var t;
    "QueueableSound.queue".postln();
    patch = this.createPatch();
    t = clock.beats2secs(clock.nextBar) - clock.seconds + currentState.delay;

    patch.playToMixer(
      outputChannel,
      atTime: t
    );

    AppClock.sched(t, {
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
      name: name,
      delay: patch.buf.duration
    ));
  }

  scheduleStop {
    AppClock.sched(patch.buf.duration, {
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
      currentState = newState;
      this.queue();
    });

    if (currentState.playingState == "QUEUED" && newState.playingState == "PLAYING", {
      currentState = newState;
      this.queueStop();    
    });

    if (currentState.playingState == "PLAYING" && newState.playingState == "STOP_QUEUED", {
      currentState = newState;
      this.scheduleStop();
    });

    currentState = newState;

  }
}
