"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { MeetingRoom } from "@/components/meeting/MeetingRoom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Loader2, Copy, MessageCircle, ExternalLink } from "lucide-react";
import { useMeetingStore } from "@/store/useMeetingStore";
import { toast } from "sonner";

function MeetingPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;

  const [password, setPassword] = useState(searchParams.get("pw") || "");
  const [guestName, setGuestName] = useState("");
  const [meetingInfo, setMeetingInfo] = useState<{
    password: string;
    host_name: string;
  } | null>(null);
  const [state, setState] = useState<
    "lobby" | "connecting" | "connected" | "error"
  >("lobby");
  const [error, setError] = useState("");
  const [meetingData, setMeetingData] = useState<{
    streamToken: string;
    userId: string;
    meetingId: string;
    callId: string;
    isHost: boolean;
  } | null>(null);

  const setUser = useMeetingStore((s) => s.setUser);
  const setMeeting = useMeetingStore((s) => s.setMeeting);

  useEffect(() => {
    fetch(`/api/meeting/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.meeting) {
          setMeetingInfo({ password: data.meeting.password, host_name: data.meeting.host_name });
        }
      })
      .catch(() => {});
  }, [id]);

  const generateGuestName = () => {
    const adjectives = ["Swift", "Bold", "Calm", "Wise", "Neon", "Peak", "Zen", "Arc", "Flux", "Nova"];
    const nouns = ["Panda", "Falcon", "Tiger", "Echo", "Orbit", "Wave", "Pixel", "Storm", "Blaze", "Harbor"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
  };

  const handleJoin = async () => {
    if (!password.trim()) return;
    const name = generateGuestName();
    setGuestName(name);
    setState("connecting");
    setError("");

    try {
      const res = await fetch(`/api/meeting/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: name, password: password.trim() }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setState("lobby");
        return;
      }

      setUser(data.userId, name, data.isHost);
      setMeeting(data.meeting);

      setMeetingData({
        streamToken: data.streamToken,
        userId: data.userId,
        meetingId: data.meeting.meeting_id,
        callId: id,
        isHost: data.isHost,
      });

      setState("connected");
    } catch {
      setError("Failed to connect. Please try again.");
      setState("lobby");
    }
  };

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/meeting/${id}`;
  const shareText = `Join my Meetly meeting!\n\nLink: ${shareUrl}\nPassword: ${meetingInfo?.password || "(ask host)"}`;

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  const shareEmail = () => window.open(`mailto:?subject=${encodeURIComponent("Join my Meetly meeting")}&body=${encodeURIComponent(shareText)}`, "_blank");
  const copyInvite = () => { navigator.clipboard.writeText(shareText); toast.success("Invite copied"); };

  if (state === "connected" && meetingData) {
    return (
      <MeetingRoom
        meetingId={meetingData.meetingId}
        streamToken={meetingData.streamToken}
        userId={meetingData.userId}
        userName={guestName}
        isHost={meetingData.isHost}
        callId={meetingData.callId}
      />
    );
  }

  if (state === "connecting") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          <p className="text-white/40 text-sm">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white/60 text-center">
              {error || "Meeting not found"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-white/40 text-sm mb-4">
              This meeting may have ended or the link is invalid.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Image
              src="/logo.png"
              alt="Meetly"
              width={96}
              height={28}
              className="h-7 w-auto"
            />
          </div>
          <CardTitle className="text-white text-xl">
            Join Meeting
          </CardTitle>
          <p className="text-white/40 text-sm">
            Enter the meeting password to join
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Meeting password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30 font-mono tracking-wider text-center text-lg"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            autoFocus
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            size="lg"
            onClick={handleJoin}
            disabled={!password.trim()}
          >
            Join Meeting
          </Button>

          <div className="pt-2 border-t border-zinc-700">
            <p className="text-xs text-white/40 text-center mb-3">Share this meeting</p>
            <div className="flex items-center justify-center gap-2">
              <Button variant="ghost" size="sm" onClick={shareWhatsApp} className="text-white/60 hover:text-white text-xs">
                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
              </Button>
              <Button variant="ghost" size="sm" onClick={shareEmail} className="text-white/60 hover:text-white text-xs">
                <ExternalLink className="w-4 h-4 mr-1" /> Email
              </Button>
              <Button variant="ghost" size="sm" onClick={copyInvite} className="text-white/60 hover:text-white text-xs">
                <Copy className="w-4 h-4 mr-1" /> Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MeetingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
        </div>
      }
    >
      <MeetingPageInner />
    </Suspense>
  );
}
