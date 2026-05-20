"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileAudio,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
  File as FileIcon,
  Image as ImageIcon,
  MoreHorizontal,
  Paperclip,
  Phone,
  Play,
  Search,
  Send,
  Smile,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
import { conversations, messages as initialMessages } from "@/data/mock";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import type { Message, MessageAttachment, MessageAttachmentKind } from "@/types";

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

type UploadOptionKey = "image" | "video" | "pdf" | "excel" | "word" | "audio" | "any";

const UPLOAD_OPTIONS: {
  key: UploadOptionKey;
  label: string;
  hint: string;
  accept: string;
  expectKind: MessageAttachmentKind | "any";
  icon: typeof ImageIcon;
  tint: string;
}[] = [
  {
    key: "image",
    label: "Photo",
    hint: "JPG, PNG, GIF, WebP",
    accept: "image/*",
    expectKind: "image",
    icon: ImageIcon,
    tint: "text-blue-500 bg-blue-500/10",
  },
  {
    key: "video",
    label: "Video",
    hint: "MP4, WebM, MOV",
    accept: "video/*",
    expectKind: "video",
    icon: FileVideo,
    tint: "text-purple-500 bg-purple-500/10",
  },
  {
    key: "pdf",
    label: "PDF",
    hint: "PDF document",
    accept: ".pdf,application/pdf",
    expectKind: "pdf",
    icon: FileText,
    tint: "text-red-500 bg-red-500/10",
  },
  {
    key: "excel",
    label: "Excel / CSV",
    hint: "XLS, XLSX, CSV",
    accept:
      ".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv",
    expectKind: "excel",
    icon: FileSpreadsheet,
    tint: "text-emerald-500 bg-emerald-500/10",
  },
  {
    key: "word",
    label: "Word",
    hint: "DOC, DOCX",
    accept:
      ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    expectKind: "word",
    icon: FileType,
    tint: "text-sky-500 bg-sky-500/10",
  },
  {
    key: "audio",
    label: "Audio",
    hint: "MP3, WAV, M4A",
    accept: "audio/*",
    expectKind: "audio",
    icon: FileAudio,
    tint: "text-amber-500 bg-amber-500/10",
  },
  {
    key: "any",
    label: "Any file",
    hint: "Up to 25 MB",
    accept: "*/*",
    expectKind: "any",
    icon: FileIcon,
    tint: "text-muted-foreground bg-foreground/10",
  },
];

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: ["😀", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "🙂", "😉", "😍", "🥰", "😘", "😎", "🤩", "🤔", "😴", "🤗", "🙌", "👏"],
  },
  {
    label: "Gestures",
    emojis: ["👍", "👎", "👌", "🤝", "🙏", "👋", "✌️", "🤞", "💪", "🫶", "👀", "🧠", "💯", "✅", "❌", "⚠️", "❤️", "🔥", "✨", "🎉"],
  },
  {
    label: "Work",
    emojis: ["💼", "📈", "📊", "📅", "📝", "📌", "📎", "🗂️", "📁", "📂", "💡", "🚀", "⏰", "📞", "📧", "💬", "💰", "💳", "🏷️", "🎯"],
  },
];

function bytesToReadable(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function classifyFile(file: File): MessageAttachmentKind {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "text/csv" ||
    name.endsWith(".xls") ||
    name.endsWith(".xlsx") ||
    name.endsWith(".csv")
  ) {
    return "excel";
  }
  if (
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return "word";
  }
  return "file";
}

function attachmentIconFor(kind: MessageAttachmentKind) {
  switch (kind) {
    case "image":
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    case "video":
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    case "audio":
      return <FileAudio className="h-5 w-5 text-amber-500" />;
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "excel":
      return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
    case "word":
      return <FileType className="h-5 w-5 text-sky-500" />;
    default:
      return <FileIcon className="h-5 w-5 text-muted-foreground" />;
  }
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<MessageAttachment[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [lightbox, setLightbox] = useState<MessageAttachment | null>(null);
  const [thread, setThread] = useState<Message[]>(initialMessages[activeId] ?? []);
  const pendingExpectRef = useRef<MessageAttachmentKind | "any">("any");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const active = conversations.find((c) => c.id === activeId)!;

  useEffect(() => {
    setThread(
      initialMessages[activeId] ?? syntheticThread(activeId, active.participantName, active.participantAvatar)
    );
    setPending((current) => {
      current.forEach((a) => URL.revokeObjectURL(a.url));
      return [];
    });
    setDraft("");
  }, [activeId, active.participantAvatar, active.participantName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread]);

  useEffect(() => {
    return () => {
      pending.forEach((a) => URL.revokeObjectURL(a.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () =>
      conversations.filter(
        (c) =>
          !query ||
          c.participantName.toLowerCase().includes(query.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const openUploadFor = (option: (typeof UPLOAD_OPTIONS)[number]) => {
    const input = fileInputRef.current;
    if (!input) return;
    pendingExpectRef.current = option.expectKind;
    input.accept = option.accept;
    input.value = "";
    input.click();
    setAttachOpen(false);
  };

  const ingestFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const expect = pendingExpectRef.current;
    const next: MessageAttachment[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name} is too large (max 25 MB)`);
        return;
      }
      const kind = classifyFile(file);
      if (expect !== "any" && kind !== expect) {
        toast.error(`${file.name} does not match the selected ${expect} type`);
        return;
      }
      next.push({
        id: `A-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        kind,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        url: URL.createObjectURL(file),
      });
    });
    if (next.length) {
      setPending((p) => [...p, ...next]);
      toast.success(`Attached ${next.length} file${next.length > 1 ? "s" : ""}`);
    }
  };

  const removePending = (id: string) => {
    setPending((p) => {
      const target = p.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return p.filter((a) => a.id !== id);
    });
  };

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) {
      setDraft((d) => d + emoji);
      return;
    }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    const next = draft.slice(0, start) + emoji + draft.slice(end);
    setDraft(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const send = () => {
    if (!draft.trim() && pending.length === 0) return;
    setThread((t) => [
      ...t,
      {
        id: `M-${Date.now()}`,
        conversationId: activeId,
        senderId: "me",
        senderName: "You",
        senderAvatar: "",
        content: draft,
        timestamp: new Date().toISOString(),
        read: true,
        attachments: pending.length ? pending : undefined,
      },
    ]);
    setDraft("");
    setPending([]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Real-time chat with your team and customers."
        actions={
          <Button variant="gradient" size="sm">
            <Sparkles className="h-4 w-4" />
            New thread
          </Button>
        }
      />

      <Card variant="glass" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] h-[calc(100dvh-220px)] sm:h-[calc(100dvh-260px)] min-h-[520px]">
          <aside className="border-r border-border flex flex-col min-w-0 overflow-hidden">
            <div className="p-4 border-b border-border">
              <Input
                placeholder="Search conversations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <ScrollArea className="flex-1 min-w-0">
              <ul className="p-2 space-y-1">
                {filtered.map((conv) => {
                  const isActive = conv.id === activeId;
                  return (
                    <li key={conv.id}>
                      <button
                        onClick={() => setActiveId(conv.id)}
                        className={cn(
                          "w-full flex items-start gap-3 rounded-xl p-3 text-left transition-colors",
                          isActive
                            ? "bg-primary/10 ring-1 ring-primary/20"
                            : "hover:bg-foreground/[0.04]"
                        )}
                      >
                        <div className="relative shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conv.participantAvatar} alt={conv.participantName} />
                            <AvatarFallback>{getInitials(conv.participantName)}</AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold truncate">
                              {conv.participantName}
                            </p>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {formatRelativeTime(conv.lastMessageAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {conv.lastMessage}
                          </p>
                        </div>
                        {conv.unread > 0 && (
                          <span className="self-center shrink-0 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {conv.unread}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </aside>

          <section className="flex flex-col min-w-0">
            <header className="flex items-center justify-between px-5 py-4 border-b border-foreground/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={active.participantAvatar} alt={active.participantName} />
                    <AvatarFallback>{getInitials(active.participantName)}</AvatarFallback>
                  </Avatar>
                  {active.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{active.participantName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {active.online ? "Online" : "Last seen recently"} · {active.participantRole}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon-sm" variant="ghost"><Phone className="h-4 w-4" /></Button>
                <Button size="icon-sm" variant="ghost"><Video className="h-4 w-4" /></Button>
                <Button size="icon-sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-3">
              {thread.map((m, i) => {
                const mine = m.senderId === "me";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      "flex gap-2 max-w-[80%]",
                      mine ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    {!mine && (
                      <Avatar className="h-7 w-7 mt-1 shrink-0">
                        <AvatarImage src={m.senderAvatar} alt={m.senderName} />
                        <AvatarFallback className="text-[9px]">
                          {getInitials(m.senderName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("flex flex-col gap-1", mine && "items-end")}>
                      {m.attachments && m.attachments.length > 0 && (
                        <div className={cn("flex flex-col gap-1.5 max-w-full", mine && "items-end")}>
                          {m.attachments.map((att) =>
                            att.kind === "image" ? (
                              <button
                                key={att.id}
                                onClick={() => setLightbox(att)}
                                className="block overflow-hidden rounded-2xl border border-foreground/5 hover:opacity-90 transition-opacity"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="max-h-64 max-w-[280px] object-cover"
                                />
                              </button>
                            ) : att.kind === "video" ? (
                              <video
                                key={att.id}
                                src={att.url}
                                controls
                                className="max-h-64 max-w-[280px] rounded-2xl border border-foreground/5 bg-black"
                              />
                            ) : att.kind === "audio" ? (
                              <audio
                                key={att.id}
                                src={att.url}
                                controls
                                className="max-w-[280px]"
                              />
                            ) : (
                              <a
                                key={att.id}
                                href={att.url}
                                download={att.name}
                                target="_blank"
                                rel="noreferrer"
                                className={cn(
                                  "group flex items-center gap-3 rounded-2xl px-3 py-2.5 max-w-[280px] transition-colors",
                                  mine
                                    ? "bg-white/15 text-white hover:bg-white/25"
                                    : "glass hover:bg-foreground/[0.06]"
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                                    mine ? "bg-white/15" : "bg-foreground/5"
                                  )}
                                >
                                  {attachmentIconFor(att.kind)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold truncate">{att.name}</p>
                                  <p className={cn("text-[10px]", mine ? "text-white/70" : "text-muted-foreground")}>
                                    {att.kind.toUpperCase()} · {bytesToReadable(att.size)}
                                  </p>
                                </div>
                                <Download className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                              </a>
                            )
                          )}
                        </div>
                      )}
                      {m.content && (
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words",
                            mine
                              ? "bg-brand-gradient text-white rounded-tr-sm"
                              : "glass rounded-tl-sm"
                          )}
                        >
                          {m.content}
                        </div>
                      )}
                      <span className="text-[10px] text-muted-foreground px-1">
                        {new Date(m.timestamp).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <footer className="border-t border-foreground/5 p-3">
              {pending.length > 0 && (
                <div className="flex flex-wrap gap-2 px-2 pb-2">
                  {pending.map((att) => (
                    <div
                      key={att.id}
                      className="relative group glass-subtle rounded-xl p-2 flex items-center gap-2 max-w-[220px]"
                    >
                      {att.kind === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={att.url}
                          alt={att.name}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                      ) : att.kind === "video" ? (
                        <div className="relative h-10 w-10 rounded-lg bg-black/80 flex items-center justify-center shrink-0">
                          <video src={att.url} className="h-10 w-10 rounded-lg object-cover" muted />
                          <Play className="absolute h-4 w-4 text-white drop-shadow" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                          {attachmentIconFor(att.kind)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold truncate">{att.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {bytesToReadable(att.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => removePending(att.id)}
                        className="h-5 w-5 rounded-full bg-foreground/10 hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors shrink-0"
                        aria-label={`Remove ${att.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="glass-subtle rounded-2xl p-2 flex items-end gap-2">
                <div className="flex items-center gap-0.5">
                  <Popover open={attachOpen} onOpenChange={setAttachOpen}>
                    <PopoverTrigger asChild>
                      <Button size="icon-sm" variant="ghost" aria-label="Attach file" title="Attach file">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      side="top"
                      className="w-64 p-2"
                    >
                      <p className="px-2 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Choose what to upload
                      </p>
                      <div className="space-y-0.5">
                        {UPLOAD_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => openUploadFor(opt)}
                              className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-foreground/[0.06] transition-colors text-left"
                            >
                              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", opt.tint)}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium leading-tight">{opt.label}</p>
                                <p className="text-[10px] text-muted-foreground leading-tight">{opt.hint}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                    <PopoverTrigger asChild>
                      <Button size="icon-sm" variant="ghost" aria-label="Insert emoji" title="Insert emoji">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      side="top"
                      className="w-72 p-3 space-y-3 max-h-80 overflow-y-auto scrollbar-thin"
                    >
                      {EMOJI_GROUPS.map((group) => (
                        <div key={group.label}>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            {group.label}
                          </p>
                          <div className="grid grid-cols-8 gap-1">
                            {group.emojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  insertEmoji(emoji);
                                }}
                                className="h-8 w-8 rounded-md hover:bg-foreground/10 text-lg flex items-center justify-center transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    ingestFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <Textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Type a message..."
                  className="min-h-[40px] max-h-32 resize-none border-none bg-transparent focus-visible:ring-0 px-1 py-1.5"
                  rows={1}
                />
                <Button
                  size="icon"
                  variant="gradient"
                  onClick={send}
                  disabled={!draft.trim() && pending.length === 0}
                  className="rounded-xl shrink-0"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </footer>
          </section>
        </div>
      </Card>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.url}
            alt={lightbox.name}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function syntheticThread(id: string, name: string, avatar: string): Message[] {
  return [
    {
      id: `${id}-1`,
      conversationId: id,
      senderId: "p",
      senderName: name,
      senderAvatar: avatar,
      content: `Hey — wanted to flag the latest update on this thread.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
      read: true,
    },
    {
      id: `${id}-2`,
      conversationId: id,
      senderId: "me",
      senderName: "You",
      senderAvatar: "",
      content: "Thanks for the heads up. I'll loop in the team and circle back today.",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      read: true,
    },
    {
      id: `${id}-3`,
      conversationId: id,
      senderId: "p",
      senderName: name,
      senderAvatar: avatar,
      content: "Appreciate it 🙏 — let me know what you need from my side.",
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      read: true,
    },
  ];
}
