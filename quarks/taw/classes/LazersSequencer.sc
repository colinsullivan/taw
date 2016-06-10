LazersSequencer : TawSequencer {
  var modIndexControl,
    mod2IndexControl,
    gateControl,
    freqControl;
 
  init {
    arg params;

    modIndexControl = KrNumberEditor(0, ControlSpec.new(0, 10));
    mod2IndexControl = KrNumberEditor(0, ControlSpec.new(0, 10));
    gateControl = KrNumberEditor(1, \gate);
    freqControl = KrNumberEditor(440, \freq);
    
    super.init(params);

    outputChannel.level = 0.2;
  }
    
  createPatch {
    gateControl = KrNumberEditor(rrand(0.2, 1.0), \gate);
    ^Patch("cs.fm.Lazers", (
      modIndex: modIndexControl,
      mod2Index: mod2IndexControl,
      gate: gateControl,
      freq: freqControl
    ));
  }

  preparePatch {
    super.preparePatch();

    patch = this.createPatch();
    if (currentState.transport.beat == 0, {
      modIndexControl.value = 1.12004;
      mod2IndexControl.value = 0.254175;
      freqControl.value = 880;
    }, {
      modIndexControl.value = exprand(0.01, 6);
      mod2IndexControl.value = exprand(0.02, 6);
      freqControl.value = 440;
    });
  }
}
