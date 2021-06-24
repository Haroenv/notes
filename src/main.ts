import { NotesUi } from './notes-ui';
import { Note } from './note';
import { StateContainer } from './state';
import { Searcher } from './searcher';
import { DEFAULT_NOTES } from './constants';
import './style.css';

export type Action =
  | { type: 'add'; payload: Note[] }
  | { type: 'update'; payload: Note }
  | { type: 'remove'; payload: Note };
export type State = {
  notes: Note[];
  searcher: Searcher;
};

const state = new StateContainer<State, Action>(
  (state, action) => {
    switch (action.type) {
      case 'add': {
        return {
          ...state,
          notes: [...state.notes, ...action.payload],
        };
      }
      case 'update': {
        return {
          ...state,
          notes: state.notes.map((note) => {
            if (note.title === action.payload.title) {
              state.searcher.update(action.payload);
              return action.payload;
            }
            return note;
          }),
        };
      }
      case 'remove': {
        return {
          ...state,
          notes: state.notes.filter(
            (note) => note.title !== action.payload.title
          ),
        };
      }
      default: {
        return state;
      }
    }
  },
  { notes: [], searcher: new Searcher() }
);

new NotesUi(document.querySelector('main')!, state);

state.dispatch({
  type: 'add',
  payload: DEFAULT_NOTES,
});
