import AdminShell from "@/components/admin/AdminShell";
import PortfolioManager from "@/components/admin/PortfolioManager";

export const dynamic = "force-dynamic";

export default function AdminPortfolioPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <AdminShell lang={params.lang}>
      <PortfolioManager />
    </AdminShell>
  );
}
