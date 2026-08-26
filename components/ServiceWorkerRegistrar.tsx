"use client";

import { useEffect } from "react";

/**
 * Registers `public/sw.js`, which is what makes the site installable.
 *
 * Renders nothing. Mounted from the locale layout so it covers the public
 * pages and the admin panel alike; the worker itself skips /admin and /api,
 * see the comment at the top of sw.js.
 *
 * Registration waits for `load` so it never competes with the first paint.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // A worker registered from `next dev` caches development chunks that stop
    // existing after a rebuild, which shows up as blank pages.
    if (process.env.NODE_ENV !== "production") return;

    const daftar = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration fails on unsupported or private browsing contexts.
        // The site works fine without it, so there is nothing to report.
      });
    };

    if (document.readyState === "complete") daftar();
    else window.addEventListener("load", daftar);

    return () => window.removeEventListener("load", daftar);
  }, []);

  return null;
}
