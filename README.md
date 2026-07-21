# Dropwell

Dropwell is a local-first file organizer built with Next.js. It reads supported
documents in the browser, uses on-device OCR and content analysis to classify
them, and saves the organized files to a local library.

## Run locally

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Uploaded files and their metadata are stored in `.dropwell-data/`. That
directory is ignored by Git, so your local library is not committed to source
control. Images and scanned PDFs use Tesseract.js for OCR; text PDFs are parsed
with PDF.js before OCR is used as a fallback.

## Validate a production build

```bash
bun run build
bun run start
```
