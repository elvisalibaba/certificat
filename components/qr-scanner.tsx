"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type BarcodeDetectorConstructor = new (options?: {
  formats?: string[];
}) => {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

export function QrScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("Camera inactive.");

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let frame = 0;

    async function start() {
      if (!window.BarcodeDetector) {
        setMessage("Lecteur QR non supporte par ce navigateur. Utilisez la saisie manuelle.");
        setActive(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        setMessage("Placez le QR code dans le cadre.");

        const scan = async () => {
          if (cancelled || !videoRef.current) return;
          const codes = await detector.detect(videoRef.current);
          const value = codes[0]?.rawValue;

          if (value) {
            const code = extractVerificationCode(value);
            window.location.href = `/verify/${encodeURIComponent(code)}`;
            return;
          }

          frame = window.requestAnimationFrame(scan);
        };

        frame = window.requestAnimationFrame(scan);
      } catch {
        setMessage("Impossible d'ouvrir la camera. Verifiez les permissions du navigateur.");
        setActive(false);
      }
    }

    start();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [active]);

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="aspect-video overflow-hidden rounded-md bg-stone-950">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">{message}</p>
        <Button type="button" variant={active ? "outline" : "default"} onClick={() => setActive((value) => !value)}>
          {active ? <CameraOff size={18} /> : <Camera size={18} />}
          {active ? "Arreter" : "Scanner"}
        </Button>
      </div>
    </div>
  );
}

function extractVerificationCode(value: string) {
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.at(-1) ?? value;
  } catch {
    return value;
  }
}
