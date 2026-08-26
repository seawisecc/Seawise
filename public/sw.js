/*
 * Seawise Studio service worker.
 *
 * Deliberately conservative. The public site runs on ISR (revalidate = 120)
 * and the admin panel reads live Supabase data, so nothing here may serve a
 * cached page while the network is available:
 *
 *   - navigations      network first, cache only as an offline fallback
 *   - /_next/static/*  cache first, safe because those filenames are hashed
 *   - everything else  untouched, straight to the network
 *
 * Admin routes, /api/* and Supabase are skipped entirely. They depend on the
 * session cookie and on fresh data; a stale answer there reads as data loss.
 */

const VERSI = "seawise-v1";
const CACHE_STATIS = `${VERSI}-statis`;
const CACHE_HALAMAN = `${VERSI}-halaman`;
const OFFLINE_URL = "/offline.html";

const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_STATIS)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => !name.startsWith(VERSI))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

/** Paths that must never be answered from cache. */
function dilewati(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("/admin") ||
    url.pathname === "/sw.js"
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Same origin only. Supabase Storage and Google Fonts keep their own rules.
  if (url.origin !== self.location.origin) return;
  if (dilewati(url)) return;

  // Hashed build output: the filename changes whenever the content does, so
  // reading it from cache can never go stale.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok) {
              const salinan = response.clone();
              caches.open(CACHE_STATIS).then((cache) => cache.put(request, salinan));
            }
            return response;
          })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && response.type === "basic") {
            const salinan = response.clone();
            caches.open(CACHE_HALAMAN).then((cache) => cache.put(request, salinan));
          }
          return response;
        })
        .catch(async () => {
          const hit = await caches.match(request);
          if (hit) return hit;
          const offline = await caches.match(OFFLINE_URL);
          return (
            offline ||
            new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })
          );
        })
    );
  }
});
