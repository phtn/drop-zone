import {
  createStoredFile,
  listStoredFiles,
  storageError,
  type FileRecord,
} from "./storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function cleanText(
  value: FormDataEntryValue | null,
  fallback: string,
  limit: number,
) {
  if (typeof value !== "string") return fallback;
  return (
    value.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, limit) || fallback
  );
}

function cleanMimeType(value: string) {
  const mimeType = value.trim().toLowerCase();
  return /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/.test(mimeType)
    ? mimeType
    : "application/octet-stream";
}

export async function GET() {
  try {
    return Response.json(
      { files: await listStoredFiles() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return Response.json({ error: storageError(error) }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const candidate = formData.get("file");
    if (!(candidate instanceof File)) {
      return Response.json({ error: "Choose a file to upload." }, { status: 400 });
    }
    if (candidate.size === 0 || candidate.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "Files must be between 1 byte and 20 MB." },
        { status: 413 },
      );
    }

    const category = cleanText(formData.get("category"), "Other", 40);
    const kind = cleanText(formData.get("kind"), "File", 80);
    const excerpt = cleanText(formData.get("excerpt"), "", 300);
    const confidence = Math.max(
      0,
      Math.min(
        100,
        Number(cleanText(formData.get("confidence"), "0", 3)) || 0,
      ),
    );
    const id = crypto.randomUUID();
    const record: FileRecord = {
      id,
      name: candidate.name.replace(/[\u0000-\u001f]/g, " ").slice(0, 255),
      size: candidate.size,
      mimeType: cleanMimeType(candidate.type),
      category,
      kind,
      confidence,
      excerpt,
      objectKey: id,
      createdAt: new Date().toISOString(),
    };
    const contents = new Uint8Array(await candidate.arrayBuffer());

    return Response.json(
      { file: await createStoredFile(record, contents) },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: storageError(error) }, { status: 503 });
  }
}
