import { NextResponse } from "next/server";
import { saveRecordingUrl } from "@/actions/meeting";

export async function POST(request: Request) {
  try {
    const { meetingDbId, recordingUrl, duration, filename } = await request.json();

    if (!meetingDbId || !recordingUrl) {
      return NextResponse.json(
        { error: "meetingDbId and recordingUrl are required" },
        { status: 400 }
      );
    }

    const result = await saveRecordingUrl(meetingDbId, recordingUrl, duration, filename);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ recording: result.recording });
  } catch (error) {
    console.error("Error saving recording:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
