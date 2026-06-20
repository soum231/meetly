"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { generateUserToken } from "@/lib/stream";
import { generateMeetingId, generatePassword } from "@/lib/utils";

export async function createMeeting(hostName: string) {
  const supabase = getSupabaseAdmin();
  const meetingId = generateMeetingId(10);
  const password = generatePassword();

  const { data: meeting, error } = await (supabase
    .from("meetings") as any)
    .insert({
      meeting_id: meetingId,
      password,
      host_name: hostName,
      status: "waiting",
      recording_enabled: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating meeting:", error);
    return { error: "Failed to create meeting" };
  }

  return { meetingId: meeting.meeting_id, id: meeting.id, password };
}

export async function getMeeting(meetingId: string) {
  const supabase = getSupabaseAdmin();
  const { data: meeting, error } = await (supabase
    .from("meetings") as any)
    .select("*")
    .eq("meeting_id", meetingId)
    .single();

  if (error || !meeting) {
    return { error: "Meeting not found" };
  }

  if (meeting.status === "ended") {
    return { error: "Meeting has ended" };
  }

  return { meeting };
}

export async function joinMeeting(meetingId: string, userName: string) {
  const supabase = getSupabaseAdmin();
  const { data: meeting, error: meetingError } = await (supabase
    .from("meetings") as any)
    .select("*")
    .eq("meeting_id", meetingId)
    .single();

  if (meetingError || !meeting) {
    return { error: "Meeting not found" };
  }

  if (meeting.status === "ended") {
    return { error: "Meeting has ended" };
  }

  const { data: participant, error: participantError } = await (supabase
    .from("participants") as any)
    .insert({
      meeting_id: meeting.id,
      name: userName,
      is_host: false,
      camera_enabled: false,
      mic_enabled: false,
    })
    .select()
    .single();

  if (participantError) {
    console.error("Error adding participant:", participantError);
    return { error: "Failed to join meeting" };
  }

  const userId = participant.id;

  const streamToken = generateUserToken(userId);

  return {
    meeting: {
      id: meeting.id,
      meeting_id: meeting.meeting_id,
      host_name: meeting.host_name,
      status: meeting.status,
      recording_enabled: meeting.recording_enabled,
    },
    participant,
    streamToken,
    userId,
  };
}

export async function leaveMeeting(participantId: string, meetingId: string) {
  const supabase = getSupabaseAdmin();
  const { error: participantError } = await (supabase
    .from("participants") as any)
    .update({ left_at: new Date().toISOString() })
    .eq("id", participantId);

  if (participantError) {
    console.error("Error updating participant:", participantError);
  }

  const { data: remainingParticipants } = await (supabase
    .from("participants") as any)
    .select("id")
    .eq("meeting_id", meetingId)
    .is("left_at", null);

  if (!remainingParticipants || remainingParticipants.length === 0) {
    await (supabase
      .from("meetings") as any)
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", meetingId);
  }

  return { success: true };
}

export async function endMeeting(meetingId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await (supabase
    .from("meetings") as any)
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", meetingId);

  if (error) {
    console.error("Error ending meeting:", error);
    return { error: "Failed to end meeting" };
  }

  return { success: true };
}

export async function startRecording(meetingId: string) {
  const supabase = getSupabaseAdmin();
  const { data: recording, error } = await (supabase
    .from("recordings") as any)
    .insert({
      meeting_id: meetingId,
      status: "started",
      duration: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error starting recording:", error);
    return { error: "Failed to start recording" };
  }

  return { recording };
}

export async function stopRecording(recordingId: string, duration: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await (supabase
    .from("recordings") as any)
    .update({
      status: "stopped",
      duration,
    })
    .eq("id", recordingId);

  if (error) {
    console.error("Error stopping recording:", error);
    return { error: "Failed to stop recording" };
  }

  return { success: true };
}

export async function saveRecordingUrl(
  meetingDbId: string,
  recordingUrl: string,
  duration: number,
  filename: string
) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await (supabase
    .from("recordings") as any)
    .insert({
      meeting_id: meetingDbId,
      recording_url: recordingUrl,
      duration: Math.round(duration),
      status: "stopped",
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving recording:", error);
    return { error: "Failed to save recording" };
  }

  return { recording: data };
}

export async function sendMessage(
  meetingId: string,
  senderName: string,
  message: string
) {
  const supabase = getSupabaseAdmin();
  const { data: chatMessage, error } = await (supabase
    .from("chat_messages") as any)
    .insert({
      meeting_id: meetingId,
      sender_name: senderName,
      message,
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }

  return { message: chatMessage };
}

export async function getMessages(meetingId: string) {
  const supabase = getSupabaseAdmin();
  const { data: messages, error } = await (supabase
    .from("chat_messages") as any)
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: true });

  if (error) {
    return { error: "Failed to load messages" };
  }

  return { messages };
}

export async function getParticipants(meetingId: string) {
  const supabase = getSupabaseAdmin();
  const { data: participants, error } = await (supabase
    .from("participants") as any)
    .select("*")
    .eq("meeting_id", meetingId)
    .is("left_at", null)
    .order("joined_at", { ascending: true });

  if (error) {
    return { error: "Failed to load participants" };
  }

  return { participants };
}
