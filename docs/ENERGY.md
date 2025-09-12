# Energy Efficiency Guidelines

Notegrain is designed for low energy consumption and long battery life. We follow these principles:

- **Small JavaScript footprint**: We use SvelteKit and Vite to compile minimal bundles. We only import dependencies as needed and avoid heavy frameworks like Electron or React.

- **Local-first storage**: All data is stored in the browser using IndexedDB via Dexie. There is no constant network sync or remote database calls draining your battery.

- **Service worker caching**: The PWA caches assets and data for offline use. This reduces repeated network downloads.

- **Event-driven updates**: State changes are coalesced and written at idle time using `requestIdleCallback` and debounced functions. There is no background polling or timers.

- **Respect reduced motion**: We check `prefers-reduced-motion` to disable animations. We rely on CSS transitions rather than JavaScript animations.

- **Lazy loading**: Non-critical components (graph, media attachments) are loaded only when needed. Assets like images and fonts are preloaded efficiently.

- **No background tasks**: The application has no background tasks running when you aren't interacting with it. Everything is triggered by user events.

**Tips for users**

- Install the PWA so it runs in its own window and can be closed completely.
- Use offline mode by enabling the browser's offline setting to avoid network. Exports and imports are manual.
- Avoid leaving huge graphs open; they can use CPU/GPU; close the graph view when not using.
- If you are on low battery, use your OS's low power mode and Notegrain will automatically reduce animations.
