import { Action, State } from './main';
import { Note } from './note';
import { StateContainer } from './state';

function createLinksDOM(titleText: string, links: string[]) {
  const section = document.createElement('section');
  const title = document.createElement('h3');
  title.append(titleText);

  const list = document.createElement('ul');
  list.append(
    ...links.map((link) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${link}`;
      a.append(link);
      li.append(a);
      return li;
    })
  );

  section.append(title, list);

  return section;
}

export class NoteUi {
  #note: Note;

  #unsubscribe: () => void;

  #container: HTMLElement;
  #explicitLinksDOM: HTMLElement;
  #implicitLinksDOM: HTMLElement;
  #referencesDOM: HTMLElement;
  #textareaDOM: HTMLTextAreaElement;

  constructor(
    container: HTMLElement,
    note: Note,
    state: StateContainer<State, Action>
  ) {
    this.#container = container;
    this.#note = note;

    const article = document.createElement('article');
    article.id = note.title;

    const title = document.createElement('h2');
    title.append(note.title);

    this.#textareaDOM = document.createElement('textarea');
    this.#textareaDOM.rows = 5;
    this.#textareaDOM.value = note.content;
    this.#textareaDOM.addEventListener('input', (e) => {
      state.dispatch({
        type: 'update',
        payload: {
          ...this.#note,
          content: (e.target as HTMLTextAreaElement).value,
        },
      });
    });

    this.#explicitLinksDOM = createLinksDOM('Links', note.links);
    this.#implicitLinksDOM = document.createElement('section');
    this.#referencesDOM = document.createElement('section');

    article.append(
      title,
      this.#textareaDOM,
      this.#explicitLinksDOM,
      this.#implicitLinksDOM,
      this.#referencesDOM
    );

    this.#container.append(article);

    this.#updateLinks(state.state);
    this.#unsubscribe = state.subscribe(this.#updateLinks);
  }

  destroy() {
    this.#unsubscribe();
  }

  #updateLinks = (state: State) => {
    {
      const references = state.searcher
        .findIncomingLinks(this.#note, state.notes)
        .map((note) => note.title);

      const linksDOM = createLinksDOM('References', references);
      this.#referencesDOM.replaceWith(linksDOM);
      this.#referencesDOM = linksDOM;
    }

    {
      const links = state.searcher
        .findOutgoingLinks(this.#note, state.notes)
        .map((note) => note.title);

      const linksDOM = createLinksDOM('Implicit links', links);
      this.#implicitLinksDOM.replaceWith(linksDOM);
      this.#implicitLinksDOM = linksDOM;
    }
  };
}
