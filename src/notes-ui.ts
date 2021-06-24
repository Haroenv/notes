import { Action, State } from './main';
import { createNote, Note } from './note';
import { NoteUi } from './note-ui';
import { StateContainer } from './state';

export class NotesUi {
  #state: StateContainer<State, Action>;
  #container: HTMLElement;
  #notesContainer: HTMLElement;
  #children: Map<string, { ui: NoteUi; container: HTMLElement }> = new Map();

  constructor(container: HTMLElement, state: StateContainer<State, Action>) {
    this.#container = container;
    this.#state = state;

    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = 'Create new note';
    button.addEventListener('click', () => {
      let title = '';
      while (!title) {
        title = prompt('Title for the new note') || '';
      }

      state.dispatch({
        type: 'add',
        payload: [createNote({ title })],
      });
    });

    this.#notesContainer = document.createElement('div');
    this.#notesContainer.classList.add('notes-container');

    this.#container.append(this.#notesContainer, button);

    this.#state.subscribe(this.#change);
  }

  #change = (nextState: State) => {
    this.#children.forEach((child, key) => {
      if (nextState.notes.every(({ title }) => title !== key)) {
        child.ui.destroy();
        this.#notesContainer.removeChild(child.container);
        this.#children.delete(key);
      }
    });

    // assuming the order doesn't change
    nextState.notes.forEach((note) => {
      const existing = this.#children.get(note.title);

      if (!existing) {
        this.#createChild(note);
      }
    });
  };

  #createChild(note: Note) {
    const container = document.createElement('div');
    const ui = new NoteUi(container, note, this.#state);

    this.#notesContainer.appendChild(container);

    const child = { ui, container };

    this.#children.set(note.title, child);

    return child;
  }
}
