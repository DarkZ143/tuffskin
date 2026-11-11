"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loader from "./loader";

const transitionStorageKey = "tuffskin:route-load";

export default function SiteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const initialDuration = useRef<number | undefined>(undefined);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (initialDuration.current === undefined) {
      let duration = 2000;

      try {
        if (window.sessionStorage.getItem(transitionStorageKey) === "route") {
          duration = 1000;
          window.sessionStorage.removeItem(transitionStorageKey);
        }
      } catch {
        // Keep the startup duration when browser storage is unavailable.
      }

      initialDuration.current = duration;
    }

    const timer = window.setTimeout(() => setIsLoading(false), initialDuration.current ?? 2000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;
    setIsLoading(true);

    const timer = window.setTimeout(() => setIsLoading(false), 1000);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <div
        className={`site-content${isLoading ? " site-content--loading" : ""}`}
        aria-busy={isLoading}
      >
        {children}
      </div>
      {isLoading && (
        <div className="site-loader-overlay">
          <div className="site-loader-content">
            <Loader />
            <p className="site-loader-label">
              Tuffskin <span>Houston</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
