import React, { useState, useEffect } from 'react';
import BackgroundEffects from './components/BackgroundEffects';
import EnvelopeScreen from './components/EnvelopeScreen';
import LetterScreen from './components/LetterScreen';
import MemeMascot from './components/MemeMascot';
import LikeMascot from './components/LikeMascot';
import AudioBar from './components/AudioBar';
import { audioService } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('envelope'); // 'envelope' | 'letter'
  const [toast, setToast] = useState({ show: false, message: '' });

  // Tự động phát nhạc khi mở web (hỗ trợ unlock tự động nếu trình duyệt chặn autoplay)
  useEffect(() => {
    // 1. Cố gắng phát nhạc ngay lập tức khi mở web
    audioService.startMusic();

    // 2. Nếu chính sách trình duyệt tạm hoãn, chạm/cuộn bất kỳ đâu sẽ kích hoạt nhạc ngay
    const unlockAudio = () => {
      if (!audioService.userPaused) {
        audioService.startMusic();
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    window.addEventListener('click', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    window.addEventListener('scroll', unlockAudio, { once: true, passive: true });

    return cleanup;
  }, []);

  const handleOpenLetter = () => {
    setCurrentScreen('letter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      {/* Background Animated Canvas */}
      <BackgroundEffects />

      {/* Main View Port */}
      <main className="app-container">
        {currentScreen === 'envelope' && (
          <EnvelopeScreen onOpenLetter={handleOpenLetter} />
        )}

        {currentScreen === 'letter' && (
          <LetterScreen />
        )}
      </main>

      {/* Left Corner: Like Mascot (when in letter screen) */}
      {currentScreen === 'letter' && (
        <LikeMascot />
      )}

      {/* Right Corner: Shocked Meme Mascot (when in letter screen) */}
      {currentScreen === 'letter' && (
        <MemeMascot />
      )}

      {/* Romantic Background Audio Player Bar */}
      <AudioBar />

      {/* Toast Notification */}
      <div className={`toast-container ${toast.show ? 'show' : ''}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}


