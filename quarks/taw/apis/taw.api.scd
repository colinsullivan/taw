(
  init: {
    arg reply, initialState;
    var tawController = TawController.getInstance();
    tawController.initFromAPI(initialState);
    reply.value((status: "ok"));
  },

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
  },
  scheduleAction: {
    arg reply, action, quant;
    var tawController = TawController.getInstance();
    tawController.scheduleAction(action, quant, {
      reply.value();
    });
  },
  dispatch: {
    arg reply, action;
    var tawController = TawController.getInstance();
    tawController.store.dispatch(action);
    reply.value();
  },
  setState: {
    arg reply, state;
    var tawController = TawController.getInstance();
    tawController.store.setState(state);
    reply.value();
  }
);
