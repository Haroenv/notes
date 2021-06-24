import { Note } from './note';
import { Trie } from './searcher';

export function benchmark(notes: Note[]) {
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

  for (const { title } of notes) {
    for (const note of notes) {
      const trie = new Trie(note.content);
      inner(title, note.title, trie);
    }
  }
}
