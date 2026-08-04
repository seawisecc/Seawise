import AdminSkeleton from "@/components/admin/AdminSkeleton";

/**
 * Shown the instant a menu item is clicked, while the route resolves. Without
 * this the panel sat on the previous screen with no feedback until the server
 * responded, which included the auth round trip in middleware.
 *
 * The shell around it comes from layout.tsx and does not remount, so only this
 * content area swaps.
 */
export default function AdminLoading() {
  return <AdminSkeleton />;
}
