# Notes application

This minimal application can be used to take some notes that will list the links (mentions) of other pages in a fairly efficient way.

Special note has been made in organising the UI components (NotesUi and NoteUi) to efficiently update only the changed DOM without virtual DOM, and a minimal event emitter pattern for keeping those components updated without specialised state library.

## Running the application

```sh
$ yarn
$ yarn dev
```

## Production mode

```sh
$ yarn build
$ cd dist
```

## File layout

- main.ts: runtime
- note-ui.ts and notes-ui.ts: ui components
- searcher.ts: search index trie, used to generate links between notes
- bench.ts: a small benchmark between different approaches for generating links

## Future improvements

- allowing to change other properties than content
- deleting notes
- saving notes in localStorage (can be done by adding a change listener to NotesUi)
- finding out why the search trie isn't as efficient as expected
- using match index to highlight links in text
