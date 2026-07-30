import AdminShell from "@/components/admin/AdminShell";
import PostManager from "@/components/admin/PostManager";

export const dynamic = "force-dynamic";

export default function AdminBlogPage({
  params,
}: {
  params: { lang: string };
}) {
  return (
    <AdminShell lang={params.lang}>
      <PostManager />
    </AdminShell>
  );
}
