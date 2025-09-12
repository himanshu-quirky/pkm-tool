# Notegrain Architecture

Notegrain is built as a single‑page web application using SvelteKit and TypeScript.  The guiding principles for the architecture are:

1. **Local‑first**: All data lives in the user's browser.  We use IndexedDB via the Dexie library to model objects, links, properties and collections.
2. **Modular object model**: Every piece of information is an object with a type (e.g., `note`, `link`, `media`, `project`).  Objects are stored in Dexie tables keyed by a UUID.  Links between objects are stored in a separate table so we can query backlinks efficiently.
3. **Component‑driven UI**: UI is composed from Svelte components (editor, backlinks panel, tag chips, graph).  Each component reacts to store updates and isolates reactivity to minimise re‑renders.
4. **Progressive Web App**: A service worker caches static assets and API responses for offline use.  The app is installable on desktop or mobile and works without an internet connection once loaded.
5. **Energy efficiency**: We schedule heavy operations (indexing, graph layout) on idle time using `requestIdleCallback` and offload heavy computations to Web Workers.  UI animations are kept minimal and respect the user's `prefers‑reduced‑motion` preference.
6. **Extensibility**: The repository is structured as a monorepo with separate packages for the web app and shared design system.  Future contributions can add additional platforms (e.g. mobile wrappers) without changing the core.

## Packages

### `apps/web`

The main SvelteKit application lives here.  Key directories include:

| Path | Purpose |
|---|---|
| `src/routes` | Page components (`+page.svelte`) for each route (home, graph, calendar, settings, etc.) |
| `src/lib/components` | Reusable UI components: Editor, Backlinks, TagChips, etc. |
| `src/lib/store` | Svelte stores and Dexie database wrappers for objects, links, properties and settings. |
| `src/service-worker.ts` | Service worker script for caching and offline support. |
| `static/` | Static assets such as favicon, the logo and manifest. |

### `packages/design`

Design tokens and shared UI primitives live in `packages/design`.  Using a separate package allows consistent theming across the app and any future integrations.  This package contains:

* `tokens.css` – CSS variables for colours, spacing, typography and motion.
* `icons/` – Static SVG icons used throughout the app.
* `components/` – Shared Svelte components if needed by multiple apps (currently empty).

## Data Model

Objects are represented by the following TypeScript interfaces (simplified):

```ts
interface ObjectBase {
  id: string;            // UUID
  type: ObjectType;      // e.g. 'note', 'person', 'project'
  title: string;
  createdAt: number;
  updatedAt: number;
}

interface Note extends ObjectBase {
  type: 'note';
  content: string;        // markdown content
}

interface Link {
  id: string;
  fromId: string;        // id of the linking object
  toId: string;          // id of the linked object
  context: string;       // snippet of text surrounding the link
}

interface Property {
  id: string;
  objectId: string;
  key: string;
  value: string;
}

// Dexie tables
db.version(1).stores({
  objects: '&id,type,title,createdAt,updatedAt',
  links: '&id,fromId,toId',
  properties: '&id,objectId,key'
});
```

This model allows efficient querying of objects, their links and properties.  Backlinks can be obtained by querying `links` where `toId` equals the current object ID.

## Service Worker & Caching

The service worker caches the app shell, static assets, and JSON exports.  It uses a network‑first strategy for API calls (not yet implemented) and a cache‑first strategy for static assets.  When offline, requests fall back to the cache, allowing the application to keep working.

## Extending the App

Future additions such as sets, templates, media attachments or remote sync can be built on top of this foundation.  Each feature should be encapsulated in its own Svelte component and use the existing store for data access.  See `docs/ROADMAP.md` for upcoming milestones.
