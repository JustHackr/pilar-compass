"use client";

import { sanitizeOsnHtml } from "@/lib/osn/html";

export function OsnHtml({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={className ? `osn-html ${className}` : "osn-html"}
      dangerouslySetInnerHTML={{ __html: sanitizeOsnHtml(html) }}
    />
  );
}
