"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [meetingId, setMeetingId] = useState(searchParams.get("meeting") || "");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (!name.trim() || !meetingId.trim()) return;
    setIsJoining(true);
    setError("");
    router.push(`/meeting/${meetingId.trim()}?name=${encodeURIComponent(name.trim())}`);
  };

  return (
    <Card className="w-full max-w-md bg-card border-border">
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
        <CardTitle className="text-foreground text-xl">Join Meeting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-muted-foreground">Your Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meetingId" className="text-muted-foreground">Meeting ID</Label>
          <Input
            id="meetingId"
            placeholder="Enter meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          size="lg"
          onClick={handleJoin}
          disabled={!name.trim() || !meetingId.trim() || isJoining}
        >
          {isJoining ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-4 h-4 mr-2" />
          )}
          Join Meeting
        </Button>
      </CardContent>
    </Card>
  );
}

export default function JoinPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }>
        <JoinForm />
      </Suspense>
    </div>
  );
}
