"use client";

import { useId, useRef, useState } from "react";

type AudioInputProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  className?: string;
  allowRecording?: boolean;
};

export function AudioInput({
  value,
  onChange,
  className,
  allowRecording = true,
}: AudioInputProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectFile = (file: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }

    if (!file.type.startsWith("audio/")) {
      setError("Please select a valid audio file.");
      return;
    }

    setError(null);
    onChange(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    selectFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    selectFile(file);
  };

  const stopStreamTracks = () => {
    if (!streamRef.current) {
      return;
    }
    for (const track of streamRef.current.getTracks()) {
      track.stop();
    }
    streamRef.current = null;
  };

  const startRecording = async () => {
    if (!allowRecording) {
      return;
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const recordedFile = new File([blob], "recording.webm", { type: blob.type });
        selectFile(recordedFile);
        stopStreamTracks();
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return;
    }
    recorder.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border border-dashed bg-white p-5 transition ${
          isDragging
            ? "border-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleInputChange}
        />

        <p className="text-sm font-semibold text-slate-800">Audio Upload / Record</p>
        <p className="mt-1 text-xs text-slate-500">
          Drag and drop audio, or click to browse.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Choose Audio
          </button>

          {allowRecording ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (isRecording) {
                  stopRecording();
                } else {
                  void startRecording();
                }
              }}
              className={`rounded-xl px-3 py-2 text-xs font-semibold text-white ${
                isRecording ? "bg-rose-500 hover:bg-rose-600" : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {isRecording ? "Stop Recording" : "Record Audio"}
            </button>
          ) : null}
        </div>

        <p className="mt-4 truncate rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
          {value ? `Selected: ${value.name}` : "No audio selected yet."}
        </p>

        {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
      </div>
    </div>
  );
}
