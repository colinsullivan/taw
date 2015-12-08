RightSequencer : TawSequencer {

  var bufManager;

  init {
    arg params;

    bufManager = params[\bufManager];
    super.init(params);

    outputChannel.level = 0.2;
  }

  createPatch {
    var kickBuf = bufManager.bufs[\lukekick];
    
    ^Patch("cs.sfx.PlayBuf", (
      buf: kickBuf,
      gate: 1,
      attackTime: 0.00,
      releaseTime: 0.00,
      amp: 1.0,
      playbackRate: 1.0
    ));
  }

  preparePatch {
    super.preparePatch();
    patch = this.createPatch();
  }

}

