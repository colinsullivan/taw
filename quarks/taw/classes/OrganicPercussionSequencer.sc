OrganicPercussionSequencer : TawSequencer {
  var pat,
    baseFreq,
    noteDurationControl,
    doFreqSweepControl,
    freqSweepTargetControl,
    freqControl;


  init {
    arg params;
    baseFreq = "A4".notemidi().midicps();
    super.init(params);
    outputChannel.level = 0.2;
  }

  createPat {
    pat = Pbind(
      \scale, Scale.aeolian,
      \degree, Pshuf((0..currentState.meter.numBeats), inf)
    ).asStream();
  }

  createPatch {
    freqControl = KrNumberEditor(440, \freq);
    noteDurationControl = KrNumberEditor(0.1, ControlSpec.new(0.1, 2.0));
    doFreqSweepControl = KrNumberEditor(0, \unipolar);
    freqSweepTargetControl = KrNumberEditor(0.5, ControlSpec.new(0.5, 2.0));
    ^Patch("cs.fm.OrganicPercussion", (
      autoDurationOn: 0,
      noteDuration: noteDurationControl,
      doFreqSweep: doFreqSweepControl,
      freqSweepTargetMultiplier: freqSweepTargetControl,
      gate: 1,
      freq: freqControl
    ));
  }

  preparePatch {
    var e = pat.next(());
    super.preparePatch();
    //patch.releaseArgs;
    freqControl.value = e.scale.degreeToFreq(e.degree, baseFreq, 1);
    noteDurationControl.value = exprand(
      0.1,
      2.0 * (1.0 / currentState.meter.numBeats)
    );
    doFreqSweepControl.value = [1, 0].wchoose([0.2, 0.8]);
    freqSweepTargetControl.value = [0.5, 2.0].choose();
    //patch = this.createPatch();
  }

  handleStateChange {
    var state = store.getState();
    var newState = state.sequencers[name.asSymbol()];
    
    if (newState.meter.numBeats != currentState.meter.numBeats, {
      this.createPat();
    });

    super.handleStateChange();
  }
}
