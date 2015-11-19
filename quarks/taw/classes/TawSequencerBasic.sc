TawSequencerBasic : TawSequencer {
  var freqControl;

  createPatch {
    freqControl = KrNumberEditor(440, \freq);
    ^Patch("cs.synths.SineBeep", (
      freq: freqControl
    ));
  }

  playBeat {
    if (currentState.transport.beat == 0, {
      freqControl.value = 880;    
    }, {
      freqControl.value = 440;
    });
    super.playBeat();
  }
}
