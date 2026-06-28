import "server-only";
import { config } from "@/lib/config";
import type { EmailThread, DriveFile } from "@/lib/types";

// --- Gmail (read-only) ---
// Pulls recent messages, optionally biased to supplier conversations.
export async function getGmailThreads(token: string, max = 15): Promise<EmailThread[]> {
  const q = encodeURIComponent("category:primary -in:chats");
  const list = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max}&q=${q}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!list.ok) throw new Error(`Gmail list ${list.status}`);
  const { messages } = (await list.json()) as { messages?: { id: string }[] };
  if (!messages?.length) return [];

  const details = await Promise.all(
    messages.slice(0, max).map(async (m) => {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
      );
      if (!res.ok) return null;
      return res.json();
    }),
  );

  type GmailDetail = {
    id: string;
    snippet?: string;
    internalDate?: string;
    labelIds?: string[];
    payload?: { headers?: { name: string; value: string }[] };
  };
  return (details.filter(Boolean) as GmailDetail[]).map((d) => {
    const headers: { name: string; value: string }[] = d.payload?.headers ?? [];
    const h = (n: string) => headers.find((x) => x.name === n)?.value ?? "";
    return {
      id: d.id,
      from: h("From"),
      subject: h("Subject") || "(no subject)",
      snippet: d.snippet ?? "",
      date: new Date(Number(d.internalDate)).toISOString(),
      unread: (d.labelIds ?? []).includes("UNREAD"),
    } satisfies EmailThread;
  });
}

// --- Drive (read-only) ---
export async function getDriveFilesLive(token: string, max = 24): Promise<DriveFile[]> {
  const folder = config.driveFolderId;
  const q = folder
    ? encodeURIComponent(`'${folder}' in parents and trashed = false`)
    : encodeURIComponent("trashed = false");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=modifiedTime desc&pageSize=${max}` +
      `&fields=files(id,name,mimeType,modifiedTime,webViewLink)`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Drive list ${res.status}`);
  const { files } = (await res.json()) as {
    files: { id: string; name: string; mimeType: string; modifiedTime: string; webViewLink?: string }[];
  };
  return files.map((f) => ({
    id: f.id,
    name: f.name,
    kind: mapKind(f.mimeType),
    modified: f.modifiedTime,
    url: f.webViewLink ?? "#",
  }));
}

function mapKind(mime: string): DriveFile["kind"] {
  if (mime === "application/vnd.google-apps.folder") return "folder";
  if (mime.includes("spreadsheet")) return "sheet";
  if (mime.includes("document")) return "doc";
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return "other";
}
