"use client";

import { X, Mic, MicOff, Video, VideoOff, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMeetingStore } from "@/store/useMeetingStore";
import { getInitials, getAvatarColor } from "@/lib/utils";

export function ParticipantsPanel() {
  const participants = useMeetingStore((s) => s.participants);
  const setShowSidebar = useMeetingStore((s) => s.setShowSidebar);

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-medium text-white">
          Participants ({participants.length})
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 text-white/40 hover:text-white"
          onClick={() => setShowSidebar(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-2 space-y-1">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white shrink-0 ${getAvatarColor(participant.name)}`}
              >
                {getInitials(participant.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-white font-medium truncate">
                    {participant.name}
                  </span>
                  {participant.is_host && (
                    <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  )}
                </div>
                <span className="text-xs text-white/40">
                  {participant.joined_at
                    ? `Joined ${new Date(participant.joined_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "In meeting"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {participant.mic_enabled ? (
                  <Mic className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 text-red-400" />
                )}
                {participant.camera_enabled ? (
                  <Video className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <VideoOff className="w-3.5 h-3.5 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
