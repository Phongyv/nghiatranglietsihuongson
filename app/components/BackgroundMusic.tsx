'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const unmutedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlayMuted = async () => {
      try {
        audio.muted = true;
        await audio.play();
      } catch {
        // Browser policy may still block in some environments
      }
    };

    const tryUnmute = () => {
      if (unmutedRef.current) return;
      if (audio.paused) return;

      audio.muted = false;
      audio.volume = 0.3;
      unmutedRef.current = true;
    };

    const bootstrapAutoplay = async () => {
      await tryPlayMuted();
      tryUnmute();
    };

    audio.volume = 0.3;
    audio.preload = 'auto';

    void bootstrapAutoplay();

    const retryTimer = window.setInterval(() => {
      if (!audio.paused) {
        tryUnmute();
        return;
      }
      void bootstrapAutoplay();
    }, 800);

    const handleInteraction = () => {
      if (audio.paused) {
        void bootstrapAutoplay();
      } else {
        tryUnmute();
      }
    };

    const handleVisibilityWake = () => {
      if (!document.hidden && audio.paused) {
        void bootstrapAutoplay();
      } else if (!document.hidden) {
        tryUnmute();
      }
    };

    const handleCanPlay = () => {
      if (audio.paused) {
        void bootstrapAutoplay();
      } else {
        tryUnmute();
      }
    };

    const handlePlaying = () => {
      tryUnmute();
    };

    const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll', 'pointerdown'];
    interactionEvents.forEach((eventName) =>
      document.addEventListener(eventName, handleInteraction, { passive: true })
    );
    document.addEventListener('visibilitychange', handleVisibilityWake);
    window.addEventListener('focus', handleVisibilityWake);
    window.addEventListener('pageshow', handleVisibilityWake);
    window.addEventListener('load', handleCanPlay);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);

    const stopRetryTimer = window.setTimeout(() => {
      window.clearInterval(retryTimer);
    }, 12000);

    return () => {
      window.clearInterval(retryTimer);
      window.clearTimeout(stopRetryTimer);
      interactionEvents.forEach((eventName) =>
        document.removeEventListener(eventName, handleInteraction)
      );
      document.removeEventListener('visibilitychange', handleVisibilityWake);
      window.removeEventListener('focus', handleVisibilityWake);
      window.removeEventListener('pageshow', handleVisibilityWake);
      window.removeEventListener('load', handleCanPlay);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/assets/music.mp3"
      autoPlay
      muted
      loop
      preload="auto"
      playsInline
    />
  );
}
