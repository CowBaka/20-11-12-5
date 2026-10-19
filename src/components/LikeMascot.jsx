import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio';

export default function LikeMascot() {
  const [bounce, setBounce] = useState(false);
  const [likeCount, setLikeCount] = useState(1);
  const [showTag, setShowTag] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setBounce(true);
    setLikeCount((prev) => prev + 1);
    setShowTag(true);

    // Audio chime
    audioService.playKeyBeep(523.25);
    setTimeout(() => audioService.playKeyBeep(659.25), 100);

    // Mini confetti burst from the left corner
    confetti({
      particleCount: 18,
      spread: 45,
      origin: { x: 0.1, y: 0.85 },
      colors: ['#ffd166', '#ff4d6d', '#ff85a1', '#06d6a0']
    });

    setTimeout(() => setBounce(false), 450);
    setTimeout(() => setShowTag(false), 1400);
  };

  return (
    <aside
      className="floating-like-container"
      onClick={handleLikeClick}
      title="Thả Like cho 12/5! 👍💖"
    >
      <div className={`mascot-like-wrap ${bounce ? 'pop' : ''}`}>
        <img
          src="/meme-like.png"
          alt="Like 12/5"
          className="mascot-like-img"
        />

        {showTag && (
          <div className="like-badge-float">
            +{likeCount} Like! 👍
          </div>
        )}
      </div>
    </aside>
  );
}
