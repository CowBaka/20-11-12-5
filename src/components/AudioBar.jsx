import React, { useState, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { audioService } from '../utils/audio';

export default function AudioBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Subscribe to audio state so any trigger syncs the button state
    const unsubscribe = audioService.subscribe((state) => {
      setIsPlaying(state);
    });
    return () => unsubscribe();
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    audioService.toggleMusic();
  };

  return (
    <button
      type="button"
      className={`music-toggle-btn no-print ${isPlaying ? 'playing' : 'paused'}`}
      onClick={toggle}
      title={isPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc'}
      aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc'}
    >
      {isPlaying ? (
        <Music size={22} className="music-note-spin" />
      ) : (
        <VolumeX size={20} className="music-note-muted" />
      )}
      {isPlaying && <span className="music-pulse-glow" aria-hidden="true" />}
    </button>
  );
}


