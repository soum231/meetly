import { NextRequest, NextResponse } from "next/server";
import { getMeeting } from "@/actions/meeting";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getMeeting(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ meeting: result.meeting });
  } catch (error) {
    console.error("Error getting meeting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
