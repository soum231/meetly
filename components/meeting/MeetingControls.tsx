"use client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Monitor,
  MessageCircle,
  Users,
  Settings,
  PhoneOff,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMeetingStore } from "@/store/useMeetingStore";
import { useCallback, useState } from "react";
import { SettingsModal } from "@/components/SettingsModal";
import { useRouter } from "next/navigation";

interface MeetingControlsProps {
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onLeave: () => void;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  isHost: boolean;
}

export function MeetingControls({
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRecording,
  onLeave,
  isMicEnabled,
  isCameraEnabled,
  isScreenSharing,
  isRecording,
  isHost,
}: MeetingControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const setShowSidebar = useMeetingStore((s) => s.setShowSidebar);
  const setSidebarView = useMeetingStore((s) => s.setSidebarView);
  const showSidebar = useMeetingStore((s) => s.showSidebar);

  const openChat = useCallback(() => {
    setSidebarView("chat");
    setShowSidebar(!showSidebar || useMeetingStore.getState().sidebarView !== "chat");
  }, [setSidebarView, setShowSidebar, showSidebar]);

  const openParticipants = useCallback(() => {
    setSidebarView("participants");
    setShowSidebar(!showSidebar || useMeetingStore.getState().sidebarView !== "participants");
  }, [setSidebarView, setShowSidebar, showSidebar]);

  const controlButtonClass =
    "w-10 h-10 rounded-full flex items-center justify-center transition-all";

  return (
    <>
      <div className="flex items-center justify-center gap-2 px-4 py-3 bg-black/50 backdrop-blur-sm border-t border-white/10">
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMic}
              className={`${controlButtonClass} ${
                isMicEnabled
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-red-500/80 hover:bg-red-500 text-white"
              }`}
            >
              {isMicEnabled ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isMicEnabled ? "Mute" : "Unmute"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCamera}
              className={`${controlButtonClass} ${
                isCameraEnabled
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-red-500/80 hover:bg-red-500 text-white"
              }`}
            >
              {isCameraEnabled ? (
                <Video className="w-5 h-5" />
              ) : (
                <VideoOff className="w-5 h-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isCameraEnabled ? "Turn off camera" : "Turn on camera"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleScreenShare}
              className={`${controlButtonClass} ${
                isScreenSharing
                  ? "bg-blue-500/80 hover:bg-blue-500 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isScreenSharing ? (
                <Monitor className="w-5 h-5" />
              ) : (
                <MonitorUp className="w-5 h-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isScreenSharing ? "Stop sharing" : "Share screen"}
          </TooltipContent>
        </Tooltip>

        {isHost && (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleRecording}
                className={`${controlButtonClass} ${
                  isRecording
                    ? "bg-red-500/80 hover:bg-red-500 text-white animate-pulse"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                <Radio className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? "Stop recording" : "Start recording"}
            </TooltipContent>
          </Tooltip>
        )}

        <div className="w-px h-8 bg-white/10 mx-1" />

        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={openChat}
              className={`${controlButtonClass} ${
                showSidebar && useMeetingStore.getState().sidebarView === "chat"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Chat</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={openParticipants}
              className={`${controlButtonClass} ${
                showSidebar && useMeetingStore.getState().sidebarView === "participants"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Users className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Participants</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className={`${controlButtonClass} bg-white/10 hover:bg-white/20 text-white`}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>

        <div className="w-px h-8 bg-white/10 mx-1" />

        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLeave}
              className={`${controlButtonClass} bg-red-500/80 hover:bg-red-500 text-white`}
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Leave meeting</TooltipContent>
        </Tooltip>
      </div>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </>
  );
}
