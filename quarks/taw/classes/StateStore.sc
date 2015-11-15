
StateStore {
  var state,
    subscribers,
    jsServer;

  *new {
    arg initialState;
    ^super.new.init(initialState);
  }
  init {
    arg initialState;

    state = initialState;

    subscribers = List.new();

    jsServer = Server.new(\tawNode, NetAddr.new("127.0.0.1", 3334))

    ^this;
  }

  dispatch {
    arg action;
    var actionPairs = action.getPairs();
    jsServer.listSendMsg(["/dispatch"] ++ actionPairs);
  }

  subscribe {
    arg newSubscriber;
    subscribers.add(newSubscriber);
  }

  getState {
    ^state;
  }

  setState {
    arg newState;

    //"setState".postln();

    state = newState;

    subscribers.do({
      arg subscriber;

      subscriber.handleStateChange();
    });
  }
}
