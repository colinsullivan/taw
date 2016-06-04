(
  init: {
    arg reply, initialState;
    var tawController = TawController.getInstance();
    "taw.api.init:".postln;
    tawController.initFromAPI(initialState);
    reply.value((status: "ok"));
  },
  setState: {
    arg reply, state;
    var tawController = TawController.getInstance();
    "taw.api.setState".postln;
    tawController.store.setState(state);
    reply.value();
  }
);
