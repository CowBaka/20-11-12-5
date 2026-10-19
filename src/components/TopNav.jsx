import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Lock } from 'lucide-react';

export default function TopNav({ onLock }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <nav className="top-nav no-print">
      <button
        type="button"
        className="nav-btn"
        onClick={toggleFullscreen}
        title="Toàn màn hình"
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
      </button>

      <button
        type="button"
        className="nav-btn"
        onClick={onLock}
        title="Khóa thiệp"
      >
        <Lock size={16} />
        <span>Khóa lại</span>
      </button>
    </nav>
  );
}
