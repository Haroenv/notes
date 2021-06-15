import { NotesUi } from './notes-ui';
import { Trie } from './searcher';

export function benchmark(notes: NotesUi) {
  function inner(query: string, title: string, trie: Trie) {
    console.group(`${query} in ${title}`);

    console.time('    trie');
    const viaTrie = trie.includes(query);
    console.timeEnd('    trie');

    console.time('includes');
    const viaIncludes = trie._includesWithoutTrie(query);
    console.timeEnd('includes');

    console.log('output', { viaTrie, viaIncludes });
    console.groupEnd();
  }

  for (const { title } of notes.notes) {
    for (const note of notes.notes) {
      const trie = new Trie(note);
      inner(title, note.title, trie);
    }
  }
}
