import React from 'react';
import { Sprout, CalendarDays, CloudSunRain, TrendingUp, ArrowRight } from 'lucide-react';
import './HomeSmartHub.css';

export const HomeSmartHub: React.FC = () => {
  return (
    <section className="agriflow-smart-hub-section" aria-label="Farmer Smart Hub">
      <div className="smart-hub-header">
        <h2 className="smart-hub-title">FARMER SMART HUB</h2>
        <p className="smart-hub-subtitle">
          Smart tools and real-time information to help you make the right farming decisions.
        </p>
      </div>

      <div className="smart-hub-grid">
        {/* ================= CARD 1: CROP DOCTOR ================= */}
        <div className="smart-hub-card card-crop-doctor">
          <div className="card-left-info">
            <div className="card-category-badge">
              <Sprout size={18} className="cat-badge-icon" />
              <span className="cat-badge-text">Crop Doctor</span>
            </div>
            <h3 className="card-main-heading">Identify Crop Problems</h3>
            <p className="card-sub-description">
              Upload crop photo &amp; get expert guidance instantly.
            </p>
            <div className="card-button-wrapper">
              <button className="hub-cta-button btn-doctor" type="button">
                <span>Ask Crop Doctor</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="card-right-art art-doctor">
            {/* Hand Holding Smartphone Vector Art */}
            <svg viewBox="0 0 160 210" className="doctor-phone-svg" aria-label="Crop Doctor phone scan">
              <defs>
                <linearGradient id="phoneBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="leafScanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="100%" stopColor="#16A34A" />
                </linearGradient>
                <filter id="phoneShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="-4" dy="8" stdDeviation="6" floodColor="#14532D" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Hand Holding Phone */}
              <g transform="rotate(-6 80 110)" filter="url(#phoneShadow)">
                {/* Fingers on left/back */}
                <rect x="18" y="70" width="16" height="75" rx="8" fill="#FBBF24" opacity="0.85" />
                <rect x="18" y="95" width="16" height="65" rx="8" fill="#F59E0B" opacity="0.75" />

                {/* Smartphone Outer Casing */}
                <rect x="26" y="10" width="108" height="190" rx="22" fill="url(#phoneBodyGrad)" stroke="#334155" strokeWidth="2.5" />

                {/* Screen glass */}
                <rect x="32" y="16" width="96" height="178" rx="16" fill="#FFFFFF" />

                {/* Phone Speaker Notch */}
                <rect x="68" y="21" width="24" height="3.5" rx="1.75" fill="#334155" />

                {/* App UI Header */}
                <rect x="32" y="27" width="96" height="22" fill="#15803D" />
                <circle cx="43" cy="38" r="4" fill="#22C55E" />
                <text x="52" y="41" fontSize="7" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">Crop Doctor</text>

                {/* Camera Viewfinder Area */}
                <rect x="38" y="54" width="84" height="88" rx="10" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />
                
                {/* Viewfinder Corner Brackets */}
                <path d="M44 64 L44 58 L50 58" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M116 64 L116 58 L110 58" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M44 132 L44 138 L50 138" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M116 132 L116 138 L110 138" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Scanning Leaf Inside Screen */}
                <path d="M80 66 C60 76 56 106 80 126 C104 106 100 76 80 66 Z" fill="url(#leafScanGrad)" />
                <path d="M80 66 Q80 96 80 126" stroke="#14532D" strokeWidth="1.5" fill="none" />
                <path d="M80 84 Q68 90 64 96" stroke="#14532D" strokeWidth="1" fill="none" />
                <path d="M80 98 Q92 104 96 110" stroke="#14532D" strokeWidth="1" fill="none" />
                {/* Disease spots on leaf */}
                <circle cx="70" cy="92" r="3.5" fill="#EF4444" opacity="0.9" />
                <circle cx="90" cy="106" r="3" fill="#EAB308" opacity="0.9" />

                {/* Red Laser Scan Line */}
                <line x1="40" y1="96" x2="120" y2="96" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
                <rect x="58" y="90" width="44" height="12" rx="4" fill="#FEE2E2" />
                <text x="80" y="98.5" fontSize="5.5" fontWeight="800" textAnchor="middle" fill="#B91C1C" fontFamily="sans-serif">Leaf Spot Detected</text>

                {/* Bottom App Action Button */}
                <rect x="42" y="150" width="76" height="16" rx="6" fill="#15803D" />
                <text x="80" y="161" fontSize="7" fontWeight="800" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">Get Solution →</text>

                {/* Thumb on right holding phone */}
                <ellipse cx="132" cy="125" rx="10" ry="22" fill="#F59E0B" opacity="0.9" transform="rotate(15 132 125)" />
              </g>
            </svg>
          </div>
        </div>

        {/* ================= CARD 2: CROP CALENDAR ================= */}
        <div className="smart-hub-card card-crop-calendar">
          <div className="card-left-info">
            <div className="card-category-badge">
              <CalendarDays size={18} className="cat-badge-icon" />
              <span className="cat-badge-text">Crop Calendar</span>
            </div>
            <h3 className="card-main-heading">Plan Your Crop Season</h3>
            <p className="card-sub-description">
              Get crop-wise schedule for sowing, irrigation, fertilizer &amp; harvesting.
            </p>
            <div className="card-button-wrapper">
              <button className="hub-cta-button btn-calendar" type="button">
                <span>View Calendar</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="card-right-art art-calendar">
            {/* 3D Standing Desk Calendar with Sprout Art */}
            <svg viewBox="0 0 150 170" className="calendar-desk-svg" aria-label="Crop Calendar illustration">
              <defs>
                <filter id="calShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="-2" dy="8" stdDeviation="5" floodColor="#0F4A8A" floodOpacity="0.2" />
                </filter>
              </defs>

              {/* Plant Sprouting from Top */}
              <g transform="translate(75, 24)">
                <path d="M0 25 C0 10 -18 5 -20 -10 C-10 -15 0 0 0 25 Z" fill="#22C55E" />
                <path d="M0 25 C0 8 18 2 22 -12 C12 -16 0 -2 0 25 Z" fill="#16A34A" />
                <path d="M0 25 C-2 5 0 -18 0 -24 C2 -18 2 5 0 25 Z" fill="#15803D" />
                <circle cx="0" cy="25" r="4" fill="#78350F" />
              </g>

              {/* Calendar Base Pad */}
              <g filter="url(#calShadow)">
                {/* Back page layers for 3D effect */}
                <rect x="19" y="52" width="112" height="106" rx="12" fill="#CBD5E1" />
                <rect x="21" y="50" width="108" height="106" rx="12" fill="#E2E8F0" />
                
                {/* Main White Calendar Sheet */}
                <rect x="23" y="46" width="104" height="108" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

                {/* Top Red Banner */}
                <path d="M23 58 C23 51 28 46 35 46 L115 46 C122 46 127 51 127 58 L127 68 L23 68 Z" fill="#EF4444" />
                <text x="75" y="60" fontSize="7.5" fontWeight="900" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">PLANNING</text>

                {/* Spiral Ring Holes */}
                <circle cx="40" cy="46" r="3.5" fill="#FFFFFF" />
                <rect x="38.5" y="40" width="3" height="8" rx="1.5" fill="#94A3B8" />
                <circle cx="63" cy="46" r="3.5" fill="#FFFFFF" />
                <rect x="61.5" y="40" width="3" height="8" rx="1.5" fill="#94A3B8" />
                <circle cx="87" cy="46" r="3.5" fill="#FFFFFF" />
                <rect x="85.5" y="40" width="3" height="8" rx="1.5" fill="#94A3B8" />
                <circle cx="110" cy="46" r="3.5" fill="#FFFFFF" />
                <rect x="108.5" y="40" width="3" height="8" rx="1.5" fill="#94A3B8" />

                {/* Calendar Days Matrix */}
                <g transform="translate(30, 76)">
                  {[0, 1, 2, 3, 4].map((col) =>
                    [0, 1, 2].map((row) => {
                      const isHighlighted = (col === 1 && row === 0) || (col === 3 && row === 1) || (col === 2 && row === 2);
                      return (
                        <g key={`${col}-${row}`} transform={`translate(${col * 18}, ${row * 22})`}>
                          <rect
                            x="0"
                            y="0"
                            width="14"
                            height="16"
                            rx="3.5"
                            fill={isHighlighted ? '#DBEAFE' : '#F8FAFC'}
                            stroke={isHighlighted ? '#60A5FA' : '#F1F5F9'}
                            strokeWidth="1"
                          />
                          <circle
                            cx="7"
                            cy="8"
                            r={isHighlighted ? 3 : 2}
                            fill={isHighlighted ? '#1D4ED8' : '#94A3B8'}
                          />
                        </g>
                      );
                    })
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* ================= CARD 3: WEATHER UPDATE ================= */}
        <div className="smart-hub-card card-weather">
          <div className="card-left-info">
            <div className="card-category-badge">
              <CloudSunRain size={18} className="cat-badge-icon" />
              <span className="cat-badge-text">Weather Update</span>
            </div>
            <h3 className="card-main-heading">Live Farm Weather</h3>
            <p className="card-sub-description">
              Get real-time weather updates, alerts and 7-day forecast.
            </p>
            <div className="card-button-wrapper">
              <button className="hub-cta-button btn-weather" type="button">
                <span>Check Weather</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="card-right-art art-weather">
            {/* 3D Sun, Cloud & Temperature Badge Vector Art */}
            <svg viewBox="0 0 150 160" className="weather-art-svg" aria-label="Live Weather Illustration">
              <defs>
                <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="60%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#EA580C" />
                </radialGradient>
                <filter id="cloudShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="-2" dy="6" stdDeviation="5" floodColor="#6B21A8" floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Sun Rays */}
              <g transform="translate(60, 48)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1="-34"
                    x2="0"
                    y2="-26"
                    stroke="#F59E0B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${angle})`}
                  />
                ))}
                {/* Glowing Sun Core */}
                <circle cx="0" cy="0" r="24" fill="url(#sunGlowGrad)" />
                {/* Smiling Sun Face */}
                <circle cx="-7" cy="-4" r="2" fill="#78350F" />
                <circle cx="7" cy="-4" r="2" fill="#78350F" />
                <path d="M-6 4 Q0 10 6 4" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>

              {/* 3D Layered Cloud */}
              <g filter="url(#cloudShadow)">
                <ellipse cx="90" cy="82" rx="36" ry="22" fill="#F1F5F9" />
                <circle cx="68" cy="74" r="20" fill="#FFFFFF" />
                <circle cx="94" cy="64" r="24" fill="#FFFFFF" />
                <circle cx="114" cy="76" r="17" fill="#FFFFFF" />
                <ellipse cx="90" cy="84" rx="34" ry="14" fill="#FFFFFF" />
              </g>

              {/* Glassmorphic 28°C Badge */}
              <g transform="translate(48, 114)" filter="url(#cloudShadow)">
                <rect x="0" y="0" width="84" height="34" rx="17" fill="#FFFFFF" stroke="#E9D5FF" strokeWidth="1.5" />
                <text x="42" y="19" fontSize="14" fontWeight="900" textAnchor="middle" fill="#581C87" fontFamily="sans-serif">28°C</text>
                <text x="42" y="29" fontSize="6.5" fontWeight="700" textAnchor="middle" fill="#7E22CE" fontFamily="sans-serif">Partly Cloudy</text>
              </g>
            </svg>
          </div>
        </div>

        {/* ================= CARD 4: DAILY MARKET PRICE ================= */}
        <div className="smart-hub-card card-market">
          <div className="card-left-info">
            <div className="card-category-badge">
              <TrendingUp size={18} className="cat-badge-icon" />
              <span className="cat-badge-text">Daily Market Price</span>
            </div>
            <h3 className="card-main-heading">Today's Agriculture Prices</h3>
            <p className="card-sub-description">
              Check daily market prices of crops, seeds, fertilizers and more.
            </p>
            <div className="card-button-wrapper">
              <button className="hub-cta-button btn-market" type="button">
                <span>View Market Prices</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="card-right-art art-market">
            {/* 3D Bar Chart, Upward Arrow & Golden Coins Vector Art */}
            <svg viewBox="0 0 150 160" className="market-art-svg" aria-label="Market Price Growth Illustration">
              <defs>
                <linearGradient id="barGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="barGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient id="barGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <filter id="chartShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="-2" dy="6" stdDeviation="5" floodColor="#C2410C" floodOpacity="0.2" />
                </filter>
              </defs>

              {/* Chart Grid Lines */}
              <line x1="20" y1="135" x2="135" y2="135" stroke="#FDBA74" strokeWidth="1.5" />
              <line x1="20" y1="95" x2="135" y2="95" stroke="#FED7AA" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="20" y1="55" x2="135" y2="55" stroke="#FED7AA" strokeWidth="1" strokeDasharray="3 3" />

              {/* 3D Bar Columns */}
              <g filter="url(#chartShadow)">
                {/* Bar 1 */}
                <rect x="30" y="95" width="16" height="40" rx="4" fill="url(#barGrad1)" />
                {/* Bar 2 */}
                <rect x="54" y="65" width="16" height="70" rx="4" fill="url(#barGrad2)" />
                {/* Bar 3 */}
                <rect x="78" y="35" width="16" height="100" rx="4" fill="url(#barGrad3)" />

                {/* Dynamic Red Growth Curve Arrow */}
                <path
                  d="M26 115 Q60 95 110 32"
                  stroke="#EF4444"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <polygon points="106,20 120,30 114,44" fill="#EF4444" />
              </g>

              {/* Stack of Shiny Golden Coins */}
              <g transform="translate(108, 102)" filter="url(#chartShadow)">
                {/* Coin 4 (Bottom) */}
                <g transform="translate(0, 24)">
                  <ellipse cx="14" cy="8" rx="14" ry="6" fill="#B45309" />
                  <ellipse cx="14" cy="6" rx="14" ry="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                  <text x="14" y="8" fontSize="6.5" fontWeight="900" textAnchor="middle" fill="#78350F">₹</text>
                </g>
                {/* Coin 3 */}
                <g transform="translate(0, 16)">
                  <ellipse cx="14" cy="8" rx="14" ry="6" fill="#B45309" />
                  <ellipse cx="14" cy="6" rx="14" ry="6" fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
                  <text x="14" y="8" fontSize="6.5" fontWeight="900" textAnchor="middle" fill="#78350F">₹</text>
                </g>
                {/* Coin 2 */}
                <g transform="translate(0, 8)">
                  <ellipse cx="14" cy="8" rx="14" ry="6" fill="#B45309" />
                  <ellipse cx="14" cy="6" rx="14" ry="6" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
                  <text x="14" y="8" fontSize="6.5" fontWeight="900" textAnchor="middle" fill="#78350F">₹</text>
                </g>
                {/* Coin 1 (Top) */}
                <g transform="translate(0, 0)">
                  <ellipse cx="14" cy="8" rx="14" ry="6" fill="#B45309" />
                  <ellipse cx="14" cy="6" rx="14" ry="6" fill="#FEF08A" stroke="#D97706" strokeWidth="1" />
                  <text x="14" y="8" fontSize="6.5" fontWeight="900" textAnchor="middle" fill="#78350F">₹</text>
                </g>
              </g>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
};


