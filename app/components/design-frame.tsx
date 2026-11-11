"use client";

import { useEffect, useRef } from "react";

export default function DesignFrame({
  html,
  title,
}: {
  html: string;
  title: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let observer: ResizeObserver | undefined;
    let observedImages: HTMLImageElement[] = [];
    let observedDocument: Document | undefined;

    const resizeFrame = () => {
      const document = frame.contentDocument;
      if (!document) return;

      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0,
      );
      frame.style.height = `${height}px`;
    };

    const observeDocument = () => {
      const document = frame.contentDocument;
      if (!document || document === observedDocument) return;

      observer?.disconnect();
      observedImages.forEach((image) =>
        image.removeEventListener("load", resizeFrame),
      );
      observedDocument = document;

      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(resizeFrame);
        observer.observe(document.documentElement);
        if (document.body) observer.observe(document.body);
      }

      observedImages = Array.from(document.images);
      observedImages.forEach((image) =>
        image.addEventListener("load", resizeFrame),
      );

      resizeFrame();
    };

    frame.addEventListener("load", observeDocument);
    window.addEventListener("resize", resizeFrame);
    if (frame.contentDocument?.readyState === "complete") observeDocument();

    return () => {
      frame.removeEventListener("load", observeDocument);
      window.removeEventListener("resize", resizeFrame);
      observer?.disconnect();
      observedImages.forEach((image) =>
        image.removeEventListener("load", resizeFrame),
      );
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      className="design-frame"
      srcDoc={html}
      title={title}
      scrolling="no"
    />
  );
}
