import AdminShell from "@/components/admin/AdminShell";
import PartnerManager from "@/components/admin/PartnerManager";

export const dynamic = "force-dynamic";

export default function AdminPartnersPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <AdminShell lang={params.lang}>
      <PartnerManager />
    </AdminShell>
  );
}
