import AdminShell from "@/components/admin/AdminShell";
import PricingManager from "@/components/admin/PricingManager";

export const dynamic = "force-dynamic";

export default function AdminPricingPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <AdminShell lang={params.lang}>
      <PricingManager />
    </AdminShell>
  );
}
