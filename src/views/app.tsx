export default function App({ notes }: { notes: string[] }) {
    return (
        <html>
            <head>
                <link rel="stylesheet" href="/static/styles.css" />
            </head>
            <body>
                <h1>hello</h1>
                <form
                    hx-post="/uploads"
                    hx-encoding="multipart/form-data"
                    hx-target="#notes"
                    hx-swap="innerHTML"
                >
                    <input
                        type="file"
                        name="file"
                        accept=".md,.markdown,.txt"
                    />
                    <button type="submit">Upload Document</button>
                </form>
                <div id="notes"></div>
            </body>
            <script src="/static/htmx.min.js"> </script>
        </html>
    );
}
