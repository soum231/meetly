"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMeetingStore } from "@/store/useMeetingStore";
import { useCallback } from "react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const settings = useMeetingStore((s) => s.settings);
  const updateSettings = useMeetingStore((s) => s.updateSettings);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60">Video</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="mirror" className="text-sm">Mirror video</Label>
              <Switch
                id="mirror"
                checked={settings.mirrorVideo}
                onCheckedChange={(checked) =>
                  updateSettings({ mirrorVideo: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="noise" className="text-sm">Noise suppression</Label>
              <Switch
                id="noise"
                checked={settings.noiseSuppression}
                onCheckedChange={(checked) =>
                  updateSettings({ noiseSuppression: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60">Quality</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="quality" className="text-sm">Video quality</Label>
              <select
                id="quality"
                value={settings.quality}
                onChange={(e) =>
                  updateSettings({
                    quality: e.target.value as "auto" | "720p" | "1080p",
                  })
                }
                className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-sm text-white"
              >
                <option value="auto">Auto</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
