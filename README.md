# Markdown Note Taking App

Upload a `.md` file, edit it, preview it, run a grammar check, then save it back to disk and browse saved notes.

**Built with:** Hono + TSX (server-rendered JSX), htmx (all requests are plain HTML swaps, no client JS framework), marked (markdown → HTML), LanguageTool API (grammar).

**How it works**

- `GET /` → renders the layout + upload form
- `POST /uploads` → reads the file text, swaps an editor form into `#container`
- `POST /preview` → `marked.parse()` → returns a `<dialog>` opened by `index.js`
- `POST /check` → POSTs the text to LanguageTool, swaps results into `#results`
- `POST /saves` → writes `uploads/<uuid>.md`
- `GET /notes` → lists saved `.md` files, `GET /notes/:name` → renders one

Run: `bun run dev` → http://localhost:3000
