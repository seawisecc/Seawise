import type { SupabaseClient } from "@supabase/supabase-js";

/** Storage bucket used for all admin-uploaded images (create it as public). */
export const MEDIA_BUCKET = "media";

/**
 * Uploads a file to Supabase Storage and returns its public URL.
 * `folder` groups uploads (e.g. "portfolio", "testimonials", "partners").
 */
export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  folder: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
