import { createNote, Note } from './note';
import { NoteUi } from './note-ui';
import { Searcher } from './searcher';

export class NotesUi {
  #container: HTMLElement;
  #notesContainer: HTMLElement;
  #notes: Map<string, Note> = new Map();
  #noteUis: Map<string, NoteUi> = new Map();
  #searcher = new Searcher();
  #listeners: Array<() => void> = [];

  constructor(container: HTMLElement) {
    this.#container = container;

    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = 'Create new note';
    button.addEventListener('click', () => {
      let title = '';
      while (!title) {
        title = prompt('Title for the new note') || '';
      }

      this.add(createNote({ title }));
    });

    this.#notesContainer = document.createElement('div');
    this.#notesContainer.classList.add('notes-container');

    this.#container.append(this.#notesContainer, button);
  }

  get notes() {
    return Array.from(this.#notes.values());
  }

  add(...notes: Note[]) {
    const containers: HTMLElement[] = [];

    notes.forEach((note) => {
      const container = document.createElement('div');
      containers.push(container);

      const ui = new NoteUi(container, note, this, this.#searcher);
      this.#noteUis.set(note.title, ui);
      this.#notes.set(note.title, note);
    });

    this.#notesContainer.append(...containers);
    this.#change();
  }

  update(note: Note) {
    const ui = this.#noteUis.get(note.title)!;
    this.#notes.set(note.title, note);
    ui.update(note);
    this.#searcher.update(note)
    this.#change();
  }

  onChange(callback: () => void) {
    this.#listeners.push(callback);
  }

  #change() {
    this.#listeners.forEach((listener) => listener());
  }
}
