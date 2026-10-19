import React from 'react';

export default function MemeMascot() {
  return (
    <aside className="floating-mascot-container" aria-hidden="true">
      <div className="mascot-shocked-wrap">
        <img
          src="/meme-shocked.png"
          alt="Meme kinh ngạc"
          className="mascot-shocked-img"
        />
      </div>
    </aside>
  );
}
