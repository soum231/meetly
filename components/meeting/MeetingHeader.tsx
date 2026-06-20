"use client";

import { Copy, Clock, BadgeAlert, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeetingStore } from "@/store/useMeetingStore";
import { formatDuration } from "@/lib/utils";
import { toast } from "sonner";

interface MeetingHeaderProps {
  elapsed: number;
}

export function MeetingHeader({ elapsed }: MeetingHeaderProps) {
  const meeting = useMeetingStore((s) => s.meeting);
  const isRecording = useMeetingStore((s) => s.isRecording);
  const isRecordingPaused = useMeetingStore((s) => s.isRecordingPaused);
  const isConnected = useMeetingStore((s) => s.isConnected);

  const copyLink = () => {
    const link = `${window.location.origin}/meeting/${meeting?.meeting_id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-medium text-white">
          {meeting?.host_name}&apos;s Meeting
        </h1>
        <span className="text-xs text-white/40 font-mono">
          {meeting?.meeting_id}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isRecording && !isRecordingPaused && (
          <div className="flex items-center gap-1.5 text-red-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Recording
          </div>
        )}
        {isRecordingPaused && (
          <div className="flex items-center gap-1.5 text-amber-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Paused
          </div>
        )}

        <div className="flex items-center gap-1 text-white/60 text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{formatDuration(elapsed)}</span>
        </div>

        {!isConnected && (
          <div className="flex items-center gap-1 text-yellow-400 text-xs">
            <BadgeAlert className="w-3.5 h-3.5" />
            Reconnecting...
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={copyLink}
          className="text-white/60 hover:text-white h-7 text-xs"
        >
          <Copy className="w-3.5 h-3.5 mr-1" />
          Copy Link
        </Button>

        {meeting?.password && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const text = `Join my Meetly meeting!\n\nLink: ${window.location.origin}/meeting/${meeting?.meeting_id}\nPassword: ${meeting?.password}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="text-white/60 hover:text-white h-7 text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1" />
              WhatsApp
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const text = `Join my Meetly meeting!\n\nLink: ${window.location.origin}/meeting/${meeting?.meeting_id}\nPassword: ${meeting?.password}`;
                window.open(`mailto:?subject=${encodeURIComponent("Join my Meetly meeting")}&body=${encodeURIComponent(text)}`, "_blank");
              }}
              className="text-white/60 hover:text-white h-7 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Email
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
