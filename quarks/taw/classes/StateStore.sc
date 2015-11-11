StateStore {
  var state;

  *new {
    arg initialState;
    ^super.new.init(initialState);
  }

  init {
    arg initialState;

    state = initialState;

    ^this;
  }

  dispatch {
    arg action;
  }

  getState {
    ^state;
  }
}
