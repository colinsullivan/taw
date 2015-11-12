StateStore {
  var state,
    subscribers;

  *new {
    arg initialState;
    ^super.new.init(initialState);
  }

  init {
    arg initialState;

    state = initialState;

    subscribers = List.new();

    ^this;
  }

  dispatch {
    arg action;
    "action:".postln;
    action.postln;
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

    "setState".postln();

    state = newState;

    subscribers.do({
      arg subscriber;

      subscriber.handleStateChange();
    });
  }
}
