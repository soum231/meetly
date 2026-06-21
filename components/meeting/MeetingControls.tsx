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
  Pause,
  Play,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMeetingStore } from "@/store/useMeetingStore";
import { useCallback, useState } from "react";
import { SettingsModal } from "@/components/SettingsModal";

interface MeetingControlsProps {
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
  onLeave: () => void;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  isRecordingPaused: boolean;
  isHost: boolean;
}

function ControlButton({
  icon: Icon,
  onClick,
  className = "",
  tooltip,
}: {
  icon: React.ElementType;
  onClick: () => void;
  className?: string;
  tooltip: string;
}) {
  const handleClick = (e: any) => {
    e.preventDefault();
    onClick();
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          onTouchEnd={handleClick}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all active:scale-95 touch-manipulation ${className}`}
        >
          <Icon className="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function MeetingControls({
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onLeave,
  isMicEnabled,
  isCameraEnabled,
  isScreenSharing,
  isRecording,
  isRecordingPaused,
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

  return (
    <>
      <div className="overflow-x-auto flex-shrink-0 bg-black/50 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 min-w-max mx-auto">
          <ControlButton
            icon={isMicEnabled ? Mic : MicOff}
            onClick={onToggleMic}
            className={isMicEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500/80 hover:bg-red-500 text-white"}
            tooltip={isMicEnabled ? "Mute" : "Unmute"}
          />

          <ControlButton
            icon={isCameraEnabled ? Video : VideoOff}
            onClick={onToggleCamera}
            className={isCameraEnabled ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-500/80 hover:bg-red-500 text-white"}
            tooltip={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
          />

          <ControlButton
            icon={isScreenSharing ? Monitor : MonitorUp}
            onClick={onToggleScreenShare}
            className={isScreenSharing ? "bg-blue-500/80 hover:bg-blue-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}
            tooltip={isScreenSharing ? "Stop sharing" : "Share screen"}
          />

          {isHost && !isRecording && !isRecordingPaused && (
            <ControlButton
              icon={Radio}
              onClick={onStartRecording}
              className="bg-white/10 hover:bg-white/20 text-white"
              tooltip="Start recording"
            />
          )}

          {isHost && isRecording && !isRecordingPaused && (
            <>
              <ControlButton
                icon={Pause}
                onClick={onPauseRecording}
                className="bg-amber-500/80 hover:bg-amber-500 text-white"
                tooltip="Pause recording"
              />
              <ControlButton
                icon={Square}
                onClick={onStopRecording}
                className="bg-red-500/80 hover:bg-red-500 text-white"
                tooltip="Stop recording"
              />
            </>
          )}

          {isHost && isRecordingPaused && (
            <>
              <ControlButton
                icon={Play}
                onClick={onResumeRecording}
                className="bg-green-500/80 hover:bg-green-500 text-white"
                tooltip="Resume recording"
              />
              <ControlButton
                icon={Square}
                onClick={onStopRecording}
                className="bg-red-500/80 hover:bg-red-500 text-white"
                tooltip="Stop recording"
              />
            </>
          )}

          <div className="w-px h-6 sm:h-8 bg-white/10 mx-1 flex-shrink-0" />

          <ControlButton
            icon={MessageCircle}
            onClick={openChat}
            className={showSidebar && useMeetingStore.getState().sidebarView === "chat" ? "bg-white/20 text-white" : "bg-white/10 hover:bg-white/20 text-white"}
            tooltip="Chat"
          />

          <ControlButton
            icon={Users}
            onClick={openParticipants}
            className={showSidebar && useMeetingStore.getState().sidebarView === "participants" ? "bg-white/20 text-white" : "bg-white/10 hover:bg-white/20 text-white"}
            tooltip="Participants"
          />

          <ControlButton
            icon={Settings}
            onClick={() => setShowSettings(true)}
            className="bg-white/10 hover:bg-white/20 text-white"
            tooltip="Settings"
          />

          <div className="w-px h-6 sm:h-8 bg-white/10 mx-1 flex-shrink-0" />

          <ControlButton
            icon={PhoneOff}
            onClick={onLeave}
            className="bg-red-500/80 hover:bg-red-500 text-white"
            tooltip="Leave meeting"
          />
        </div>
      </div>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </>
  );
}
