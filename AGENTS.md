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

- **Main process (Bun)**: `src/bun/index.ts` — creates `BrowserWindow`, probes Vite dev server for HMR
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
| `/` | `Home.tsx` | Lists articles from DB, link to add |
| `/add-article` | `AddArticle.tsx` | Form with title, url, content |

## Conventions

- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters`
- No test framework, no linter, no CI — `tsc`-level checking only
- `llms.txt` references Electrobun API docs at https://blackboard.sh/electrobun/llms.txt
- `postcss.config.js` uses `module.exports` (CommonJS); everything else is ESM
