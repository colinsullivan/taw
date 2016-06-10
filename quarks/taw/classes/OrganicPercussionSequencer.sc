OrganicPercussionSequencer : TawSequencer {
  var pat;
  var baseFreq;

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
    var e = pat.next(());
    ^Patch("cs.fm.OrganicPercussion", (
      autoDurationOn: 0,
      noteDuration: exprand(0.1,  2.0 * (1.0 / currentState.meter.numBeats)),
      doFreqSweep: [1, 0].wchoose([0.2, 0.8]),
      freqSweepTargetMultiplier: [0.5, 2.0].choose(),
      gate: 1,
      freq: e.scale.degreeToFreq(e.degree, baseFreq, 1)
    ));
  }

  preparePatch {
    super.preparePatch();
    patch.invalidateSynthDef;
    patch = this.createPatch();
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
