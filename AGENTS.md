# my-english-ankier

## Stack

Electrobun (NOT Electron) desktop app — Bun runtime, React 18, Tailwind CSS 3, Vite 6.

## Commands

| Command | Action |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Dev without HMR (requires manual rebuild) |
| `bun run dev:hmr` | Dev with Vite HMR (recommended) |
| `bun run build:canary` | Production canary build |
| `bun run hmr` | Start Vite dev server only (port 5173) |

`dev:hmr` runs Vite + Electrobun concurrently. Vite builds to `dist/`, Electrobun copies `dist/` assets into the bundle via `electrobun.config.ts`.

**Note:** When adding new files to `src/bun/` or `src/shared/`, the Bun process must be fully restarted — `--watch` only detects changes to existing files.

## Architecture

- **Main process (Bun)**: `src/bun/index.ts` — creates `BrowserWindow`, probes Vite dev server for HMR. `src/bun/db.ts` — SQLite CRUD for articles.
- **View (React)**: `src/mainview/` — Vite root, entry at `index.html` → `main.tsx` → `App.tsx`
- **Import patterns**:
  - `import { BrowserWindow, defineElectrobunRPC } from "electrobun/bun"` (main process)
  - `import { Electroview } from "electrobun/view"` (browser context)
- **Bundled assets** use `views://` URLs (e.g. `views://mainview/index.html`)
- **SQLite** via `bun:sqlite` (built-in, no deps). Database is `data.db` at `Utils.paths.userData` (e.g. `~/.local/share/<app-identifier>/<channel>/` on Linux), auto-created. Schema: `articles(id, title, url, content, created_at)`.
- **RPC** communication: `defineElectrobunRPC` on both sides, wired via `mainWindow.webview.createTransport()` (NOT via `BrowserWindow`'s `rpc` option — that path drops handlers). Renderer side uses `Electroview` + React context (`RPCContext`). RPC handlers defined in `src/shared/rpcSchema.ts`.

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Home.tsx` | Lists articles from DB |
| `/add-article` | `AddArticle.tsx` | Form with title, url, content |
| `/edit-article/:id` | `EditArticle.tsx` | Edit existing article |
| `/read-article/:id` | `ReadArticle.tsx` | Read article with text selection for Anki card creation |

## Anki Integration

**Always use AnkiConnect** for any Anki interaction. Docs: https://git.sr.ht/~foosoft/anki-connect

- AnkiConnect runs an HTTP server on `localhost:8765` (only when Anki is open)
- All requests are `POST` with JSON body: `{ "action": "<action>", "version": 6, "params": {} }`
- Response: `{ "result": <value>, "error": null|string }`
- Key actions for this app:
  - `createDeck` — create a deck (idempotent, won't overwrite existing)
  - `addNote` — create a flashcard (params: `{ note: { deckName, modelName, fields, tags } }`)
  - `storeMediaFile` — attach audio/images to notes
  - `modelNames` / `deckNames` — list available note types and decks
- AnkiConnect must be installed in Anki (add-on code: `2055492159`)
- Communication should happen from the **main process** (`src/bun/`) via `fetch("http://localhost:8765", ...)` — not from the renderer

## Conventions

- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters`
- No test framework, no linter, no CI — `tsc`-level checking only
- `llms.txt` references Electrobun API docs at https://blackboard.sh/electrobun/llms.txt
- `postcss.config.js` uses `module.exports` (CommonJS); everything else is ESM
