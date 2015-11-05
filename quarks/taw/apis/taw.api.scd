(
  playNote: { arg reply;
    var tawController = TawController.getInstance();
    /*tawController.play();*/
    tawController.play({
      reply.value((
        beats: tawController.clock.beats
      ));
    });
  },
  onNextTick: {
    arg reply;
    var tawController = TawController.getInstance();
    tawController.onNextTick({
      reply.value((
        beats: tawController.clock.beatInBar,
        tick: tawController.tickClock.beatInBar
      ));
    });
  }
);
