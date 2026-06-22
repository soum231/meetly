export type Meeting = {
  id: string;
  meeting_id: string;
  password: string;
  host_name: string;
  host_user_id?: string;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  status: "waiting" | "active" | "ended";
  recording_enabled: boolean;
};

export type Participant = {
  id: string;
  meeting_id: string;
  name: string;
  joined_at?: string;
  left_at?: string;
  is_host?: boolean;
  camera_enabled: boolean;
  mic_enabled: boolean;
};

export type ChatMessage = {
  id: string;
  meeting_id: string;
  sender_name: string;
  message: string;
  created_at: string;
};

export type Recording = {
  id: string;
  meeting_id: string;
  recording_url: string;
  duration: number;
  status: "started" | "stopped" | "failed";
  created_at: string;
};

export type MeetingSettings = {
  videoDevice: string;
  audioDevice: string;
  speakerDevice: string;
  quality: "auto" | "720p" | "1080p";
  mirrorVideo: boolean;
  noiseSuppression: boolean;
};

export type LayoutMode = "grid" | "speaker" | "sidebar";
