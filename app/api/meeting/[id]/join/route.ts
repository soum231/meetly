import { NextRequest, NextResponse } from "next/server";
import { getMeeting } from "@/actions/meeting";
import { generateUserToken } from "@/lib/stream";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userName } = await request.json();

    if (!userName || typeof userName !== "string" || userName.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const meetingResult = await getMeeting(id);

    if (meetingResult.error || !meetingResult.meeting) {
      return NextResponse.json(
        { error: meetingResult.error || "Meeting not found" },
        { status: 404 }
      );
    }

    const meeting = meetingResult.meeting;
    const supabase = getSupabaseAdmin();
    const userId = crypto.randomUUID();

    const { data: participant, error: participantError } = await (supabase
      .from("participants") as any)
      .insert({
        meeting_id: meeting.id,
        name: userName.trim(),
        is_host: false,
        camera_enabled: false,
        mic_enabled: false,
      })
      .select()
      .single();

    if (participantError) {
      return NextResponse.json(
        { error: "Failed to join meeting" },
        { status: 500 }
      );
    }

    const streamToken = generateUserToken(userId);

    return NextResponse.json({
      meeting,
      participant,
      streamToken,
      userId,
    });
  } catch (error) {
    console.error("Error joining meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
