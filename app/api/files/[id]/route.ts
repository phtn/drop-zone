import { deleteStoredFile, getStoredFile, storageError } from "../storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function contentDisposition(name: string) {
  const safeAscii = name.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${safeAscii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/files/[id]">,
) {
  try {
    const { id } = await context.params;
    const storedFile = await getStoredFile(id);
    if (!storedFile) {
      return Response.json({ error: "File not found." }, { status: 404 });
    }

    return new Response(new Uint8Array(storedFile.contents), {
      headers: {
        "cache-control": "private, no-store",
        "content-disposition": contentDisposition(storedFile.record.name),
        "content-length": String(storedFile.contents.byteLength),
        "content-type": storedFile.record.mimeType,
      },
    });
  } catch (error) {
    return Response.json({ error: storageError(error) }, { status: 503 });
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/files/[id]">,
) {
  try {
    const { id } = await context.params;
    const deleted = await deleteStoredFile(id);
    if (!deleted) {
      return Response.json({ error: "File not found." }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: storageError(error) }, { status: 503 });
  }
}
