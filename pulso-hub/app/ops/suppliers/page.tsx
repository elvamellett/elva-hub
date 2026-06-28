import { getSuppliers } from "@/lib/suppliers";
import { PageHeader } from "@/components/ui";
import { SuppliersTable } from "@/components/suppliers-table";

export const dynamic = "force-dynamic";

export default function SuppliersPage() {
  const suppliers = getSuppliers();
  const active = suppliers.filter((s) => s.status !== "rejected").length;

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle={`${active} active · update status as you work each one. Click an email to open its Gmail threads.`}
      />
      <SuppliersTable initial={suppliers} />
      <p className="mt-4 text-xs text-slate">
        Tip: change a status from the dropdown — it saves to the hub. (In production this is backed by your database;
        in the demo it persists in-session.)
      </p>
    </div>
  );
}
