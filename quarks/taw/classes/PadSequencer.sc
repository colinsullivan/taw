PadSequencer : TawSequencer {
  init {
    arg params;
    super.init(params);
  }

  createPatch {
    ^Patch("cs.fm.Pad.SoftKick", (
      freq: 440,
      gate: 1
    ));
  }

  preparePatch {
    super.preparePatch();
    patch = this.createPatch();
  }
}
