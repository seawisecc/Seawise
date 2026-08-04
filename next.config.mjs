/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first, WebP as the fallback. The source screenshots are large PNGs,
    // and AVIF typically lands 20-30% under WebP for that kind of image.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Allow Supabase Storage public URLs for portfolio screenshots,
      // testimonial avatars and partner logos.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
