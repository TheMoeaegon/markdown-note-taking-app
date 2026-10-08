import { serve } from "@hono/node-server";
import { Hono } from "hono";
import App, {
    Content,
    GrammarResults,
    Layout,
    NoteContent,
    Notes,
    Preview,
} from "./views/app.js";
import { serveStatic } from "@hono/node-server/serve-static";
import { marked } from "marked";
import { mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import path from "node:path";
import { readdir, readFile, writeFile } from "node:fs/promises";

const app = new Hono();

const LT_URL = "https://api.languagetool.org/v2/check"; // or your self-hosted URL

export type Match = {
    message: string;
    offset: number;
    length: number;
    replacements: { value: string }[];
    context: { text: string; offset: number; length: number };
};

app.use("/static/*", serveStatic({ root: "./public" })); //check if css is download or not

app.get("/", (c) => {
    return c.html(Layout({ children: App() }));
});

app.post("/check", async (c) => {
    const body = await c.req.parseBody();
    const content = typeof body.content === "string" ? body.content : "";

    if (!content.trim()) {
        return c.html(`<p>Nothing to check.</p>`);
    }

    try {
        const res = await fetch(LT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ text: content, language: "en-US" }),
        });

        if (!res.ok) throw new Error(`LanguageTool returned ${res.status}`);

        const data = (await res.json()) as { matches: Match[] };
        console.log("grammar matches:", data.matches.length); // quick check
        return c.html(GrammarResults({ matches: data.matches }));
    } catch (err) {
        console.error(err);
        return c.html(`<p>Grammar check failed. Try again.</p>`, 500);
    }
});

app.post("/preview", async (c) => {
    const body = await c.req.parseBody();
    const content = typeof body.content === "string" ? body.content : "";
    const html = await marked.parse(content);
    return c.html(Preview({ previewContent: html }));
});

app.post("/uploads", async (c) => {
    const form = await c.req.formData();
    const file = form.get("file") as File | null;

    if (!file) return c.html("<p>Error file not found</p>");
    const text = await file.text();
    return c.html(Content({ text }));
});

app.post("/saves", async (c) => {
    const body = await c.req.parseBody();
    const content = typeof body.content === "string" ? body.content : "";

    if (!content.trim()) {
        return c.html(`<p>Nothing to upload.</p>`);
    }

    try {
        await mkdir("uploads", { recursive: true });
        const filename = `${randomUUID()}.md`;
        const filePath = path.join("uploads", filename);
        writeFile(filePath, content, "utf-8");

        return c.html(`<p>Saved as ${filename}</p>`);
    } catch (err) {
        console.error(err);
        return c.html(`<p>Save failed. Try again.</p>`, 500);
    }
});

app.get("/notes", async (c) => {
    await mkdir("uploads", { recursive: true });
    const names = (await readdir("uploads")).filter((f) => f.endsWith(".md"));
    return c.html(Layout({ children: Notes({ names }) }));
});

app.get("/notes/:name", async (c) => {
    const name = c.req.param("name");
    try {
        const content = await readFile(path.join("uploads", name), "utf-8");
        const html = await marked.parse(content);
        return c.html(
            Layout({ children: NoteContent({ notesContent: html }) }),
        );
    } catch (err) {
        c.notFound();
    }
});

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
