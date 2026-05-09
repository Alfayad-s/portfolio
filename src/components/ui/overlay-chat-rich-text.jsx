"use client";

import React, { Fragment } from "react";
import { cn } from "@/lib/utils";
import { OverlayLinkPreviewCard } from "@/components/ui/overlay-link-preview";

const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

function trimUrlTrailingPunctuation(url) {
  return url.replace(/[.,;:!?)]+$/, "");
}

/** Remove Markdown bold markers so `**text**` does not show literal asterisks in the overlay. */
function stripMarkdownBoldDelimiters(text) {
  if (!text) return text;
  return text.replace(/\*\*/g, "");
}

function splitTextAndUrls(text) {
  if (!text) return [{ type: "text", content: "" }];
  const segments = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(URL_REGEX.source, "gi");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: "url",
      content: trimUrlTrailingPunctuation(match[0]),
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }
  return segments.length ? segments : [{ type: "text", content: text }];
}

const TAG_CLASS = {
  company: "text-amber-300 font-semibold drop-shadow-[0_0_20px_rgba(251,191,36,0.12)]",
  role: "text-violet-300 font-semibold drop-shadow-[0_0_20px_rgba(196,181,253,0.12)]",
  tech: "text-emerald-400 font-semibold drop-shadow-[0_0_18px_rgba(52,211,153,0.12)]",
};

/**
 * Split plain text into alternating plain / tagged spans for overlay highlights.
 * Only <company>, <role>, <tech> pairs are interpreted; everything else stays literal.
 */
function parseTaggedSegments(str) {
  const nodes = [];
  const re = /<(company|role|tech)>([\s\S]*?)<\/\1>/g;
  let last = 0;
  let m;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) {
      nodes.push({ kind: "plain", text: str.slice(last, m.index) });
    }
    nodes.push({ kind: "tag", tag: m[1], text: m[2] });
    last = re.lastIndex;
  }
  if (last < str.length) {
    nodes.push({ kind: "plain", text: str.slice(last) });
  }
  if (nodes.length === 0) {
    nodes.push({ kind: "plain", text: str });
  }
  return nodes;
}

/**
 * Clickable https links + optional <company>, <role>, <tech> highlights for the black overlay chat.
 */
export function OverlayChatRichText({ text, className }) {
  const parts = splitTextAndUrls(stripMarkdownBoldDelimiters(text));

  return (
    <div className={cn("leading-relaxed break-words", className)}>
      {parts.map((seg, i) => {
        if (seg.type === "url") {
          return (
            <div key={`u-${i}`} className="my-1.5 block w-full max-w-xl">
              <OverlayLinkPreviewCard url={seg.content} />
            </div>
          );
        }
        if (!seg.content) return <Fragment key={`e-${i}`} />;
        return (
          <Fragment key={`t-${i}`}>
            {parseTaggedSegments(seg.content).map((node, j) => {
              const key = `${i}-${j}-${node.kind}`;
              if (node.kind === "plain") {
                return (
                  <span key={key} className="inline align-middle">
                    {node.text}
                  </span>
                );
              }
              return (
                <span
                  key={key}
                  className={cn("inline align-middle", TAG_CLASS[node.tag] ?? "")}
                >
                  {node.text}
                </span>
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
}
