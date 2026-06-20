"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
  ParticipantView,
  useCallStateHooks,
  useCall,
  CallingState,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMeetingStore } from "@/store/useMeetingStore";
import { MeetingHeader } from "./MeetingHeader";
import { MeetingControls } from "./MeetingControls";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ParticipantsPanel } from "@/components/participants/ParticipantsPanel";
import { useTimer } from "@/hooks/useTimer";
import { Loader2 } from "lucide-react";

interface MeetingRoomProps {
  meetingId: string;
  streamToken: string;
  userId: string;
  userName: string;
  isHost: boolean;
  callId: string;
}

function MeetingContent({
  meetingId,
  isHost,
}: {
  meetingId: string;
  isHost: boolean;
}) {
  const call = useCall();
  const { useParticipants, useRemoteParticipants, useLocalParticipant } =
    useCallStateHooks();
  const participants = useParticipants();
  const remoteParticipants = useRemoteParticipants();
  const localParticipant = useLocalParticipant();

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const isRecording = useMeetingStore((s) => s.isRecording);
  const setIsRecording = useMeetingStore((s) => s.setIsRecording);
  const showSidebar = useMeetingStore((s) => s.showSidebar);
  const sidebarView = useMeetingStore((s) => s.sidebarView);
  const setParticipants = useMeetingStore((s) => s.setParticipants);
  const setConnected = useMeetingStore((s) => s.setConnected);
  const setConnecting = useMeetingStore((s) => s.setConnecting);
  const router = useRouter();

  const { elapsed, reset } = useTimer(
    call?.state.callingState === CallingState.JOINED
  );

  useEffect(() => {
    if (call?.state.callingState === CallingState.JOINED) {
      setConnected(true);
      setConnecting(false);
    } else if (call?.state.callingState === CallingState.JOINING) {
      setConnecting(true);
      setConnected(false);
    }
  }, [call?.state.callingState, setConnected, setConnecting]);

  useEffect(() => {
    setParticipants(
      participants.map((p) => ({
        id: p.userId || p.sessionId,
        meeting_id: meetingId,
        name: p.name || "Unknown",
        joined_at: new Date().toISOString(),
        is_host: isHost && p.userId === localParticipant?.userId,
        camera_enabled: p.videoStream ? true : false,
        mic_enabled: p.audioStream ? true : false,
      }))
    );
  }, [participants, meetingId, isHost, localParticipant]);

  const handleToggleMic = useCallback(async () => {
    if (!call) return;
    const mic = call.microphone as unknown as { state: { status: string; optimisticStatus: string }; enable: () => Promise<void>; disable: () => Promise<void> };
    const enabled = mic.state.optimisticStatus === 'enabled';
    if (enabled) {
      await mic.disable();
    } else {
      await mic.enable();
    }
  }, [call]);

  const handleToggleCamera = useCallback(async () => {
    if (!call) return;
    const cam = call.camera as unknown as { state: { status: string; optimisticStatus: string }; enable: () => Promise<void>; disable: () => Promise<void> };
    const enabled = cam.state.optimisticStatus === 'enabled';
    if (enabled) {
      await cam.disable();
    } else {
      await cam.enable();
    }
  }, [call]);

  const handleToggleScreenShare = useCallback(async () => {
    if (!call) return;
    const ssManager = (call as unknown as { screenShare: { getStream: () => Promise<MediaStream>; stopPublishStream: () => Promise<void> } }).screenShare;
    if (isScreenSharing) {
      await ssManager.stopPublishStream();
      setIsScreenSharing(false);
    } else {
      await ssManager.getStream();
      setIsScreenSharing(true);
    }
  }, [call, isScreenSharing]);

  const handleToggleRecording = useCallback(async () => {
    if (!call) return;
    if (isRecording) {
      await (call as unknown as { stopRecording: () => Promise<void> }).stopRecording();
      setIsRecording(false);
      try {
        const recordings = await (call as unknown as { queryRecordings: () => Promise<{ recordings: { url: string; filename: string; duration_seconds?: number }[] }> }).queryRecordings();
        const rec = recordings.recordings?.[0];
        if (rec?.url) {
          const meeting = useMeetingStore.getState().meeting;
          await fetch("/api/meeting/recording/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meetingDbId: meeting?.id,
              recordingUrl: rec.url,
              duration: rec.duration_seconds ?? 0,
              filename: rec.filename,
            }),
          });
        }
      } catch (e) {
        console.error("Failed to save recording URL:", e);
      }
    } else {
      await (call as unknown as { startRecording: () => Promise<void> }).startRecording();
      setIsRecording(true);
    }
  }, [call, isRecording, setIsRecording]);

  const handleLeave = useCallback(async () => {
    if (!call) return;
    try {
      await call.leave();
    } catch (e) {
      // ignore
    }
    reset();
    useMeetingStore.getState().reset();
    router.push("/");
  }, [call, router, reset]);

  const micManager = call?.microphone as unknown as { state: { status: string; optimisticStatus: string } } | undefined;
  const camManager = call?.camera as unknown as { state: { status: string; optimisticStatus: string } } | undefined;
  const isMicEnabled = micManager?.state.optimisticStatus === 'enabled';
  const isCameraEnabled = camManager?.state.optimisticStatus === 'enabled';

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <MeetingHeader elapsed={elapsed} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          {participants.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-white/40">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm">Waiting for participants...</p>
              </div>
            </div>
          ) : (
            <div className="h-full p-2">
              {remoteParticipants.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  {localParticipant && (
                    <div className="w-full max-w-md aspect-video rounded-xl overflow-hidden bg-zinc-800">
                      <ParticipantView
                        participant={localParticipant}
                        muteAudio
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="grid gap-2 h-full"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(participants.length, 3)}, 1fr)`,
                    gridAutoRows: "1fr",
                  }}
                >
                  {participants.map((participant) => (
                    <div
                      key={participant.sessionId}
                      className="rounded-xl overflow-hidden bg-zinc-800"
                    >
                      <ParticipantView
                        participant={participant}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {showSidebar && (
          <div className="w-80 border-l border-white/10 flex-shrink-0">
            {sidebarView === "chat" ? (
              <ChatPanel meetingId={meetingId} />
            ) : (
              <ParticipantsPanel />
            )}
          </div>
        )}
      </div>

      <MeetingControls
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleRecording={handleToggleRecording}
        onLeave={handleLeave}
        isMicEnabled={isMicEnabled}
        isCameraEnabled={isCameraEnabled}
        isScreenSharing={isScreenSharing}
        isRecording={isRecording}
        isHost={isHost}
      />
    </div>
  );
}

export function MeetingRoom({
  meetingId,
  streamToken,
  userId,
  userName,
  isHost,
  callId,
}: MeetingRoomProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if (!apiKey) {
      setError("Stream API key not configured");
      return;
    }

    const user = {
      id: userId,
      name: userName,
    };

    const videoClient = new StreamVideoClient({
      apiKey,
      user,
      token: streamToken,
    });

    const videoCall = videoClient.call("default", callId);
    videoCall.join({ create: true });

    setClient(videoClient);
    setCall(videoCall);

    return () => {
      videoCall.leave().catch(() => {});
      videoClient.disconnectUser().catch(() => {});
    };
  }, [meetingId, streamToken, userId, userName, callId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Connection Error</p>
          <p className="text-white/60 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          <p className="text-white/40 text-sm">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme className="!bg-zinc-950">
          <MeetingContent meetingId={meetingId} isHost={isHost} />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}
