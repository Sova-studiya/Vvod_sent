import React from 'react';

interface SceneProps {
  imageKey: string;
  className?: string;
  isInteractive?: boolean;
  onObjectClick?: (objectName: string) => void;
}

export const SceneIllustration: React.FC<SceneProps> = ({
  imageKey,
  className = 'w-full h-full',
  isInteractive = true,
  onObjectClick,
}) => {
  switch (imageKey) {
    case 'cup-rug':
      // The cup is on the rug: blue spotted cup with zebra handle on colorful patchwork rug
      return (
        <svg viewBox="0 0 400 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
            <filter id="shadow1" x1="-10%" y1="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.15" />
            </filter>
            <pattern id="patch1" width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="15" height="15" fill="#fde047" />
              <rect x="15" width="15" height="15" fill="#f87171" />
              <rect y="15" width="15" height="15" fill="#60a5fa" />
              <rect x="15" y="15" width="15" height="15" fill="#4ade80" />
            </pattern>
          </defs>

          {/* Background Table / Floor */}
          <rect width="400" height="320" fill="url(#bgGrad1)" rx="16" />
          <ellipse cx="200" cy="275" rx="170" ry="25" fill="#cbd5e1" opacity="0.4" />

          {/* THE RUG (Patchwork mat with black & white border) */}
          <g 
            id="scene-rug"
            className={isInteractive ? 'cursor-pointer hover:opacity-95 transition-transform duration-200 hover:scale-[1.01]' : ''}
            onClick={() => onObjectClick?.('rug')}
          >
            {/* Rug Shadow */}
            <path d="M 50 170 Q 200 155 350 170 Q 360 270 330 275 Q 200 290 70 275 Q 40 270 50 170 Z" fill="#94a3b8" opacity="0.3" />
            
            {/* Outer striped border */}
            <path d="M 55 165 Q 200 150 345 165 Q 355 265 325 270 Q 200 285 75 270 Q 45 265 55 165 Z" fill="#0f172a" stroke="#0f172a" strokeWidth="2" />
            
            {/* Striped dashes */}
            <path d="M 60 168 Q 200 153 340 168 Q 350 262 320 267 Q 200 282 80 267 Q 50 262 60 168 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" strokeDasharray="12 12" />

            {/* Rug Body with Patchwork Colors */}
            <path d="M 70 175 Q 200 162 330 175 Q 338 252 312 258 Q 200 270 88 258 Q 62 252 70 175 Z" fill="url(#patch1)" />

            {/* Patchwork Grid lines */}
            <path d="M 200 162 Q 200 215 200 270 M 135 168 Q 135 215 135 265 M 265 168 Q 265 215 265 265" stroke="#e2e8f0" strokeWidth="2" opacity="0.6" />

            {/* Rug Label Tag */}
            <g transform="translate(275, 245)">
              <rect width="48" height="22" rx="6" fill="#1e293b" opacity="0.85" />
              <text x="24" y="15" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">RUG</text>
            </g>
          </g>

          {/* THE CUP (Blue ceramic cup with polka dots and striped pedestal) */}
          <g 
            id="scene-cup"
            className={isInteractive ? 'cursor-pointer hover:opacity-95 transition-transform duration-200 hover:scale-105' : ''}
            onClick={() => onObjectClick?.('cup')}
            transform="translate(0, -10)"
          >
            {/* Cup Base Pedestal (Striped) */}
            <ellipse cx="200" cy="218" rx="42" ry="12" fill="#0f172a" />
            <path d="M 160 215 L 175 195 L 225 195 L 240 215 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
            <line x1="178" y1="195" x2="170" y2="215" stroke="#0f172a" strokeWidth="4" />
            <line x1="192" y1="195" x2="188" y2="215" stroke="#0f172a" strokeWidth="4" />
            <line x1="208" y1="195" x2="212" y2="215" stroke="#0f172a" strokeWidth="4" />
            <line x1="222" y1="195" x2="230" y2="215" stroke="#0f172a" strokeWidth="4" />

            {/* Zebra Striped Handle */}
            <path d="M 160 115 C 95 105 85 180 162 188 C 145 175 130 135 162 125" fill="#f8fafc" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
            <path d="M 115 125 L 132 135 M 102 145 L 122 150 M 110 168 L 132 165 M 130 182 L 148 175" stroke="#0f172a" strokeWidth="5" />

            {/* Main Cup Body */}
            <path d="M 150 95 Q 140 150 175 195 Q 200 200 225 195 Q 260 150 250 95 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />

            {/* Orange Polka Dots on Cup */}
            <circle cx="175" cy="120" r="5" fill="#fb923c" />
            <circle cx="210" cy="115" r="6" fill="#fb923c" />
            <circle cx="235" cy="130" r="5" fill="#fb923c" />
            <circle cx="165" cy="150" r="5.5" fill="#fb923c" />
            <circle cx="198" cy="148" r="6.5" fill="#fb923c" />
            <circle cx="228" cy="160" r="5" fill="#fb923c" />
            <circle cx="185" cy="178" r="5" fill="#fb923c" />
            <circle cx="212" cy="176" r="4.5" fill="#fb923c" />

            {/* Cup Rim & Liquid Inside */}
            <ellipse cx="200" cy="95" rx="50" ry="15" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
            <ellipse cx="200" cy="95" rx="44" ry="11" fill="#e0e7ff" />

            {/* Steam spirals */}
            <path d="M 190 75 Q 185 60 195 50 Q 205 40 198 30" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M 210 70 Q 218 55 210 45 Q 202 35 212 25" stroke="#94a3b8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />

            {/* Cup Label Tag */}
            <g transform="translate(176, 125)">
              <rect width="48" height="22" rx="6" fill="#0369a1" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">CUP</text>
            </g>
          </g>

          {/* Relation badge ON */}
          <g transform="translate(20, 20)">
            <rect width="115" height="30" rx="15" fill="#38bdf8" opacity="0.2" />
            <text x="58" y="20" fill="#0369a1" fontSize="13" fontWeight="800" textAnchor="middle">cup ON rug</text>
          </g>
        </svg>
      );

    case 'bug-cup':
      // The bug is in the cup: cute cockroach/beetle in coffee cup
      return (
        <svg viewBox="0 0 400 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#dcfce7" />
            </linearGradient>
            <linearGradient id="teaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="bugGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>

          <rect width="400" height="320" fill="url(#bgGrad2)" rx="16" />
          <ellipse cx="200" cy="270" rx="140" ry="20" fill="#cbd5e1" opacity="0.5" />

          {/* THE CUP (Top-down oblique view of cup) */}
          <g 
            id="scene-cup"
            className={isInteractive ? 'cursor-pointer hover:opacity-95' : ''}
            onClick={() => onObjectClick?.('cup')}
          >
            {/* Cup Outer Body */}
            <path d="M 70 140 Q 60 260 200 270 Q 340 260 330 140 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
            
            {/* Cup Handle */}
            <path d="M 330 150 C 390 160 380 230 320 240 C 355 225 355 175 326 165" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />

            {/* Cup Top Opening Oval */}
            <ellipse cx="200" cy="140" rx="130" ry="60" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />

            {/* Tea / Liquid inside */}
            <ellipse cx="200" cy="155" rx="105" ry="45" fill="url(#teaGrad)" />
            
            {/* Tea reflection highlight */}
            <path d="M 120 155 Q 160 175 220 165" stroke="#fde68a" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />

            {/* Cup Label */}
            <g transform="translate(32, 130)">
              <rect width="48" height="22" rx="6" fill="#059669" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">CUP</text>
            </g>
          </g>

          {/* THE BUG (Inside the cup / floating in liquid) */}
          <g 
            id="scene-bug"
            className={isInteractive ? 'cursor-pointer hover:scale-110 transition-transform duration-200' : ''}
            onClick={() => onObjectClick?.('bug')}
            transform="translate(190, 150)"
          >
            {/* Antennae */}
            <path d="M -15 -10 Q -40 -45 -65 -40" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M -10 -15 Q -25 -55 -40 -65" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Bug Legs */}
            <path d="M -20 -5 L -35 -15 L -45 -10" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M -20 10 L -40 10 L -50 20" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M -15 25 L -30 35 L -40 45" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 15 -5 L 30 -15 L 42 -10" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 20 10 L 38 12 L 48 22" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 15 25 L 28 35 L 38 45" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Bug Body & Shell */}
            <ellipse cx="0" cy="15" rx="22" ry="28" fill="url(#bugGrad)" stroke="#451a03" strokeWidth="2.5" />
            <line x1="0" y1="-8" x2="0" y2="40" stroke="#451a03" strokeWidth="2" />
            <path d="M -18 10 Q 0 16 18 10 M -20 25 Q 0 30 20 25" stroke="#451a03" strokeWidth="1.5" fill="none" />

            {/* Bug Head */}
            <circle cx="-5" cy="-8" r="14" fill="#92400e" stroke="#451a03" strokeWidth="2" />

            {/* Big Cute Eyes */}
            <circle cx="-10" cy="-12" r="5" fill="#ffffff" />
            <circle cx="-11" cy="-12" r="2.5" fill="#000000" />
            <circle cx="-1" cy="-10" r="5" fill="#ffffff" />
            <circle cx="-2" cy="-10" r="2.5" fill="#000000" />

            {/* Cute Smile */}
            <path d="M -8 -4 Q -5 -1 -2 -4" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Bug Label */}
            <g transform="translate(-25, 46)">
              <rect width="48" height="22" rx="6" fill="#d97706" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">BUG</text>
            </g>
          </g>

          {/* Relation badge IN */}
          <g transform="translate(20, 20)">
            <rect width="115" height="30" rx="15" fill="#10b981" opacity="0.2" />
            <text x="58" y="20" fill="#047857" fontSize="13" fontWeight="800" textAnchor="middle">bug IN cup</text>
          </g>
        </svg>
      );

    case 'sun-mug':
      // The sun is on the mug: white mug with green rim & handle, bright yellow sun
      return (
        <svg viewBox="0 0 400 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          <rect width="400" height="320" fill="url(#bgGrad3)" rx="16" />
          <ellipse cx="210" cy="275" rx="120" ry="16" fill="#cbd5e1" opacity="0.5" />

          {/* THE MUG (White with lime green handle & interior) */}
          <g 
            id="scene-mug"
            className={isInteractive ? 'cursor-pointer hover:opacity-95' : ''}
            onClick={() => onObjectClick?.('mug')}
          >
            {/* Green Handle on the left */}
            <path d="M 130 110 C 50 110 50 220 130 220 C 75 200 75 130 130 125" fill="#84cc16" stroke="#65a30d" strokeWidth="5" strokeLinejoin="round" />

            {/* Mug Body */}
            <rect x="130" y="80" width="160" height="175" rx="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="3" />
            
            {/* Base */}
            <rect x="135" y="248" width="150" height="12" rx="4" fill="#f1f5f9" />

            {/* Inner Lime Rim */}
            <ellipse cx="210" cy="80" rx="80" ry="20" fill="#bef264" stroke="#65a30d" strokeWidth="3" />
            <ellipse cx="210" cy="80" rx="74" ry="16" fill="#a3e635" />

            {/* Mug Label */}
            <g transform="translate(135, 222)">
              <rect width="48" height="22" rx="6" fill="#65a30d" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">MUG</text>
            </g>
          </g>

          {/* THE SUN (Illustration on the mug) */}
          <g 
            id="scene-sun"
            className={isInteractive ? 'cursor-pointer hover:scale-110 transition-transform duration-200' : ''}
            onClick={() => onObjectClick?.('sun')}
            transform="translate(210, 165)"
          >
            {/* Sun Rays */}
            {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg, i) => (
              <path
                key={i}
                d="M 0 -46 L 6 -32 L -6 -32 Z"
                fill="#f59e0b"
                transform={`rotate(${deg})`}
              />
            ))}

            {/* Main Sun Circle */}
            <circle cx="0" cy="0" r="32" fill="url(#sunGrad)" stroke="#d97706" strokeWidth="2.5" />

            {/* Happy Sun Face */}
            {/* Eyes */}
            <circle cx="-10" cy="-6" r="4" fill="#78350f" />
            <circle cx="10" cy="-6" r="4" fill="#78350f" />
            <circle cx="-11" cy="-7" r="1.5" fill="#ffffff" />
            <circle cx="9" cy="-7" r="1.5" fill="#ffffff" />

            {/* Cheeks */}
            <ellipse cx="-16" cy="4" rx="4" ry="2.5" fill="#f87171" opacity="0.7" />
            <ellipse cx="16" cy="4" rx="4" ry="2.5" fill="#f87171" opacity="0.7" />

            {/* Smile */}
            <path d="M -10 6 Q 0 18 10 6" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Sun Label */}
            <g transform="translate(-24, 38)">
              <rect width="48" height="22" rx="6" fill="#d97706" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">SUN</text>
            </g>
          </g>

          {/* Relation badge ON */}
          <g transform="translate(20, 20)">
            <rect width="115" height="30" rx="15" fill="#f59e0b" opacity="0.2" />
            <text x="58" y="20" fill="#b45309" fontSize="13" fontWeight="800" textAnchor="middle">sun ON mug</text>
          </g>
        </svg>
      );

    case 'kid-mum':
      // The kid is by mum: mother embracing young child tenderly
      return (
        <svg viewBox="0 0 400 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff1f2" />
              <stop offset="100%" stopColor="#ffe4e6" />
            </linearGradient>
          </defs>

          <rect width="400" height="320" fill="url(#bgGrad4)" rx="16" />
          
          {/* Outdoor gentle green background bokeh */}
          <circle cx="330" cy="100" r="70" fill="#86efac" opacity="0.3" />
          <circle cx="80" cy="80" r="50" fill="#a7f3d0" opacity="0.3" />

          {/* MUM (Loving mother hugging kid) */}
          <g 
            id="scene-mum"
            className={isInteractive ? 'cursor-pointer hover:opacity-95' : ''}
            onClick={() => onObjectClick?.('mum')}
          >
            {/* Mum Body / Blue Shirt */}
            <path d="M 140 320 L 150 200 Q 230 180 320 220 L 330 320 Z" fill="#93c5fd" />
            <path d="M 280 230 L 320 320" stroke="#60a5fa" strokeWidth="3" />

            {/* Mum Neck & Shoulder */}
            <path d="M 210 180 L 235 210 L 260 190" fill="#fed7aa" />

            {/* Mum Head */}
            <ellipse cx="235" cy="140" rx="42" ry="52" fill="#fed7aa" transform="rotate(-8 235 140)" />

            {/* Mum Hair */}
            <path d="M 185 130 C 180 80 270 70 285 110 C 290 140 285 180 275 190 C 270 170 270 130 250 115 C 220 100 190 110 185 130 Z" fill="#451a03" />

            {/* Mum Eyes closed peacefully */}
            <path d="M 220 135 Q 230 142 240 135" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 252 133 Q 262 140 272 133" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Mum Nose & Gentle Smile */}
            <path d="M 248 145 L 246 155 L 252 157" stroke="#fb923c" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 242 168 Q 252 176 262 168" stroke="#e11d48" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Mum Arm wrapping around kid */}
            <path d="M 300 240 C 270 290 180 300 130 260 C 120 250 140 230 160 245 C 190 270 250 260 275 230 Z" fill="#fed7aa" stroke="#fdba74" strokeWidth="2" />
            
            {/* Mum Hand hugging kid's back */}
            <ellipse cx="140" cy="245" rx="16" ry="20" fill="#fed7aa" transform="rotate(-20 140 245)" />

            {/* Mum Label */}
            <g transform="translate(250, 80)">
              <rect width="48" height="22" rx="6" fill="#db2777" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">MUM</text>
            </g>
          </g>

          {/* KID (Boy in white t-shirt seen from behind, hugging mum) */}
          <g 
            id="scene-kid"
            className={isInteractive ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}
            onClick={() => onObjectClick?.('kid')}
          >
            {/* Kid Back & White Shirt */}
            <path d="M 90 320 Q 90 230 160 210 Q 230 220 250 320 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
            
            {/* Kid Neck */}
            <ellipse cx="165" cy="205" rx="22" ry="12" fill="#fed7aa" />

            {/* Kid Head (Seen from side-back) */}
            <circle cx="160" cy="155" r="38" fill="#fed7aa" />

            {/* Kid Hair */}
            <path d="M 125 155 C 120 115 170 110 195 130 C 190 155 180 185 155 185 C 135 185 125 170 125 155 Z" fill="#78350f" />
            <ellipse cx="132" cy="160" rx="7" ry="10" fill="#fed7aa" /> {/* Kid Ear */}

            {/* Kid Arm reaching around Mum */}
            <path d="M 180 230 C 210 200 240 210 260 230" stroke="#f8fafc" strokeWidth="22" strokeLinecap="round" />
            <ellipse cx="260" cy="230" rx="12" ry="14" fill="#fed7aa" />

            {/* Kid Label */}
            <g transform="translate(90, 170)">
              <rect width="48" height="22" rx="6" fill="#2563eb" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">KID</text>
            </g>
          </g>

          {/* Relation badge BY */}
          <g transform="translate(20, 20)">
            <rect width="115" height="30" rx="15" fill="#e11d48" opacity="0.2" />
            <text x="58" y="20" fill="#be123c" fontSize="13" fontWeight="800" textAnchor="middle">kid BY mum</text>
          </g>
        </svg>
      );

    case 'cat-mat':
      // The cat is on the mat: cute Siamese cat lying on blue cat-shaped rug
      return (
        <svg viewBox="0 0 400 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="catGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>

          {/* Wooden Floor planks */}
          <rect width="400" height="320" fill="url(#woodGrad)" rx="16" />
          <line x1="0" y1="80" x2="400" y2="80" stroke="#1e293b" strokeWidth="2" opacity="0.4" />
          <line x1="0" y1="160" x2="400" y2="160" stroke="#1e293b" strokeWidth="2" opacity="0.4" />
          <line x1="0" y1="240" x2="400" y2="240" stroke="#1e293b" strokeWidth="2" opacity="0.4" />

          {/* THE MAT (Bright blue cat-head shaped shaggy rug) */}
          <g 
            id="scene-mat"
            className={isInteractive ? 'cursor-pointer hover:opacity-95' : ''}
            onClick={() => onObjectClick?.('mat')}
          >
            {/* Mat Shadow */}
            <ellipse cx="200" cy="185" rx="135" ry="95" fill="#0f172a" opacity="0.4" />

            {/* Cat-shaped Rug Silhouette with Ears */}
            <path 
              d="M 95 105 L 140 140 Q 200 130 260 140 L 305 105 Q 330 180 320 230 Q 200 275 80 230 Q 70 180 95 105 Z" 
              fill="#2563eb" 
              stroke="#1d4ed8" 
              strokeWidth="4" 
            />

            {/* Shaggy rug texture dots */}
            {[
              [110, 160], [130, 200], [150, 150], [170, 230], [220, 240], 
              [250, 210], [280, 160], [260, 145], [140, 220], [200, 255]
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#60a5fa" opacity="0.7" />
            ))}

            {/* Mat Label */}
            <g transform="translate(45, 175)">
              <rect width="48" height="22" rx="6" fill="#1e3a8a" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">MAT</text>
            </g>
          </g>

          {/* THE CAT (Chubby Siamese cat lying comfortably on mat) */}
          <g 
            id="scene-cat"
            className={isInteractive ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}
            onClick={() => onObjectClick?.('cat')}
            transform="translate(185, 175)"
          >
            {/* Dark Tail curling around */}
            <path d="M -85 -5 C -110 -15 -110 35 -70 25" stroke="#451a03" strokeWidth="14" fill="none" strokeLinecap="round" />

            {/* Cat Body */}
            <ellipse cx="-15" cy="5" rx="65" ry="42" fill="url(#catGrad)" stroke="#d97706" strokeWidth="1.5" />
            
            {/* Dark fur patches (Siamese spine / flank shading) */}
            <ellipse cx="-35" cy="0" rx="35" ry="25" fill="#78350f" opacity="0.35" />

            {/* Cat Paws */}
            <ellipse cx="35" cy="30" rx="14" ry="8" fill="#451a03" />
            <ellipse cx="50" cy="15" rx="12" ry="7" fill="#451a03" />

            {/* Cat Head */}
            <circle cx="45" cy="-10" r="28" fill="#fed7aa" />
            
            {/* Dark mask on face */}
            <ellipse cx="48" cy="-8" rx="20" ry="16" fill="#451a03" />

            {/* Dark Ears */}
            <polygon points="30,-30 42,-46 48,-28" fill="#292524" />
            <polygon points="52,-28 62,-46 68,-26" fill="#292524" />

            {/* Cute Cat Eyes */}
            <ellipse cx="42" cy="-10" rx="4" ry="3" fill="#38bdf8" />
            <ellipse cx="56" cy="-10" rx="4" ry="3" fill="#38bdf8" />
            <line x1="42" y1="-12" x2="42" y2="-8" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="56" y1="-12" x2="56" y2="-8" stroke="#0f172a" strokeWidth="1.5" />

            {/* Nose & Whiskers */}
            <polygon points="48,-4 51,-4 49.5,-2" fill="#f43f5e" />
            <line x1="32" y1="-3" x2="16" y2="-5" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            <line x1="32" y1="0" x2="18" y2="4" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            <line x1="64" y1="-3" x2="80" y2="-5" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            <line x1="64" y1="0" x2="78" y2="4" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />

            {/* Cat Label */}
            <g transform="translate(-15, -45)">
              <rect width="48" height="22" rx="6" fill="#4338ca" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">CAT</text>
            </g>
          </g>

          {/* Relation badge ON */}
          <g transform="translate(20, 20)">
            <rect width="115" height="30" rx="15" fill="#3b82f6" opacity="0.3" />
            <text x="58" y="20" fill="#1e40af" fontSize="13" fontWeight="800" textAnchor="middle">cat ON mat</text>
          </g>
        </svg>
      );

    case 'bat-cap':
      // The bat is on the cap: red and white baseball cap with bat cartoon
      return (
        <svg viewBox="0 0 400 320" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5f3ff" />
              <stop offset="100%" stopColor="#ede9fe" />
            </linearGradient>
            <linearGradient id="redCapGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          <rect width="400" height="320" fill="url(#bgGrad6)" rx="16" />
          <ellipse cx="200" cy="275" rx="145" ry="18" fill="#cbd5e1" opacity="0.5" />

          {/* THE CAP (Trucker baseball cap) */}
          <g 
            id="scene-cap"
            className={isInteractive ? 'cursor-pointer hover:opacity-95' : ''}
            onClick={() => onObjectClick?.('cap')}
          >
            {/* Red Mesh Back */}
            <path d="M 70 170 C 60 70 340 70 330 170 Z" fill="url(#redCapGrad)" stroke="#b91c1c" strokeWidth="3" />
            
            {/* White Front Foam Panel */}
            <path d="M 85 165 C 80 80 320 80 315 165 C 310 175 90 175 85 165 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />

            {/* Top Red Button */}
            <ellipse cx="200" cy="74" rx="14" ry="6" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />

            {/* Red Curved Visor / Brim with Stitching lines */}
            <path d="M 60 170 Q 200 155 340 170 C 355 240 335 260 200 260 C 65 260 45 240 60 170 Z" fill="url(#redCapGrad)" stroke="#991b1b" strokeWidth="3" />
            <path d="M 75 190 Q 200 180 325 190" stroke="#b91c1c" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
            <path d="M 85 210 Q 200 202 315 210" stroke="#b91c1c" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
            <path d="M 100 230 Q 200 224 300 230" stroke="#b91c1c" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />

            {/* Cap Label */}
            <g transform="translate(30, 220)">
              <rect width="48" height="22" rx="6" fill="#dc2626" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">CAP</text>
            </g>
          </g>

          {/* THE BAT (Cartoon bat emblem on the front panel) */}
          <g 
            id="scene-bat"
            className={isInteractive ? 'cursor-pointer hover:scale-110 transition-transform duration-200' : ''}
            onClick={() => onObjectClick?.('bat')}
            transform="translate(200, 125)"
          >
            {/* Bat Wings Outspread */}
            <path 
              d="M -15 -8 C -35 -30 -65 -15 -80 -10 C -75 0 -60 15 -45 5 C -40 15 -25 18 -15 8 Z" 
              fill="#0f172a" 
            />
            <path 
              d="M 15 -8 C 35 -30 65 -15 80 -10 C 75 0 60 15 45 5 C 40 15 25 18 15 8 Z" 
              fill="#0f172a" 
            />

            {/* Bat Ears */}
            <path d="M -18 -15 L -22 -32 Q -14 -28 -10 -18 Z" fill="#0f172a" />
            <path d="M 18 -15 L 22 -32 Q 14 -28 10 -18 Z" fill="#0f172a" />

            {/* Bat Round Body */}
            <ellipse cx="0" cy="5" rx="26" ry="24" fill="#0f172a" />
            
            {/* Bat White Tummy */}
            <ellipse cx="0" cy="6" rx="22" ry="20" fill="#ffffff" />
            
            {/* Bat Little Pointed Tail */}
            <polygon points="-5,28 5,28 0,38" fill="#0f172a" />

            {/* Bat Big Googly Cartoon Eyes */}
            <ellipse cx="-8" cy="-2" rx="7" ry="9" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <ellipse cx="8" cy="-2" rx="7" ry="9" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="-6" cy="-2" r="3.5" fill="#0f172a" />
            <circle cx="6" cy="-2" r="3.5" fill="#0f172a" />
            <circle cx="-7" cy="-3" r="1.2" fill="#ffffff" />
            <circle cx="5" cy="-3" r="1.2" fill="#ffffff" />

            {/* Bat Cute Vampire Fangs Smile */}
            <path d="M -10 12 Q 0 20 10 12" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
            <polygon points="-7,14 -4,14 -5.5,19" fill="#0f172a" />
            <polygon points="4,14 7,14 5.5,19" fill="#0f172a" />

            {/* Bat Label */}
            <g transform="translate(-24, -40)">
              <rect width="48" height="22" rx="6" fill="#7c3aed" />
              <text x="24" y="15" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">BAT</text>
            </g>
          </g>

          {/* Relation badge ON */}
          <g transform="translate(20, 20)">
            <rect width="115" height="30" rx="15" fill="#7c3aed" opacity="0.2" />
            <text x="58" y="20" fill="#6d28d9" fontSize="13" fontWeight="800" textAnchor="middle">bat ON cap</text>
          </g>
        </svg>
      );

    default:
      return null;
  }
};
