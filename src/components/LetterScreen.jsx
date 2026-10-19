import React from 'react';
import { CARD_DATA } from '../data/content';

export default function LetterScreen() {
  return (
    <section className="screen-wrapper active letter-screen">
      {/* The Grand Letter Container */}

      {/* The Grand Letter Container */}
      <article className="grand-letter">
        
        {/* Header Section */}
        <header className="letter-header">
          <h1 className="letter-title">
            CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10<br />
            <span className="class-highlight">– TẬP THỂ LỚP 12/5 –</span>
          </h1>

          <div className="letter-subtitle">
            "Nhân ngày 20/10, chúc <strong>12 bông hoa xinh đẹp</strong> của lớp 12/5 luôn rạng rỡ, vui vẻ và hạnh phúc! 🌷"
          </div>
        </header>

        {/* 12 Girls Grid */}
        <div className="girls-grid">
          {CARD_DATA.girls.map((girl, idx) => (
            <div key={girl.id} className="girl-card">
              <div className="girl-top">
                <div className="girl-avatar">
                  {girl.initials}
                </div>
                <div className="girl-info">
                  <span className="girl-number">#{String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="girl-name">{girl.name}</h3>
                </div>
              </div>
              <p className="girl-wish">{girl.wish}</p>
            </div>
          ))}
        </div>

        {/* Class Message & Wishes */}
        <div className="class-message-box">
          <p>
            💖 <strong>Chúc tất cả các bạn nữ lớp 12/5</strong> có một ngày 20/10 thật ý nghĩa, luôn xinh đẹp, học tập tốt, tình bạn bền lâu và thanh xuân cấp ba đầy ắp những kỷ niệm đáng nhớ.
          </p>
          <p>
            Mong rằng mỗi ngày đến lớp đều là một ngày vui, mỗi ước mơ đều có cơ hội trở thành hiện thực!
          </p>
          <div className="class-cheer">
            {CARD_DATA.cheer}
          </div>
        </div>

      </article>
    </section>
  );
}
