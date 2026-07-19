import AdminShell from "@/components/admin/AdminShell";
import DashboardOverview from "@/components/admin/DashboardOverview";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <AdminShell lang={params.lang}>
      <DashboardOverview lang={params.lang} />
    </AdminShell>
  );
}
