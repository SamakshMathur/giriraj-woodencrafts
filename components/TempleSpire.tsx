"use client";

import { useId } from "react";

const SMOKE_PARTICLES = [
  { left: "47%", delay: "0s", duration: "9s" },
  { left: "50%", delay: "2.2s", duration: "10s" },
  { left: "53%", delay: "4.4s", duration: "8.5s" },
  { left: "49%", delay: "6.1s", duration: "9.5s" },
];

/** A stacked bell/dome "ring" — the repeating unit of a carved Nagara shikhara. */
function domePath(cx: number, bottom: number, top: number, halfWidth: number) {
  const h = bottom - top;
  return `M${cx - halfWidth},${bottom} A${halfWidth},${h} 0 0 1 ${cx + halfWidth},${bottom} Z`;
}

type Tier = { bottom: number; top: number; hw: number };

function Spire({
  cx,
  tiers,
  neck,
  amalaka,
  kalashR,
  spikeTop,
  fillUrl,
  strokeWidth = 1.2,
}: {
  cx: number;
  tiers: Tier[];
  neck: Tier;
  amalaka: { cy: number; rx: number; ry: number };
  kalashR: number;
  spikeTop: number;
  fillUrl: string;
  strokeWidth?: number;
}) {
  const finialBottom = neck.top;
  return (
    <g>
      {tiers.map((t, i) => (
        <path
          key={i}
          d={domePath(cx, t.bottom, t.top, t.hw)}
          fill={fillUrl}
          stroke="#d4af37"
          strokeOpacity="0.32"
          strokeWidth={strokeWidth}
        />
      ))}
      <path
        d={domePath(cx, neck.bottom, neck.top, neck.hw)}
        fill={fillUrl}
        stroke="#d4af37"
        strokeOpacity="0.32"
        strokeWidth={strokeWidth}
      />
      <ellipse
        cx={cx}
        cy={amalaka.cy}
        rx={amalaka.rx}
        ry={amalaka.ry}
        fill={fillUrl}
        stroke="#d4af37"
        strokeOpacity="0.4"
        strokeWidth={strokeWidth}
      />
      <line
        x1={cx}
        y1={finialBottom - 4}
        x2={cx}
        y2={spikeTop + kalashR + 6}
        stroke="#d4af37"
        strokeOpacity="0.5"
        strokeWidth={strokeWidth + 0.6}
      />
      <circle cx={cx} cy={spikeTop + kalashR} r={kalashR} fill="#d4af37" fillOpacity="0.75" />
      <line x1={cx} y1={spikeTop - 2} x2={cx} y2={spikeTop - 22} stroke="#d4af37" strokeOpacity="0.55" strokeWidth={strokeWidth} />
      <circle cx={cx} cy={spikeTop - 26} r="3.5" fill="#d4af37" fillOpacity="0.8" />
    </g>
  );
}

const CENTRAL_TIERS: Tier[] = [
  { bottom: 520, top: 452, hw: 98 },
  { bottom: 464, top: 402, hw: 82 },
  { bottom: 414, top: 358, hw: 66 },
  { bottom: 370, top: 320, hw: 50 },
  { bottom: 332, top: 290, hw: 36 },
];
const CENTRAL_NECK: Tier = { bottom: 302, top: 270, hw: 16 };

const CORNER_TIERS_LEFT: Tier[] = [
  { bottom: 682, top: 630, hw: 42 },
  { bottom: 642, top: 598, hw: 32 },
  { bottom: 610, top: 575, hw: 22 },
];
const CORNER_NECK_LEFT: Tier = { bottom: 587, top: 565, hw: 10 };

const CORNER_TIERS_RIGHT: Tier[] = CORNER_TIERS_LEFT.map((t) => ({ ...t }));
const CORNER_NECK_RIGHT: Tier = { ...CORNER_NECK_LEFT };

/** Self-contained temple silhouette + diya + smoke. Caller controls size/position via className. */
export function TempleSpire({ className = "" }: { className?: string }) {
  const uid = useId();
  const spireFillId = `spireFill-${uid}`;
  const doorGlowId = `doorGlow-${uid}`;
  const flameGradId = `flameGrad-${uid}`;
  const softBlurId = `softBlur-${uid}`;
  const spireFillUrl = `url(#${spireFillId})`;

  return (
    <div className={`relative aspect-[600/760] ${className}`}>
      <svg
        viewBox="0 0 600 760"
        className="h-full w-full"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={spireFillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b1310" />
            <stop offset="100%" stopColor="#3b2318" />
          </linearGradient>
          <radialGradient id={doorGlowId} cx="50%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#f3d28a" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#d4af37" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={flameGradId} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff3d6" />
            <stop offset="45%" stopColor="#f3b545" />
            <stop offset="100%" stopColor="#c1471d" />
          </radialGradient>
          <filter id={softBlurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Flourish "pankh" scrollwork flanking the shrine, echoing the emblem's leaf motifs */}
        <g fill="#d4af37">
          <path d="M60,690 Q35,650 55,600 Q75,645 60,690 Z" opacity="0.22" />
          <path d="M46,680 Q26,655 41,620 Q55,655 46,680 Z" opacity="0.16" />
          <path d="M540,690 Q565,650 545,600 Q525,645 540,690 Z" opacity="0.22" />
          <path d="M554,680 Q574,655 559,620 Q545,655 554,680 Z" opacity="0.16" />
        </g>

        {/* Plinth steps */}
        <rect x="100" y="700" width="400" height="18" rx="3" fill={spireFillUrl} />
        <rect x="135" y="682" width="330" height="18" rx="3" fill={spireFillUrl} />

        {/* Corner shrines */}
        <Spire
          cx={110}
          tiers={CORNER_TIERS_LEFT}
          neck={CORNER_NECK_LEFT}
          amalaka={{ cy: 562, rx: 15, ry: 5 }}
          kalashR={6}
          spikeTop={510}
          fillUrl={spireFillUrl}
          strokeWidth={1}
        />
        <Spire
          cx={490}
          tiers={CORNER_TIERS_RIGHT}
          neck={CORNER_NECK_RIGHT}
          amalaka={{ cy: 562, rx: 15, ry: 5 }}
          kalashR={6}
          spikeTop={510}
          fillUrl={spireFillUrl}
          strokeWidth={1}
        />

        {/* Sanctum body */}
        <rect x="170" y="520" width="260" height="162" fill={spireFillUrl} />
        <rect
          x="180"
          y="530"
          width="240"
          height="142"
          fill="none"
          stroke="#d4af37"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />

        {/* Pillars flanking the archway */}
        <rect x="200" y="560" width="10" height="122" fill={spireFillUrl} stroke="#d4af37" strokeOpacity="0.3" strokeWidth="1" />
        <rect x="390" y="560" width="10" height="122" fill={spireFillUrl} stroke="#d4af37" strokeOpacity="0.3" strokeWidth="1" />
        <rect x="194" y="552" width="22" height="7" rx="1.5" fill="#d4af37" fillOpacity="0.4" />
        <rect x="384" y="552" width="22" height="7" rx="1.5" fill="#d4af37" fillOpacity="0.4" />

        {/* Carved rosette above the archway */}
        <g stroke="#d4af37" strokeOpacity="0.45" strokeWidth="1">
          <circle cx="300" cy="536" r="8" fill={spireFillUrl} />
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const x1 = 300 + Math.cos(angle) * 10;
            const y1 = 536 + Math.sin(angle) * 10;
            const x2 = 300 + Math.cos(angle) * 16;
            const y2 = 536 + Math.sin(angle) * 16;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* Central shikhara */}
        <Spire
          cx={300}
          tiers={CENTRAL_TIERS}
          neck={CENTRAL_NECK}
          amalaka={{ cy: 266, rx: 26, ry: 9 }}
          kalashR={11}
          spikeTop={192}
          fillUrl={spireFillUrl}
        />

        {/* Glowing archway doorway (the sanctum light) */}
        <path
          className="door-glow"
          d="M300,558 Q365,592 358,678 L242,678 Q235,592 300,558 Z"
          fill={`url(#${doorGlowId})`}
        />
        <path
          d="M300,558 Q365,592 358,678 L242,678 Q235,592 300,558 Z"
          fill="none"
          stroke="#f3d28a"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />

        {/* Diya — glow + flame */}
        <ellipse cx="300" cy="694" rx="17" ry="5" fill="#8a5b36" />
        <path
          className="diya-flame"
          d="M300,644 C312,660 322,674 300,694 C278,674 288,660 300,644 Z"
          fill={`url(#${flameGradId})`}
          filter={`url(#${softBlurId})`}
          opacity="0.7"
        />
        <path
          className="diya-flame"
          d="M300,652 C309,664 316,675 300,692 C284,675 291,664 300,652 Z"
          fill={`url(#${flameGradId})`}
        />
      </svg>

      {/* Incense smoke rising from the diya */}
      {SMOKE_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="smoke-particle"
          style={{
            left: p.left,
            top: "89%",
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
