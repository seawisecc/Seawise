/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow Supabase Storage public URLs for portfolio screenshots,
      // testimonial avatars and partner logos.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
