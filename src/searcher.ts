import { Note } from './note';

type TrieNode = {
  [token: string]: TrieNode;
};

const separator = /\b/;

export class Trie {
  #text: string;
  #trie: TrieNode = {};

  constructor(text: string) {
    this.#text = text;

    const words = Trie.#splitWords(Trie.#normalize(text));
    words.forEach((word) => {
      this.#insertWord(Trie.#split(word));
    });
  }

  static #normalize(word: string): string {
    return word
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase();
  }

  static #splitWords(sentence: string): string[] {
    return sentence.split(separator).filter((word) => separator.test(word));
  }

  static #split(word: string): string[] {
    // todo: use grapheme instead of characters, for letters that are > 1 character, like 🇧🇪
    return word.split('');
  }

  #insertWord(tokens: string[], subtrie = this.#trie): void {
    const [first, ...rest] = tokens;
    if (!first) {
      return;
    }

    subtrie ??= {};
    subtrie[first] ??= {};

    return this.#insertWord(rest, subtrie[first]);
  }

  #_includes(tokens: string[], subtrie = this.#trie): boolean {
    // get the first character
    const [first, ...rest] = tokens;

    // query done: prefix match
    if (!first) {
      return true;
    }

    // query not done, check if words continue
    if (subtrie[first]) {
      return this.#_includes(rest, subtrie[first]);
    }

    // womp, womp, no match
    return false;
  }

  /**
   * Checks whether all words in the query are present in the content
   */
  includes(query: string) {
    const words = Trie.#splitWords(Trie.#normalize(query));
    return words.every((word) => this.#_includes(Trie.#split(word)));
  }

  // technically this is faster in the cases of this project.
  // I assume this might be due to object creation and prototype chain, but did not investigate deeply.
  // I still chose #_includes, since I wanted to implement a real search index.
  _includesWithoutTrie(query: string) {
    return this.#text.includes(Trie.#normalize(query));
  }
}

export class Searcher {
  #tries: Map<string, Trie>;

  constructor() {
    this.#tries = new Map();
  }

  update(note: Note): Trie {
    // could be more efficient and update only the changed parts of the trie
    // but that's overkill for now
    const trie = new Trie(note.content);
    this.#tries.set(note.title, trie);
    return trie;
  }

  #getTrie(note: Note): Trie {
    const existingTrie = this.#tries.get(note.title);
    if (existingTrie) {
      return existingTrie;
    }

    return this.update(note);
  }

  /**
   * get all notes that link to the target
   */
  findIncomingLinks(target: Note, notes: Note[]) {
    return notes.filter((note) => {
      if (note.title === target.title) {
        return false;
      }
      const trie = this.#getTrie(note);
      return trie.includes(target.title);
    });
  }

  /**
   * get all links present in target
   */
  findOutgoingLinks(target: Note, notes: Note[]) {
    const trie = this.#getTrie(target);

    return notes.filter((note) => {
      if (note.title === target.title) {
        return false;
      }
      return trie.includes(note.title);
    });
  }
}
