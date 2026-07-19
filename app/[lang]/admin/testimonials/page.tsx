import AdminShell from "@/components/admin/AdminShell";
import TestimonialManager from "@/components/admin/TestimonialManager";

export const dynamic = "force-dynamic";

export default function AdminTestimonialsPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <AdminShell lang={params.lang}>
      <TestimonialManager />
    </AdminShell>
  );
}
