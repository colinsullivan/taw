TawSequencer {

  var <quant,
    <numBeats,
    <currentBeat,
    patch,
    outputChannel,
    <>playing;
  
  *new {
    arg params;

    ^super.new.init(params);
  }

  init {
    arg params;
    var instr;

    quant = 4;
    numBeats = 16;
    currentBeat = 0;
    outputChannel = params.outputChannel;

    playing = false;

    patch = Patch("cs.synths.SineBeep");

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

}
