import { serve } from "@hono/node-server";
import { Hono } from "hono";
import App from "./views/app.js";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./public" })); //check if css is download or not

app.get("/", (c) => {
    return c.html(App({ notes: ["note1", "note2"] }));
});

app.post("/uploads", async (c) => {
    const form = await c.req.formData();
    const file = form.get("file") as File | null;

    if (!file) return c.html("<p>Error file not found</p>");
    const text = await file.text();
    console.log(text);
    return c.html("<p>your file is uploaded</p>");
});

app.get("/notes", (c) => {
    return c.html("notes");
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
