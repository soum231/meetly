"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMeetingStore } from "@/store/useMeetingStore";
import { cn, getInitials, getAvatarColor } from "@/lib/utils";
import { sendMessage } from "@/actions/meeting";

interface ChatPanelProps {
  meetingId: string;
}

export function ChatPanel({ meetingId }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messages = useMeetingStore((s) => s.messages);
  const addMessage = useMeetingStore((s) => s.addMessage);
  const userName = useMeetingStore((s) => s.userName);
  const setShowSidebar = useMeetingStore((s) => s.setShowSidebar);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    setInput("");

    const result = await sendMessage(meetingId, userName, messageText);

    if (result.message) {
      addMessage(result.message);
    } else {
      addMessage({
        id: crypto.randomUUID(),
        meeting_id: meetingId,
        sender_name: userName,
        message: messageText,
        created_at: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-medium text-white">Chat</h3>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 text-white/40 hover:text-white"
          onClick={() => setShowSidebar(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        <div ref={scrollRef} className="space-y-3">
          {messages.length === 0 && (
            <p className="text-xs text-white/40 text-center py-8">
              No messages yet. Start the conversation!
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2",
                msg.sender_name === userName && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0",
                  getAvatarColor(msg.sender_name)
                )}
              >
                {getInitials(msg.sender_name)}
              </div>
              <div
                className={cn(
                  "max-w-[80%]",
                  msg.sender_name === userName && "items-end flex flex-col"
                )}
              >
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-xs font-medium text-white/60">
                    {msg.sender_name}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm",
                    msg.sender_name === userName
                      ? "bg-blue-500 text-white"
                      : "bg-zinc-800 text-white/80"
                  )}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 border-zinc-700 text-white text-sm h-9 placeholder:text-white/30"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="h-9 w-9 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
