import AdminShell from "@/components/admin/AdminShell";
import FinanceManager from "@/components/admin/FinanceManager";

export const dynamic = "force-dynamic";

export default function AdminFinancePage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <AdminShell lang={params.lang}>
      <FinanceManager />
    </AdminShell>
  );
}
