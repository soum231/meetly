import { NextResponse } from "next/server";
import { createMeeting } from "@/actions/meeting";
import { generateUserToken } from "@/lib/stream";

export async function POST(request: Request) {
  try {
    const { hostName } = await request.json();

    if (!hostName || typeof hostName !== "string" || hostName.trim().length === 0) {
      return NextResponse.json(
        { error: "Host name is required" },
        { status: 400 }
      );
    }

    const result = await createMeeting(hostName.trim());

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const userId = crypto.randomUUID();
    const streamToken = generateUserToken(userId);

    return NextResponse.json({
      meetingId: result.meetingId,
      id: result.id,
      userId,
      streamToken,
    });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
