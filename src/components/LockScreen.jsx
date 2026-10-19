import React, { useState, useEffect } from 'react';
import { Heart, Delete } from 'lucide-react';
import { audioService } from '../utils/audio';

export default function LockScreen({ onUnlock, showToast }) {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const correctPin = '2009';

  const handlePress = (digit) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      audioService.playKeyBeep(420 + nextPin.length * 75);

      if (nextPin.length === 4) {
        setTimeout(() => checkPin(nextPin), 180);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      audioService.playKeyBeep(320);
    }
  };

  const handleClear = () => {
    setPin('');
    audioService.playKeyBeep(260);
  };

  const checkPin = (enteredPin) => {
    if (enteredPin === correctPin) {
      audioService.playSuccess();
      setTimeout(() => {
        onUnlock();
      }, 300);
    } else {
      audioService.playError();
      setIsError(true);
      showToast('❌ Mật khẩu chưa chính xác! Gợi ý: 2009');
      setTimeout(() => {
        setPin('');
        setIsError(false);
      }, 650);
    }
  };

  // Keyboard typing support for desktop!
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handlePress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <section className="screen-wrapper active">
      <div className="lock-card">
        <div className="lock-icon-wrapper">
          <Heart size={34} fill="currentColor" />
        </div>

        <h1 className="lock-title">Chúc mừng Ngày 20/10</h1>
        <p className="lock-desc">Nhập mã PIN gồm 4 chữ số để mở phong thư</p>

        {/* 4-digit PIN dots */}
        <div className={`pin-display ${isError ? 'shake' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`pin-dot ${index < pin.length ? 'filled' : ''} ${isError ? 'error' : ''}`}
            />
          ))}
        </div>

        {/* Number Keypad */}
        <div className="keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              className="key-btn"
              onClick={() => handlePress(digit)}
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            className="key-btn action-key"
            onClick={handleClear}
            title="Xóa hết"
          >
            C
          </button>
          <button
            type="button"
            className="key-btn"
            onClick={() => handlePress('0')}
          >
            0
          </button>
          <button
            type="button"
            className="key-btn action-key"
            onClick={handleBackspace}
            title="Xóa số vừa gõ"
          >
            <Delete size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
