"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { X, Send, Loader2, ExternalLink, Maximize2, Minimize2, MessageSquare, ChevronRight, Trash2 } from "lucide-react";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;
const PORTFOLIO_HOST = "alfayad.vercel.app";
const TEASER_STORAGE_KEY = "chatTeaserDismissed";
const CHAT_REVEAL_DELAY_MS = 2500;
const CHAT_REVEAL_FALLBACK_MS = 4500;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  :root {
    --cw-red: #e01c1c;
    --cw-red-dim: rgba(224,28,28,0.12);
    --cw-red-border: rgba(224,28,28,0.25);
    --cw-white: #f5f5f0;
    --cw-gray: #888;
    --cw-black: #080808;
    --cw-black2: #111;
  }

  @keyframes cw-fadeUp {
    from { opacity:0; transform: translateY(16px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes cw-scaleIn {
    from { opacity:0; transform: scale(0.92) translateY(8px); }
    to   { opacity:1; transform: scale(1) translateY(0); }
  }
  @keyframes cw-pulse {
    0%,100%{ transform: scale(1); opacity:1; }
    50%{ transform: scale(1.15); opacity:0.7; }
  }
  @keyframes cw-blink {
    0%,80%,100%{ opacity:0; }
    40%{ opacity:1; }
  }
  @keyframes cw-slideIn {
    from { opacity:0; transform: translateX(12px); }
    to   { opacity:1; transform: translateX(0); }
  }

  /* ── TOGGLE BUTTON ── */
  .cw-toggle {
    position: fixed; bottom: 24px; right: 24px; z-index: 99999;
    display: flex; align-items: center; gap: 10px;
    padding: 0.75rem 1.25rem;
    background: var(--cw-black); border: 1px solid var(--cw-red-border);
    color: var(--cw-white); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 0 0 rgba(224,28,28,0);
    transition: border-color 0.3s, box-shadow 0.3s;
    animation: cw-fadeUp 0.5s ease forwards;
  }
  .cw-toggle:hover {
    border-color: var(--cw-red);
    box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(224,28,28,0.2);
  }
  .cw-toggle.is-open {
    background: var(--cw-red); border-color: var(--cw-red);
  }

  .cw-toggle-icon {
    width: 18px; height: 18px; color: var(--cw-red); flex-shrink: 0;
    transition: color 0.3s;
  }
  .cw-toggle.is-open .cw-toggle-icon { color: var(--cw-white); }

  .cw-toggle-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--cw-red);
    animation: cw-pulse 2s infinite; flex-shrink: 0;
  }
  .cw-toggle.is-open .cw-toggle-dot { display: none; }

  /* ── TEASER ── */
  .cw-teaser {
    position: fixed; bottom: 88px; right: 24px; z-index: 99998;
    display: flex; align-items: center; gap: 0;
    background: var(--cw-black); border: 1px solid var(--cw-red-border);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    animation: cw-slideIn 0.4s ease forwards;
    overflow: hidden;
  }

  .cw-teaser-content {
    padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem;
    cursor: pointer; transition: background 0.2s;
  }
  .cw-teaser-content:hover { background: var(--cw-red-dim); }

  .cw-teaser-text {
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--cw-white); font-weight: 400;
  }
  .cw-teaser-arrow { color: var(--cw-red); flex-shrink: 0; }

  .cw-teaser-dismiss {
    width: 40px; height: 100%; display: flex; align-items: center; justify-content: center;
    background: transparent; border: none; border-left: 1px solid var(--cw-red-border);
    color: var(--cw-gray); cursor: pointer; transition: all 0.2s; padding: 0;
  }
  .cw-teaser-dismiss:hover { background: var(--cw-red-dim); color: var(--cw-white); }

  /* ── CHAT PANEL ── */
  .cw-panel {
    position: fixed; right: 24px; z-index: 99999;
    display: flex; flex-direction: column;
    background: var(--cw-black);
    border: 1px solid var(--cw-red-border);
    box-shadow: 0 24px 64px rgba(0,0,0,0.8), 0 0 0 0 rgba(224,28,28,0.1);
    animation: cw-scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
    overflow: hidden;
  }
  .cw-panel.normal { bottom: 88px; width: 360px; height: 480px; max-width: calc(100vw - 3rem); }
  .cw-panel.expanded { bottom: 24px; width: min(50vw, 720px); height: 85vh; min-width: 360px; }

  /* Mobile: full-page only when expanded; normal = floating panel */
  @media (max-width: 768px) {
    .cw-panel.normal { bottom: 88px; width: calc(100vw - 3rem); height: 480px; right: 24px; left: auto; }
    .cw-panel.expanded {
      top: 0; right: 0; bottom: 0; left: 0;
      width: 100%; height: 100%;
      min-width: 0; max-width: none;
      min-height: 100vh; min-height: 100dvh;
      border-radius: 0;
      border: none;
      box-shadow: none;
      animation: cw-fadeUp 0.3s ease forwards;
    }
  }

  /* Desktop: expanded = full-height sidebar */
  @media (min-width: 769px) {
    .cw-panel.expanded {
      top: 0; bottom: 0; right: 0; left: auto;
      width: min(420px, 28vw);
      min-width: 360px; max-width: 420px;
      height: 100vh; min-height: 100vh;
      border-radius: 0; border-right: none; border-top: none; border-bottom: none;
      box-shadow: -8px 0 48px rgba(0,0,0,0.6), 0 0 0 1px var(--cw-red-border);
    }
  }

  /* noise overlay inside panel */
  .cw-panel::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    background-size: 150px; opacity: 0.25;
  }

  /* header */
  .cw-header {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--cw-red-border);
    background: var(--cw-black2);
    flex-shrink: 0;
  }
  .cw-header-left { display: flex; align-items: center; gap: 0.75rem; }
  .cw-header-avatar {
    width: 32px; height: 32px; border: 1px solid var(--cw-red-border);
    display: flex; align-items: center; justify-content: center;
    background: var(--cw-red-dim); flex-shrink: 0;
  }
  .cw-header-avatar-icon { color: var(--cw-red); }
  .cw-header-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
    letter-spacing: 0.08em; color: var(--cw-white); line-height: 1;
  }
  .cw-header-status {
    font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--cw-gray); display: flex; align-items: center; gap: 4px; margin-top: 2px;
  }
  .cw-status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--cw-red); animation: cw-pulse 2.5s infinite; }

  .cw-header-actions { display: flex; align-items: center; gap: 4px; }
  .cw-header-btn {
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid transparent; cursor: pointer;
    color: var(--cw-gray); transition: all 0.2s;
  }
  .cw-header-btn:hover { border-color: var(--cw-red-border); color: var(--cw-white); }
  .cw-header-btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

  /* messages area */
  .cw-messages {
    position: relative; z-index: 1;
    flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;
    scrollbar-width: thin; scrollbar-color: var(--cw-red-border) transparent;
  }
  .cw-messages::-webkit-scrollbar { width: 4px; }
  .cw-messages::-webkit-scrollbar-track { background: transparent; }
  .cw-messages::-webkit-scrollbar-thumb { background: var(--cw-red-border); }

  /* empty state */
  .cw-empty {
    display: flex; flex-direction: column; gap: 1rem; padding-top: 0.5rem;
  }
  .cw-empty-label {
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--cw-red);
    display: flex; align-items: center; gap: 8px;
  }
  .cw-empty-label::before { content:''; width:20px; height:1px; background:var(--cw-red); }
  .cw-empty-greeting {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: 0.04em;
    color: var(--cw-white); line-height: 1.1;
  }
  .cw-empty-desc { font-size: 0.85rem; color: var(--cw-gray); line-height: 1.65; font-weight: 300; }

  /* quick prompts */
  .cw-prompts { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.25rem; }
  .cw-prompt {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.6rem 0.85rem; border: 1px solid var(--cw-red-border);
    background: transparent; cursor: pointer; color: var(--cw-gray);
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; letter-spacing: 0.05em;
    text-align: left; transition: all 0.25s;
  }
  .cw-prompt:hover { border-color: var(--cw-red); color: var(--cw-white); background: var(--cw-red-dim); }
  .cw-prompt-arrow { color: var(--cw-red); flex-shrink: 0; }

  /* message bubbles */
  .cw-msg { display: flex; animation: cw-fadeUp 0.3s ease forwards; }
  .cw-msg.user { justify-content: flex-end; }
  .cw-msg.assistant { justify-content: flex-start; }

  .cw-bubble {
    max-width: 88%; font-size: 0.875rem; line-height: 1.65; font-weight: 300;
    font-family: 'DM Sans', sans-serif;
  }
  .cw-bubble.user {
    background: var(--cw-red); color: var(--cw-white);
    padding: 0.75rem 1rem;
    border: 1px solid transparent;
  }
  .cw-bubble.assistant {
    background: var(--cw-black2); color: rgba(245,245,240,0.9);
    padding: 0.9rem 1rem;
    border: 1px solid var(--cw-red-border);
  }

  /* typing indicator */
  .cw-typing {
    display: flex; align-items: center; gap: 6px;
    background: var(--cw-black2); border: 1px solid var(--cw-red-border);
    padding: 0.75rem 1rem; width: fit-content;
  }
  .cw-typing-dot {
    width: 5px; height: 5px; border-radius: 50%; background: var(--cw-red);
    animation: cw-blink 1.4s infinite;
  }
  .cw-typing-dot:nth-child(2){ animation-delay: 0.2s; }
  .cw-typing-dot:nth-child(3){ animation-delay: 0.4s; }

  /* link card */
  .cw-link-card {
    display: flex; align-items: center; gap: 0.75rem;
    margin-top: 0.5rem; padding: 0.65rem 0.85rem;
    border: 1px solid var(--cw-red-border); background: transparent;
    text-decoration: none; transition: all 0.25s;
  }
  .cw-link-card:hover { border-color: var(--cw-red); background: var(--cw-red-dim); }
  .cw-link-icon {
    width: 28px; height: 28px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--cw-red-border); color: var(--cw-red);
  }
  .cw-link-domain { font-size: 0.78rem; color: var(--cw-white); letter-spacing: 0.04em; }
  .cw-link-sub { font-size: 0.68rem; color: var(--cw-gray); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

  /* input area */
  .cw-input-area {
    position: relative; z-index: 1;
    padding: 1rem 1.25rem; border-top: 1px solid var(--cw-red-border);
    background: var(--cw-black2); flex-shrink: 0;
  }
  .cw-input-row { display: flex; gap: 0; }
  .cw-input {
    flex: 1; background: var(--cw-black); border: 1px solid var(--cw-red-border);
    border-right: none; color: var(--cw-white); padding: 0.75rem 1rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none;
    transition: border-color 0.3s;
  }
  .cw-input::placeholder { color: var(--cw-gray); }
  .cw-input:focus { border-color: var(--cw-red); }
  .cw-input:disabled { opacity: 0.5; }

  .cw-send {
    width: 44px; flex-shrink: 0;
    background: var(--cw-red); border: 1px solid var(--cw-red);
    color: var(--cw-white); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.3s; position: relative; overflow: hidden;
  }
  .cw-send::before {
    content:''; position:absolute; inset:0; background:rgba(255,255,255,0.1);
    transform:translateX(-100%); transition:transform 0.3s;
  }
  .cw-send:hover::before { transform:translateX(0); }
  .cw-send:hover { background: #c01818; }
  .cw-send:disabled { background: #333; border-color: #333; cursor: not-allowed; }
  .cw-send:disabled::before { display: none; }
`;

function getMessageText(m) {
  if (!m.parts || !Array.isArray(m.parts)) return "";
  return m.parts.filter(p => p.type === "text").map(p => p.text).join("");
}

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url; }
}

function isPortfolioUrl(href) {
  try {
    const d = getDomain(href);
    return d === PORTFOLIO_HOST || d.endsWith(".alfayad.vercel.app");
  } catch { return false; }
}

function trimUrlTrailingPunctuation(url) {
  return url.replace(/[.,;:!?)]+$/, "");
}

function splitTextAndUrls(text) {
  const segments = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(URL_REGEX.source, "gi");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index).trim() });
    }
    segments.push({ type: "url", content: trimUrlTrailingPunctuation(match[0]) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    const rest = text.slice(lastIndex).trim();
    if (rest) segments.push({ type: "text", content: rest });
  }
  return segments;
}

function LinkCard({ href }) {
  if (isPortfolioUrl(href)) return null;
  const domain = getDomain(href);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="cw-link-card">
      <div className="cw-link-icon"><ExternalLink size={13} /></div>
      <div>
        <div className="cw-link-domain">{domain}</div>
        <div className="cw-link-sub">Open link</div>
      </div>
    </a>
  );
}

function AssistantMessageContent({ text }) {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
      {paragraphs.map((para, i) => {
        const segments = splitTextAndUrls(para);
        const hasUrl = segments.some(s => s.type === "url");
        return (
          <div key={i}>
            {hasUrl ? segments.map((seg, j) =>
              seg.type === "text"
                ? <p key={j} style={{ margin:0, color:'rgba(245,245,240,0.9)' }}>{seg.content}</p>
                : <LinkCard key={j} href={seg.content} />
            ) : (
              <p style={{ margin:0, whiteSpace:'pre-line', color:'rgba(245,245,240,0.9)' }}>{para}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getNavigationForMessage(text) {
  if (!text || typeof text !== "string") return null;
  const lower = text.toLowerCase().trim();
  if (/project|work|portfolio/.test(lower)) return { path: "/work" };
  if (/resume|experience|education|skill|cv/.test(lower)) return { path: "/", hash: "resume" };
  if (/about/.test(lower)) return { path: "/", hash: "about" };
  if (/tech|stack|tools/.test(lower)) return { path: "/", hash: "tech-stack" };
  if (/contact|email|hire|reach/.test(lower)) return { path: "/contact" };
  if (/service|offer|pricing/.test(lower)) return { path: "/services" };
  return null;
}

function scrollToHash(hash) {
  if (!hash) return;
  const el = document.getElementById(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const QUICK_PROMPTS = [
  "Show me your projects",
  "What services do you offer?",
  "What's your tech stack?",
  "How can I hire you?",
];

function ChatWidgetContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [chatRevealed, setChatRevealed] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, setMessages, status } = useChat({ transport: chatTransport });
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    try {
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(TEASER_STORAGE_KEY)) {
        setShowTeaser(false);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let tid;
    const onSplash = () => { tid = setTimeout(() => setChatRevealed(true), CHAT_REVEAL_DELAY_MS); };
    window.addEventListener("splashComplete", onSplash);
    const fallback = setTimeout(() => setChatRevealed(true), CHAT_REVEAL_FALLBACK_MS);
    return () => { window.removeEventListener("splashComplete", onSplash); clearTimeout(tid); clearTimeout(fallback); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function dismissTeaser() {
    setShowTeaser(false);
    try { sessionStorage.setItem(TEASER_STORAGE_KEY, "true"); } catch (_) {}
  }

  function send(text) {
    const t = text.trim();
    if (!t || isLoading) return;
    setInput("");
    sendMessage({ text: t });
    const nav = getNavigationForMessage(t);
    if (nav) {
      const current = pathname || "/";
      if (current !== nav.path) {
        router.push(nav.hash ? `${nav.path}#${nav.hash}` : nav.path);
        setTimeout(() => scrollToHash(nav.hash), 700);
      } else {
        setTimeout(() => scrollToHash(nav.hash), 150);
      }
    }
  }

  function handleSubmit(e) {
    e?.preventDefault();
    send(input);
  }

  return (
    <>
      <style>{styles}</style>

      {/* Teaser */}
      {chatRevealed && showTeaser && !open && (
        <div className="cw-teaser">
          <div className="cw-teaser-content" onClick={() => { setOpen(true); dismissTeaser(); }}>
            <div className="cw-status-dot" />
            <span className="cw-teaser-text">Ask me anything</span>
            <ChevronRight size={13} className="cw-teaser-arrow" />
          </div>
          <button className="cw-teaser-dismiss" onClick={dismissTeaser} aria-label="Dismiss">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Toggle button */}
      {chatRevealed && (
        <button
          className={`cw-toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? (
            <X size={15} className="cw-toggle-icon" />
          ) : (
            <MessageSquare size={15} className="cw-toggle-icon" />
          )}
          <span>{open ? 'Close' : 'Chat with Fayad'}</span>
          {!open && <div className="cw-toggle-dot" />}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className={`cw-panel ${expanded ? 'expanded' : 'normal'}`}>

          {/* Header */}
          <div className="cw-header">
            <div className="cw-header-left">
              <div className="cw-header-avatar">
                <MessageSquare size={14} className="cw-header-avatar-icon" />
              </div>
              <div>
                <div className="cw-header-name">Fayad AI</div>
                <div className="cw-header-status">
                  <div className="cw-status-dot" />
                  Online now
                </div>
              </div>
            </div>
            <div className="cw-header-actions">
              <button
                className="cw-header-btn"
                onClick={() => { setMessages([]); setInput(""); }}
                aria-label="Clear chat"
                disabled={isLoading || messages.length === 0}
                title="Clear chat"
              >
                <Trash2 size={14} />
              </button>
              <button
                className="cw-header-btn"
                onClick={() => setExpanded(v => !v)}
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button className="cw-header-btn" onClick={() => setOpen(false)} aria-label="Close">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="cw-messages">
            {messages.length === 0 ? (
              <div className="cw-empty">
                <div className="cw-empty-label">AI Assistant</div>
                <div className="cw-empty-greeting">Hey, I'm Fayad.<br />How can I help?</div>
                <p className="cw-empty-desc">Ask me about my work, services, tech stack, or anything else.</p>
                <div className="cw-prompts">
                  {QUICK_PROMPTS.map(p => (
                    <button key={p} className="cw-prompt" onClick={() => { send(p); }}>
                      <span>{p}</span>
                      <ChevronRight size={13} className="cw-prompt-arrow" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(m => {
                const text = getMessageText(m);
                if (!text) return null;
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`cw-msg ${isUser ? 'user' : 'assistant'}`}>
                    <div className={`cw-bubble ${isUser ? 'user' : 'assistant'}`}>
                      {isUser
                        ? <p style={{ margin:0, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{text}</p>
                        : <AssistantMessageContent text={text} />
                      }
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="cw-msg assistant">
                <div className="cw-typing">
                  <div className="cw-typing-dot" />
                  <div className="cw-typing-dot" />
                  <div className="cw-typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="cw-input-area">
            <form onSubmit={handleSubmit} className="cw-input-row">
              <input
                className="cw-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message…"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                className="cw-send"
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send"
              >
                {isLoading ? <Loader2 size={15} style={{ animation:'spin 1s linear infinite' }} /> : <Send size={15} />}
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(<ChatWidgetContent />, document.body);
}