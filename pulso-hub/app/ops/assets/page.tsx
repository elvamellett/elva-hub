import { getDriveFiles } from "@/lib/data";
import { PageHeader, Card } from "@/components/ui";
import { shortDate } from "@/lib/cn";
import { useMocks } from "@/lib/config";
import { Folder, FileText, Sheet, ImageIcon, FileType, File } from "lucide-react";
import type { DriveFile } from "@/lib/types";

export const dynamic = "force-dynamic";

const icon: Record<DriveFile["kind"], React.ElementType> = {
  folder: Folder, doc: FileText, sheet: Sheet, image: ImageIcon, pdf: FileType, other: File,
};

export default async function AssetsPage() {
  const files = await getDriveFiles();

  return (
    <div>
      <PageHeader title="Assets" subtitle="Brand assets & docs from Google Drive (read-only)." />
      {useMocks && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Showing demo files. Connect Google (Drive read-only) to browse your real PULSO folder — see Settings.
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {files.map((f) => {
          const Icon = icon[f.kind];
          return (
            <a key={f.id} href={f.url} target="_blank" rel="noreferrer">
              <Card className="flex h-full flex-col gap-3 p-4 hover:border-blue/40">
                <Icon className={`h-7 w-7 ${f.kind === "folder" ? "text-blue" : "text-slate"}`} />
                <div className="mt-auto">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-slate">Edited {shortDate(f.modified)}</p>
                </div>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
