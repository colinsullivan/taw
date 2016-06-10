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
      "TawSequencer[" ++ currentState.name ++ "]" ,
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

    patch.stop();

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

  scheduleMeterChange {
    var changeBeat;

    clock.playNextBar({
      // if we're still queued (TODO: some race conditions here)
      if (currentState.queuedMeter != false, {
        store.dispatch((
          type: "SEQUENCER_METER_UPDATED",
          name: currentState.name,
          numBeats: currentState.queuedMeter.numBeats,
          beatDur: currentState.queuedMeter.beatDur
        ));
      });
    });
  }

  queue {
    //"TawSequencer.queue".postln();
    this.preparePatch();
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

      // make sure we haven't stopped already (this may have been scheduled
      // before sequencer was actually stopped)
      if (currentState.playingState != "STOPPED", {
        store.dispatch((
          type: "SEQUENCER_TRANSPORT_UPDATED",
          beat: (currentState.transport.beat + 1) % currentState.meter.numBeats,
          name: name
        ));
      });

      // if we're playing, schedule next.
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

      /*(
        "[TAWSequencer (" + name + ")]: Playing state has changed from "
        + currentState.playingState + "->" + newState.playingState
      ).postln();*/

      switch(newState.playingState)
        {"QUEUED"} {
          this.queue();
        }
        {"PLAYING"} {
          this.play();
        }
        {"STOP_QUEUED"} {
          this.queueStop();
        }
    });

    // if we are playing and the transport changes
    if (
      newState.transport.beat != currentState.transport.beat
      && newState.playingState == "PLAYING", {
      //("[TAWSequencer (" + name + ")]: Transport has changed.").postln();
      // schedule next beat
      this.scheduleNextBeat();
    });

    // if a meter update needs to be queued
    if (newState.queuedMeter != false, {
      this.scheduleMeterChange();
    });


    currentState = newState;
  }

}
