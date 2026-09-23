// Upload rendered feed + story JPGs to Supabase Storage bucket 'media', under
// media/instagram/<periode>/. Run after render.py and render_stories.py, and
// after converting their PNG output to JPG in jpg_out/ and jpg_out_stories/.
//
// Usage: PERIOD=2026-q4-v3 node konten-instagram/upload.js
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const ROOT = path.join(__dirname, "..");
const IG = __dirname;
const PERIOD = process.env.PERIOD || "2026-q4-v3";

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
  if (!fs.existsSync(localDir)) return;
  const files = fs.readdirSync(localDir).filter((f) => f.endsWith(".jpg")).sort();
  for (const f of files) {
    const buf = fs.readFileSync(path.join(localDir, f));
    const storagePath = `instagram/${PERIOD}/${remotePrefix}${f}`;
    const { error } = await supabase.storage.from("media").upload(storagePath, buf, {
      contentType: "image/jpeg",
      cacheControl: "3600",
      upsert: true,
    });
    if (error) throw new Error(`${f}: ${error.message}`);
    const { data } = supabase.storage.from("media").getPublicUrl(storagePath);
    out[f.replace(/\.jpg$/, "")] = data.publicUrl;
    console.log("OK", storagePath);
  }
}

async function main() {
  const urls = { feed: {}, stories: {} };
  await uploadDir(path.join(IG, "jpg_out"), "", urls.feed);
  await uploadDir(path.join(IG, "jpg_out_stories"), "stories/", urls.stories);
  fs.writeFileSync(path.join(IG, `.urls-${PERIOD}.json`), JSON.stringify(urls, null, 2));
  console.log("Wrote", `.urls-${PERIOD}.json`);
}

main().catch((e) => {
  console.error("FAILED:", e.message || e);
  process.exit(1);
});
