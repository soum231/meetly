"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { MeetingRoom } from "@/components/meeting/MeetingRoom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useMeetingStore } from "@/store/useMeetingStore";

function MeetingPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;

  const [name, setName] = useState(searchParams.get("name") || "");
  const [hostName, setHostName] = useState(searchParams.get("host") || "");
  const [state, setState] = useState<
    "joining" | "lobby" | "connecting" | "connected" | "error"
  >(hostName ? "connecting" : "lobby");
  const [error, setError] = useState("");
  const [meetingData, setMeetingData] = useState<{
    streamToken: string;
    userId: string;
    meetingId: string;
    callId: string;
  } | null>(null);

  const setUser = useMeetingStore((s) => s.setUser);
  const setMeeting = useMeetingStore((s) => s.setMeeting);

  useEffect(() => {
    if (!hostName || !id) return;

    const setupMeeting = async () => {
      setState("connecting");
      try {
        const res = await fetch(`/api/meeting/${id}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName: hostName }),
        });
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setState("error");
          return;
        }

        setUser(data.userId, hostName, true);
        setMeeting(data.meeting);

        setMeetingData({
          streamToken: data.streamToken,
          userId: data.userId,
          meetingId: data.meeting.meeting_id,
          callId: id,
        });

        setState("connected");
      } catch {
        setError("Failed to connect. Please try again.");
        setState("error");
      }
    };

    setupMeeting();
  }, [hostName, id, setUser, setMeeting]);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setState("connecting");
    setError("");

    try {
      const res = await fetch(`/api/meeting/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: name.trim() }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setState("lobby");
        return;
      }

      setUser(data.userId, name.trim(), false);
      setMeeting(data.meeting);

      setMeetingData({
        streamToken: data.streamToken,
        userId: data.userId,
        meetingId: data.meeting.meeting_id,
        callId: id,
      });

      setState("connected");
    } catch {
      setError("Failed to connect. Please try again.");
      setState("lobby");
    }
  };

  if (state === "connected" && meetingData) {
    return (
      <MeetingRoom
        meetingId={meetingData.meetingId}
        streamToken={meetingData.streamToken}
        userId={meetingData.userId}
        userName={hostName || name}
        isHost={!!hostName}
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
            Enter your name to join the meeting
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            size="lg"
            onClick={handleJoin}
            disabled={!name.trim()}
          >
            Join Meeting
          </Button>
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
