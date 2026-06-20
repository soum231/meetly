import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { participantId } = await request.json();
    const supabase = getSupabaseAdmin();

    const { error: participantError } = await (supabase
      .from("participants") as any)
      .update({ left_at: new Date().toISOString() })
      .eq("id", participantId);

    if (participantError) {
      return NextResponse.json(
        { error: "Failed to leave meeting" },
        { status: 500 }
      );
    }

    const { data: remainingParticipants } = await (supabase
      .from("participants") as any)
      .select("id")
      .eq("meeting_id", id)
      .is("left_at", null);

    if (!remainingParticipants || remainingParticipants.length === 0) {
      await (supabase
        .from("meetings") as any)
        .update({ status: "ended", ended_at: new Date().toISOString() })
        .eq("id", id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error leaving meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
