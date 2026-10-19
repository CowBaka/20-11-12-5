import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import { audioService } from '../utils/audio';

export default function EnvelopeScreen({ onOpenLetter }) {
  // 'idle' -> 'walking' -> 'open' -> 'complete'
  const [phase, setPhase] = useState('idle');

  const handleTrigger = () => {
    if (phase !== 'idle') return;

    // 1. Walking phase: Unicorn walks gently along a curved trajectory over 2.2s
    setPhase('walking');

    // Gentle melodic chimes along the trajectory
    audioService.playKeyBeep(349.23);
    setTimeout(() => audioService.playKeyBeep(392), 450);
    setTimeout(() => audioService.playKeyBeep(440), 900);
    setTimeout(() => audioService.playKeyBeep(523.25), 1350);
    setTimeout(() => audioService.playKeyBeep(659.25), 1800);

    // 2. Arrives at envelope at 2200ms -> envelope opens smoothly
    setTimeout(() => {
      setPhase('open');
      audioService.playSuccess();

      // Confetti celebration
      confetti({
        particleCount: 95,
        spread: 90,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#ff4d6d', '#ffd166', '#06d6a0', '#118ab2', '#ff758f']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.08, y: 0.65 },
          colors: ['#ff4d6d', '#ffd166', '#ff85a1']
        });
      }, 140);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.92, y: 0.65 },
          colors: ['#06d6a0', '#118ab2', '#ffd166']
        });
      }, 220);
    }, 2200);

    // 3. Smooth transition to reading letter
    setTimeout(() => {
      setPhase('complete');
      onOpenLetter();
      audioService.startMusic();
    }, 3600);
  };

  const isEnvelopeOpen = phase === 'open' || phase === 'complete';

  return (
    <section className="screen-wrapper active envelope-scene-wrapper" onClick={handleTrigger}>
      {/* Unicorn Actor (clean without neon glow and without speech tag) */}
      <div className={`flying-unicorn-actor ${phase}`}>
        <div className="unicorn-actor-inner">
          <img
            src="/meme-unicorn.jpg"
            alt="Kỳ lân lớp 12/5"
            className="unicorn-actor-img"
          />
        </div>
      </div>

      {/* 3D Envelope */}
      <div className="envelope-container">
        <div className={`envelope ${isEnvelopeOpen ? 'open' : ''}`}>
          <div className="envelope-flap"></div>
          <div className="envelope-pocket"></div>

          <div className="envelope-letter-peek">
            <div className="peek-icon">💌</div>
            <h3 className="peek-title">Dành tặng Lớp 12/5</h3>
            <p className="peek-subtitle">
              {isEnvelopeOpen ? 'Bức thư đang bung tỏa! ✨' : 'Chạm để mở thư 🌷'}
            </p>
          </div>

          <div className="wax-seal">
            <Heart size={24} fill="#8c4e00" color="#8c4e00" />
          </div>
        </div>
      </div>

      {/* Prompt Bar (only shown when envelope has opened) */}
      {phase === 'open' && (
        <div className="envelope-prompt">
          <Sparkles size={20} className="prompt-icon" />
          <span>Bức thư đã được mở! 💌✨</span>
        </div>
      )}
    </section>
  );
}
