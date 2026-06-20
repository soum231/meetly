import { create } from "zustand";
import type { Meeting, Participant, ChatMessage, MeetingSettings, LayoutMode } from "@/types";

interface MeetingState {
  // User
  userId: string;
  userName: string;
  isHost: boolean;
  setUser: (userId: string, userName: string, isHost: boolean) => void;

  // Meeting
  meeting: Meeting | null;
  setMeeting: (meeting: Meeting | null) => void;

  // Participants
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;

  // Chat
  messages: ChatMessage[];
  unreadCount: number;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearUnread: () => void;

  // Layout
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  sidebarView: "chat" | "participants";
  setSidebarView: (view: "chat" | "participants") => void;

  // Recording
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;

  // Settings
  settings: MeetingSettings;
  updateSettings: (settings: Partial<MeetingSettings>) => void;

  // Call state
  isConnecting: boolean;
  setConnecting: (connecting: boolean) => void;
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

const defaultSettings: MeetingSettings = {
  videoDevice: "",
  audioDevice: "",
  speakerDevice: "",
  quality: "auto",
  mirrorVideo: true,
  noiseSuppression: true,
};

export const useMeetingStore = create<MeetingState>((set) => ({
  userId: "",
  userName: "",
  isHost: false,
  setUser: (userId, userName, isHost) => set({ userId, userName, isHost }),

  meeting: null,
  setMeeting: (meeting) => set({ meeting }),

  participants: [],
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),
  removeParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== id),
    })),
  updateParticipant: (id, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  messages: [],
  unreadCount: 0,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      unreadCount: state.unreadCount + 1,
    })),
  clearUnread: () => set({ unreadCount: 0 }),

  layoutMode: "grid",
  setLayoutMode: (layoutMode) => set({ layoutMode }),
  showSidebar: false,
  setShowSidebar: (showSidebar) => set({ showSidebar }),
  sidebarView: "chat",
  setSidebarView: (sidebarView) => set({ sidebarView }),

  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),

  settings: defaultSettings,
  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),

  isConnecting: false,
  setConnecting: (isConnecting) => set({ isConnecting }),
  isConnected: false,
  setConnected: (isConnected) => set({ isConnected }),
  error: null,
  setError: (error) => set({ error }),

  reset: () =>
    set({
      meeting: null,
      participants: [],
      messages: [],
      unreadCount: 0,
      isRecording: false,
      isConnecting: false,
      isConnected: false,
      error: null,
      showSidebar: false,
    }),
}));
