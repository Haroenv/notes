type Listener<State> = (state: State) => void;

type IAction = {
  type: string;
  payload: any;
};

type Reducer<State, Action> = (state: State, action: Action) => State;

export class StateContainer<State, Action extends IAction> {
  #state: State;
  #reducer: Reducer<State, Action>;
  #listeners: Array<Listener<State>> = [];

  constructor(reducer: Reducer<State, Action>, initialState: State) {
    this.#reducer = reducer;
    this.#state = initialState;
  }

  get state() {
    return this.#state;
  }

  subscribe(callback: Listener<State>): () => void {
    const index = this.#listeners.push(callback);

    return () => {
      this.#listeners.splice(index, 1);
    };
  }

  dispatch(action: Action) {
    this.#state = this.#reducer(this.#state, action);
    this.#listeners.forEach((listener) => listener(this.#state));
  }
}
