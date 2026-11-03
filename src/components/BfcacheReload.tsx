"use client";

import { useEffect } from "react";

// Chrome restores pages from its back/forward cache (bfcache) on
// back/forward navigation even when the response was sent with
// Cache-Control: no-store, unlike Safari/Firefox/Brave, which still treat
// that header as "don't bfcache this". Every page here is session-aware
// SSR, so a restored snapshot can show a logged-out/placeholder view even
// though the session cookie is still valid — force a real reload when that
// happens so the page re-renders with current session state.
export default function BfcacheReload() {
  useEffect(() => {
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) window.location.reload();
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
