/**
 * Animacao decorativa elegante do painel do studio.
 * Elementos tematicos: flores estilizadas, formas de unhas, petalas, sparkles.
 * Design minimalista com linhas finas, glows suaves e cores da marca.
 */
export function NailArtAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block">
      {/* Ambient glow layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(226,75,132,0.07),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_80%,rgba(237,159,71,0.05),transparent_40%)]" />

      {/* === FLOWERS === */}

      {/* Main rose flower — top right */}
      <svg
        className="absolute right-[8%] top-[6%] h-32 w-32 animate-bloom"
        viewBox="0 0 120 120"
        fill="none"
      >
        <defs>
          <radialGradient id="flowerCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ED9F47" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E24B84" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        {/* Petals — 5 ellipses rotated */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <ellipse
            key={angle}
            cx="60"
            cy="60"
            rx="18"
            ry="35"
            fill="none"
            stroke="#E24B84"
            strokeWidth="0.8"
            opacity={0.25 + i * 0.05}
            transform={`rotate(${angle} 60 60) translate(0 -18)`}
          />
        ))}
        {/* Center bloom */}
        <circle cx="60" cy="60" r="8" fill="url(#flowerCenter)" />
        <circle cx="60" cy="60" r="4" fill="#ED9F47" opacity="0.4" />
      </svg>

      {/* Small floating flower — center right */}
      <svg
        className="absolute right-[22%] top-[55%] h-20 w-20 animate-bloom-delayed"
        viewBox="0 0 80 80"
        fill="none"
      >
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            cx="40"
            cy="40"
            rx="10"
            ry="22"
            fill="none"
            stroke="#ED9F47"
            strokeWidth="0.6"
            opacity="0.2"
            transform={`rotate(${angle} 40 40) translate(0 -12)`}
          />
        ))}
        <circle cx="40" cy="40" r="5" fill="#E24B84" opacity="0.25" />
      </svg>

      {/* Tiny accent flower — mid right */}
      <svg
        className="absolute right-[38%] top-[18%] h-12 w-12 animate-sway"
        viewBox="0 0 48 48"
        fill="none"
      >
        {[0, 90, 180, 270].map((angle) => (
          <ellipse
            key={angle}
            cx="24"
            cy="24"
            rx="6"
            ry="14"
            fill="none"
            stroke="#B63A66"
            strokeWidth="0.5"
            opacity="0.2"
            transform={`rotate(${angle} 24 24) translate(0 -8)`}
          />
        ))}
        <circle cx="24" cy="24" r="3" fill="#ED9F47" opacity="0.3" />
      </svg>

      {/* === NAIL SHAPES === */}

      {/* Elegant nail tip — floating almond shape */}
      <svg
        className="absolute right-[12%] top-[40%] h-24 w-12 animate-float-soft"
        viewBox="0 0 40 80"
        fill="none"
      >
        <defs>
          <linearGradient id="nailGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E24B84" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E24B84" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <path
          d="M20 4 C30 4 36 20 36 40 C36 62 30 76 20 76 C10 76 4 62 4 40 C4 20 10 4 20 4Z"
          fill="url(#nailGrad1)"
          stroke="#E24B84"
          strokeWidth="0.6"
          opacity="0.35"
        />
        {/* French tip line */}
        <path
          d="M10 58 Q20 66 30 58"
          fill="none"
          stroke="#ED9F47"
          strokeWidth="0.8"
          opacity="0.3"
          strokeLinecap="round"
        />
        {/* Tiny nail art dot */}
        <circle cx="20" cy="50" r="1.5" fill="#ED9F47" opacity="0.4" />
      </svg>

      {/* Second nail — stiletto shape */}
      <svg
        className="absolute right-[30%] top-[68%] h-20 w-10 animate-float-delayed"
        viewBox="0 0 36 70"
        fill="none"
      >
        <defs>
          <linearGradient id="nailGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ED9F47" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#B63A66" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <path
          d="M18 2 C28 8 32 24 30 45 C28 58 24 68 18 68 C12 68 8 58 6 45 C4 24 8 8 18 2Z"
          fill="url(#nailGrad2)"
          stroke="#ED9F47"
          strokeWidth="0.5"
          opacity="0.3"
        />
        {/* Decorative line */}
        <path
          d="M12 48 Q18 54 24 48"
          fill="none"
          stroke="#E24B84"
          strokeWidth="0.6"
          opacity="0.25"
          strokeLinecap="round"
        />
      </svg>

      {/* === DECORATIVE PETALS === */}

      {/* Drifting petal 1 */}
      <svg
        className="absolute right-[18%] top-[28%] h-8 w-6 animate-drift"
        viewBox="0 0 24 32"
        fill="none"
      >
        <path
          d="M12 2 C18 8 20 16 18 24 C16 30 12 32 10 28 C6 22 6 10 12 2Z"
          fill="#E24B84"
          opacity="0.12"
        />
      </svg>

      {/* Drifting petal 2 */}
      <svg
        className="absolute right-[42%] top-[42%] h-6 w-5 animate-drift [animation-delay:3s]"
        viewBox="0 0 20 28"
        fill="none"
      >
        <path
          d="M10 2 C16 6 18 14 14 22 C12 26 8 28 6 24 C2 18 4 8 10 2Z"
          fill="#ED9F47"
          opacity="0.1"
        />
      </svg>

      {/* Drifting petal 3 */}
      <svg
        className="absolute right-[6%] top-[72%] h-7 w-5 animate-drift [animation-delay:6s]"
        viewBox="0 0 20 28"
        fill="none"
      >
        <path
          d="M10 2 C16 6 18 14 14 22 C12 26 8 28 6 24 C2 18 4 8 10 2Z"
          fill="#B63A66"
          opacity="0.1"
        />
      </svg>

      {/* === SPARKLE STARS === */}

      {/* Star sparkle 1 */}
      <svg
        className="absolute right-[16%] top-[14%] h-5 w-5 animate-twinkle"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M10 0 L11.5 7.5 L18 6 L12.5 10 L18 14 L11.5 12.5 L10 20 L8.5 12.5 L2 14 L7.5 10 L2 6 L8.5 7.5 Z"
          fill="#ED9F47"
          opacity="0.4"
        />
      </svg>

      {/* Star sparkle 2 */}
      <svg
        className="absolute right-[35%] top-[8%] h-4 w-4 animate-twinkle-delayed"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 0 L9.2 6 L15 5 L10 8 L15 11 L9.2 10 L8 16 L6.8 10 L1 11 L6 8 L1 5 L6.8 6 Z"
          fill="#E24B84"
          opacity="0.35"
        />
      </svg>

      {/* Star sparkle 3 — small */}
      <svg
        className="absolute right-[26%] top-[78%] h-3 w-3 animate-twinkle [animation-delay:1.6s]"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M6 0 L7 4.5 L11 4 L7.5 6 L11 8 L7 7.5 L6 12 L5 7.5 L1 8 L4.5 6 L1 4 L5 4.5 Z"
          fill="#ED9F47"
          opacity="0.3"
        />
      </svg>

      {/* === DIAMOND DOTS === */}

      {/* Glowing dot cluster */}
      <div className="absolute right-[20%] top-[35%] h-2 w-2 animate-twinkle rounded-full bg-brand-rose/40 shadow-[0_0_12px_rgba(226,75,132,0.3)]" />
      <div className="absolute right-[40%] top-[25%] h-1.5 w-1.5 animate-twinkle-delayed rounded-full bg-brand-amber/50 shadow-[0_0_10px_rgba(237,159,71,0.25)]" />
      <div className="absolute right-[14%] top-[62%] h-1.5 w-1.5 animate-twinkle rounded-full bg-white/30 shadow-[0_0_8px_rgba(255,255,255,0.15)] [animation-delay:2s]" />
      <div className="absolute right-[32%] top-[85%] h-1 w-1 animate-shimmer rounded-full bg-brand-rose/30 shadow-[0_0_6px_rgba(226,75,132,0.2)]" />
      <div className="absolute right-[45%] top-[60%] h-1 w-1 animate-shimmer rounded-full bg-brand-amber/25 shadow-[0_0_6px_rgba(237,159,71,0.15)] [animation-delay:1.8s]" />

      {/* === DECORATIVE CURVED LINES === */}

      {/* Flowing vine line */}
      <svg
        className="absolute right-[5%] top-[15%] h-[70%] w-[50%] animate-sway-slow"
        viewBox="0 0 200 280"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M180 20 Q140 60 160 120 Q180 170 130 200 Q90 230 100 270"
          stroke="#E24B84"
          strokeWidth="0.5"
          opacity="0.12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="200"
          className="animate-draw-line"
        />
      </svg>

      {/* Second vine */}
      <svg
        className="absolute right-[15%] top-[10%] h-[60%] w-[35%]"
        viewBox="0 0 140 240"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M20 230 Q60 180 40 130 Q20 80 70 50 Q100 30 90 10"
          stroke="#ED9F47"
          strokeWidth="0.4"
          opacity="0.1"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="200"
          className="animate-draw-line [animation-delay:0.8s]"
        />
      </svg>

      {/* === SOFT ORBS === */}
      <div className="absolute right-[10%] top-[20%] h-28 w-28 animate-pulse-slow rounded-full bg-brand-rose/[0.03] blur-[80px]" />
      <div className="absolute right-[30%] top-[50%] h-24 w-24 animate-pulse-slow rounded-full bg-brand-amber/[0.03] blur-[64px] [animation-delay:2s]" />
      <div className="absolute right-[5%] top-[70%] h-20 w-20 animate-pulse-slow rounded-full bg-brand-berry/[0.03] blur-[56px] [animation-delay:4s]" />
    </div>
  )
}
