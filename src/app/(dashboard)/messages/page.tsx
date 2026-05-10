"use client";

import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Sparkles,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
import { conversations, messages as initialMessages } from "@/data/mock";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import type { Message } from "@/types";

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState<Message[]>(initialMessages[activeId] ?? []);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId)!;

  useEffect(() => {
    setThread(initialMessages[activeId] ?? syntheticThread(activeId, active.participantName, active.participantAvatar));
  }, [activeId, active.participantAvatar, active.participantName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread]);

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

  const send = () => {
    if (!draft.trim()) return;
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
      },
    ]);
    setDraft("");
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
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-260px)] min-h-[560px]">
          <aside className="border-r border-white/5 flex flex-col">
            <div className="p-4 border-b border-white/5">
              <Input
                placeholder="Search conversations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <ScrollArea className="flex-1">
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
                            : "hover:bg-white/[0.04]"
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

          <section className="flex flex-col">
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/5">
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
                    <div className={cn("flex flex-col gap-0.5", mine && "items-end")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                          mine
                            ? "bg-brand-gradient text-white rounded-tr-sm"
                            : "glass rounded-tl-sm"
                        )}
                      >
                        {m.content}
                      </div>
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

            <footer className="border-t border-white/5 p-3">
              <div className="glass-subtle rounded-2xl p-2 flex items-end gap-2">
                <div className="flex items-center gap-0.5">
                  <Button size="icon-sm" variant="ghost"><Paperclip className="h-4 w-4" /></Button>
                  <Button size="icon-sm" variant="ghost"><ImageIcon className="h-4 w-4" /></Button>
                  <Button size="icon-sm" variant="ghost"><Smile className="h-4 w-4" /></Button>
                </div>
                <Textarea
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
                  disabled={!draft.trim()}
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
