import { raw } from "hono/html";
import type { Match } from "../index.js";

export const Preview = ({ previewContent }: { previewContent: string }) => {
    return (
        <dialog>
            <h2>Preview</h2>
            <div>{raw(previewContent)}</div>
            <form method="dialog">
                <button>Close</button>
            </form>
        </dialog>
    );
};

export const GrammarResults = ({ matches }: { matches: Match[] }) => {
    if (matches.length === 0) return <p>No issues found.</p>;

    return (
        <ul>
            {matches.map((m) => (
                <li>
                    <strong>{m.message}</strong>
                    <div>…{m.context.text}…</div>
                    {m.replacements.length > 0 && (
                        <div>
                            Suggestions:{" "}
                            {m.replacements
                                .slice(0, 3)
                                .map((r) => r.value)
                                .join(", ")}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export const Content = ({ text }: { text: string }) => {
    return (
        <div>
            <form class="form">
                <textarea name="content">${text}</textarea>

                <div class="button-container">
                    <button hx-post="/preview" hx-target="#dialog-container">
                        Preview
                    </button>
                    <button
                        hx-post="/check"
                        hx-target="#results"
                        hx-indicator="#grammar-loading"
                    >
                        Check grammar
                    </button>

                    <button
                        hx-post="/saves"
                        hx-target="#results"
                        hx-disabled-elt="this"
                    >
                        Save
                    </button>
                </div>

                <div id="dialog-container"></div>
                <div id="grammar-loading" class="htmx-indicator">
                    Checking...
                </div>
                <div id="results"></div>
            </form>
        </div>
    );
};

export const Notes = ({ names }: { names: string[] }) => {
    return (
        <div>
            <h3>Lists Markdown Files</h3>
            <ul>
                {names.map((name) => (
                    <li>
                        <a href={`/notes/${name}`}>{name}</a>{" "}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const NoteContent = ({ notesContent }: { notesContent: string }) => {
    return (
        <div>
            <h2>Mardown Note Taking</h2>
            <div>{raw(notesContent)}</div>
        </div>
    );
};

export const Layout = ({ children }: { children: any }) => (
    <html>
        <head>
            <meta charset="utf-8" />
            <title>Markdown Notes</title>
            <head>
                <link rel="stylesheet" href="/static/styles.css" />
            </head>
        </head>
        <body hx-boost="true">
            {children}
            <script src="/static/htmx.min.js"> </script>
            <script src="/static/index.js"> </script>
        </body>
    </html>
);

export default function App() {
    return (
        <div>
            <h1>Markdown Note Taking App</h1>
            <button hx-get="/notes" hx-target="body" hx-push-url="true">
                Click here to show all notes
            </button>
            <h3>Upload your markdown file</h3>
            <div>
                <form
                    hx-post="/uploads"
                    hx-encoding="multipart/form-data"
                    hx-target="#container"
                    hx-swap="innerHTML"
                >
                    <input
                        type="file"
                        name="file"
                        accept=".md,.markdown,.txt"
                    />
                    <button type="submit">Upload Document</button>
                </form>
                <div id="container"></div>
            </div>
        </div>
    );
}
