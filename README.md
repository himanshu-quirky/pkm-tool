# Notegrain

Notegrain is a clean, open‑source personal knowledge management (PKM) application inspired by Capacities.io.  It provides a local‑first, object‑based approach to writing and linking notes, projects, people, media and more without any AI components.  Notegrain is designed as a Progressive Web App (PWA) for maximum energy efficiency and simplicity.

## Key Features

- **Object‑based knowledge**: Create notes, links, media, people, projects and other objects, each with their own properties and backlinks.
- **Rich markdown editor**: Write in markdown with a minimal block interface; insert links with `[[double brackets]]` to automatically build backlinks.
- **Backlink panel**: See every reference to an object in context and navigate your graph of knowledge.
- **Tags and properties**: Add tags inline with `#tags` and define key/value properties for any object.
- **Sets and collections**: Group objects into collections and view them as tables, boards or lists.
- **Daily notes & calendar**: Capture your thoughts day by day and browse them in a calendar view.
- **Graph view**: Visualise connections between objects in a lightweight graph.
- **Templates**: Use templates for repeatable structures such as meeting notes or project briefs.
- **Local‑first storage**: Data lives in your browser using IndexedDB via Dexie.  Export or import a JSON backup at any time.
- **Offline PWA**: Install Notegrain as a PWA and work offline; everything syncs once you’re back online.

## Why Notegrain

Capacities.io introduced an object‑oriented approach to note taking.  Notegrain aims to bring these powerful concepts to an open‑source application with a heavy emphasis on energy efficiency.  By avoiding AI services and running completely within the browser, Notegrain consumes minimal resources and respects user privacy.

### Energy‑efficient design

The application is built with SvelteKit and TypeScript, compiled to a tiny bundle with Vite.  State updates are debounced and coalesced, animations respect the user’s `prefers‑reduced‑motion` setting, and heavy operations run in Web Workers.  Caching via a service worker means data loads from disk rather than the network whenever possible.  See `docs/ENERGY.md` for more details.

### Technologies

- **SvelteKit + TypeScript** – reactive UI with minimal runtime overhead.
- **Dexie.js** – wrapper around IndexedDB for robust local persistence.
- **Service Worker** – offline support, caching and installability as a PWA.
- **CSS variables + design tokens** – theming with dark/light modes and reduced motion.

## Installation

Notegrain runs entirely in the browser.  To install locally and contribute:

```bash
# prerequisites: Node.js 20 or later and pnpm
git clone https://github.com/your‑username/notegrain.git
cd notegrain
pnpm install
pnpm --filter apps/web dev
```

This will launch the development server at `http://localhost:5173`.  Build for production with `pnpm --filter apps/web build` and preview with `pnpm --filter apps/web preview`.

## Usage

1. **Create a note** – press `N` on any page or use the new note button.  Give your note a title and start writing.
2. **Link objects** – type `[[` and start typing to search existing objects.  Select one to create a link; a backlink will automatically appear on the referenced object.
3. **Tag & property** – inline `#tags` or open the properties sidebar to add structured metadata.
4. **Daily notes** – open the calendar icon to access your daily notes; the current day’s note is pre‑created.
5. **Graph** – from any object open the graph view to explore related content.
6. **Export/Import** – head to Settings → Data to download a JSON backup or restore from one.

## Contributing

Contributions are welcome!  Please read the `CONTRIBUTING.md` for guidelines.  Issues and feature requests can be filed on GitHub.

## License

This project is licensed under the MIT License.
