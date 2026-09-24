// Upload rendered Highlight stories + covers to Supabase Storage bucket 'media',
// under media/instagram/highlights/. Run after render_highlights.py and the JPG
// conversion into jpg_out_highlights/.
//
// Usage: node konten-instagram/upload_highlights.js
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const ROOT = path.join(__dirname, "..");
const IG = __dirname;

function loadEnv() {
  const txt = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadDir(localDir, remotePrefix, out) {
  const files = fs.readdirSync(localDir).filter((f) => f.endsWith(".jpg")).sort();
  for (const f of files) {
    const storagePath = `instagram/highlights/${remotePrefix}${f}`;
    const { error } = await supabase.storage.from("media").upload(storagePath, fs.readFileSync(path.join(localDir, f)), {
      contentType: "image/jpeg",
      cacheControl: "3600",
      upsert: true,
    });
    if (error) throw new Error(`${f}: ${error.message}`);
    out[f.replace(/\.jpg$/, "")] = supabase.storage.from("media").getPublicUrl(storagePath).data.publicUrl;
    console.log("OK", storagePath);
  }
}

async function main() {
  const urls = { slides: {}, covers: {} };
  const dir = path.join(IG, "jpg_out_highlights");
  await uploadDir(dir, "", urls.slides);
  await uploadDir(path.join(dir, "covers"), "covers/", urls.covers);
  fs.writeFileSync(path.join(IG, ".urls-highlights.json"), JSON.stringify(urls, null, 2));
  console.log("Wrote .urls-highlights.json");
}

main().catch((e) => {
  console.error("FAILED:", e.message || e);
  process.exit(1);
});
