import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createHmac } from "node:crypto";

async function verifySignature(
  body: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) return false;
  const secret = process.env.STREAM_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    const isValid = await verifySignature(body, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const { type, call_cid, recording_url, duration_seconds, filename } =
      event?.data || {};

    if (type !== "call.recording_ready" || !call_cid || !recording_url) {
      return NextResponse.json({ received: true });
    }

    const callId = call_cid.split(":")[1];

    const supabase = getSupabaseAdmin();
    const { data: meeting } = await (supabase
      .from("meetings") as any)
      .select("id")
      .eq("meeting_id", callId)
      .single();

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await (supabase.from("recordings") as any).insert({
      meeting_id: meeting.id,
      recording_url,
      duration: Math.round(duration_seconds ?? 0),
      status: "stopped",
    });

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
