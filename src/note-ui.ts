import { Note } from './note';
import { NotesUi } from './notes-ui';
import { Searcher } from './searcher';

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
  #parent: NotesUi;
  #searcher: Searcher;

  #container: HTMLElement;
  #explicitLinksDOM: HTMLElement;
  #implicitLinksDOM: HTMLElement;
  #textareaDOM: HTMLTextAreaElement;

  constructor(
    container: HTMLElement,
    note: Note,
    parent: NotesUi,
    searcher: Searcher
  ) {
    this.#container = container;
    this.#note = note;
    this.#parent = parent;
    this.#searcher = searcher;

    const article = document.createElement('article');
    article.id = note.title;

    const title = document.createElement('h2');
    title.append(note.title);

    this.#textareaDOM = document.createElement('textarea');
    this.#textareaDOM.value = note.content;
    this.#textareaDOM.addEventListener('input', (e) => {
      e.preventDefault();
      parent.update({
        ...this.#note,
        content: (e.target as HTMLTextAreaElement).value,
      });
    });

    this.#explicitLinksDOM = createLinksDOM('Explicit links', note.links);
    this.#implicitLinksDOM = document.createElement('section');

    article.append(
      title,
      this.#textareaDOM,
      this.#explicitLinksDOM,
      this.#implicitLinksDOM
    );

    this.#container.append(article);

    parent.onChange(this.#updateImplicitLinksDOM);
  }

  update = (newNote: Note) => {
    const oldNote = this.#note;
    this.#note = newNote;

    if (oldNote.content !== newNote.content) {
      this.#textareaDOM.value = newNote.content;
    }

    // updates more than technically needed, but replaceWith in DOM is efficient enough

    {
      const linksDOM = createLinksDOM('Explicit links', newNote.links);
      this.#explicitLinksDOM.replaceWith(linksDOM);
      this.#explicitLinksDOM = linksDOM;
    }

    this.#updateImplicitLinksDOM();
  };

  #updateImplicitLinksDOM = () => {
    const links = this.#searcher
      .findLinks(this.#note, this.#parent.notes)
      .map((note) => note.title);

    const linksDOM = createLinksDOM('Implicit links', links);
    this.#implicitLinksDOM.replaceWith(linksDOM);
    this.#implicitLinksDOM = linksDOM;
  };
}
