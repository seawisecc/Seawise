import DashboardOverview from "@/components/admin/DashboardOverview";

export default function AdminDashboardPage({
  params,
}: {
  params: { lang: string };
}) {
  return <DashboardOverview lang={params.lang} />;
}
