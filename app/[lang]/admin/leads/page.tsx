import AdminShell from "@/components/admin/AdminShell";
import LeadsTable from "@/components/admin/LeadsTable";

export const dynamic = "force-dynamic";

export default function AdminLeadsPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <AdminShell lang={params.lang}>
      <LeadsTable />
    </AdminShell>
  );
}
