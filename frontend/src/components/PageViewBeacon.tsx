"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const DEFAULT_BEACON_PATH = "/events/page-view";
const BEACON_URL = process.env.NEXT_PUBLIC_PAGEVIEW_BEACON_URL?.trim() || DEFAULT_BEACON_PATH;
const PROJECT_DETAIL_PATH_PATTERN = /^\/projects\/[^/?#]+$/;

type PageViewPayload = {
  eventType: "page_view";
  path: string;
  search: string;
  fromPath: string | null;
  referrer: string;
  userAgent: string;
  timestamp: string;
};

function sendPageView(payload: PageViewPayload): void {
  const body = JSON.stringify(payload);
  const beaconUrl = new URL(BEACON_URL, window.location.origin);
  beaconUrl.searchParams.set("ev", payload.eventType);
  beaconUrl.searchParams.set("to", payload.path);
  if (payload.fromPath) {
    beaconUrl.searchParams.set("from", payload.fromPath);
  }
  beaconUrl.searchParams.set("ts", payload.timestamp);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(beaconUrl.toString(), blob);
    return;
  }

  void fetch(beaconUrl.toString(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  });
}

export function PageViewBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSentRouteRef = useRef<string>("");
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    if (!PROJECT_DETAIL_PATH_PATTERN.test(normalizedPath)) {
      previousPathRef.current = normalizedPath;
      return;
    }

    const search = searchParams.toString();
    const routeKey = search ? `${normalizedPath}?${search}` : normalizedPath;
    if (routeKey === lastSentRouteRef.current) return;

    sendPageView({
      eventType: "page_view",
      path: normalizedPath,
      search: search ? `?${search}` : "",
      fromPath: previousPathRef.current,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    previousPathRef.current = normalizedPath;
    lastSentRouteRef.current = routeKey;
  }, [pathname, searchParams]);

  return null;
}
