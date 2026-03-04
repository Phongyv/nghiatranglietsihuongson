'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;

    // Try autoplay on mount
    audio.play().catch(() => {
      // Autoplay blocked — wait for first user interaction
    });

    const handleInteraction = () => {
      if (!startedRef.current && audio.paused) {
        audio.volume = 0.3;
        audio.play().then(() => {
          startedRef.current = true;
        }).catch(() => {});
      }
    };

    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    events.forEach((e) => document.addEventListener(e, handleInteraction, { once: true }));

    return () => {
      events.forEach((e) => document.removeEventListener(e, handleInteraction));
    };
  }, []);

  return <audio ref={audioRef} src="/assets/music.mp3" loop preload="auto" />;
}
