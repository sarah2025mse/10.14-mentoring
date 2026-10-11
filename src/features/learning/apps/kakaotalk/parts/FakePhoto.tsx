import type { ReactNode } from 'react';

/** 연습용 가짜 사진. 실제 사진 파일 대신 간단한 그림으로 그린다. */
export type PhotoKind =
  | 'flower'
  | 'tulips'
  | 'path'
  | 'tree'
  | 'sunset'
  | 'blossom'
  | 'lake'
  | 'sunflower'
  | 'mountain'
  | 'clouds'
  | 'bench'
  | 'leaves';

type FakePhotoProps = { kind: PhotoKind; className?: string };

export function FakePhoto({ kind, className }: FakePhotoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {scenes[kind]}
    </svg>
  );
}

function petals(cx: number, cy: number, count: number, rx: number, ry: number, dist: number, fill: string) {
  return Array.from({ length: count }, (_, i) => (
    <ellipse
      key={i}
      cx={cx}
      cy={cy - dist}
      rx={rx}
      ry={ry}
      fill={fill}
      transform={`rotate(${(360 / count) * i} ${cx} ${cy})`}
    />
  ));
}

function tulip(x: number, color: string, height: number) {
  const top = 100 - height;
  return (
    <g>
      <path d={`M${x} 100 V${top + 10}`} stroke="#3f8f3a" strokeWidth="2.4" />
      <path d={`M${x} ${top + 30} q-9 -4 -10 -14 q8 2 10 10`} fill="#4ea54a" />
      <path
        d={`M${x - 7} ${top} q0 12 7 13 q7 -1 7 -13 l-3.5 4 -3.5 -6 -3.5 6z`}
        fill={color}
      />
    </g>
  );
}

const scenes: Record<PhotoKind, ReactNode> = {
  flower: (
    <>
      <defs>
        <linearGradient id="fp-flower-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d7efc8" />
          <stop offset="1" stopColor="#7fbf6a" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#fp-flower-bg)" />
      <circle cx="18" cy="22" r="7" fill="#f7c6d9" opacity="0.7" />
      <circle cx="84" cy="30" r="6" fill="#f7c6d9" opacity="0.6" />
      <path d="M50 52 Q52 75 46 100" stroke="#3f8f3a" strokeWidth="3" fill="none" />
      <path d="M49 78 q-16 -3 -20 -14 q14 1 20 12z" fill="#4ea54a" />
      <path d="M50 70 q14 -6 20 -1 q-10 8 -20 3z" fill="#4ea54a" />
      {petals(50, 42, 8, 7.5, 13, 13, '#f06fa0')}
      {petals(50, 42, 8, 4, 8, 10, '#f79ac0')}
      <circle cx="50" cy="42" r="7.5" fill="#ffd34d" />
      <circle cx="50" cy="42" r="3.5" fill="#f2a900" />
    </>
  ),
  tulips: (
    <>
      <rect width="100" height="100" fill="#e6f3df" />
      <rect y="78" width="100" height="22" fill="#9fcf87" />
      {tulip(26, '#e5484d', 62)}
      {tulip(50, '#ffc53d', 72)}
      {tulip(74, '#f06fa0', 58)}
    </>
  ),
  path: (
    <>
      <rect width="100" height="100" fill="#cfe8fb" />
      <rect y="45" width="100" height="55" fill="#8cc66d" />
      <path d="M44 45 L56 45 L80 100 L20 100z" fill="#dcc79f" />
      <circle cx="14" cy="38" r="14" fill="#4f9a45" />
      <rect x="12" y="44" width="4" height="12" fill="#7a5233" />
      <circle cx="86" cy="36" r="15" fill="#5aa64f" />
      <rect x="84" y="44" width="4" height="12" fill="#7a5233" />
      <circle cx="68" cy="42" r="7" fill="#6db35f" />
    </>
  ),
  tree: (
    <>
      <rect width="100" height="100" fill="#bfe3fb" />
      <rect y="74" width="100" height="26" fill="#86c26a" />
      <rect x="45" y="50" width="10" height="34" fill="#7a5233" />
      <circle cx="50" cy="38" r="22" fill="#4f9a45" />
      <circle cx="34" cy="48" r="14" fill="#5aa64f" />
      <circle cx="66" cy="48" r="14" fill="#5aa64f" />
      <circle cx="82" cy="16" r="7" fill="#fff3b0" />
    </>
  ),
  sunset: (
    <>
      <defs>
        <linearGradient id="fp-sunset-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a5c" />
          <stop offset="1" stopColor="#ffd27a" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#fp-sunset-bg)" />
      <circle cx="50" cy="62" r="16" fill="#fff1c1" />
      <rect y="62" width="100" height="38" fill="#4a6fa5" />
      <path d="M30 70h40M38 78h24M44 86h12" stroke="#ffd27a" strokeWidth="2" opacity="0.7" />
    </>
  ),
  blossom: (
    <>
      <rect width="100" height="100" fill="#dff0fb" />
      <path d="M0 70 Q30 55 55 48 T100 22" stroke="#6b4a32" strokeWidth="4" fill="none" />
      <path d="M40 52 Q48 40 46 28" stroke="#6b4a32" strokeWidth="2.5" fill="none" />
      {[
        [20, 62], [32, 54], [46, 28], [50, 44], [62, 42], [72, 34], [86, 26], [40, 40], [80, 40], [26, 74],
      ].map(([x, y], i) => (
        <g key={i}>
          {petals(x, y, 5, 3, 4.5, 3.5, '#f9b7cf')}
          <circle cx={x} cy={y} r="1.6" fill="#e5637f" />
        </g>
      ))}
    </>
  ),
  lake: (
    <>
      <rect width="100" height="100" fill="#cde9fb" />
      <path d="M0 52 Q20 32 40 46 T80 40 T100 46 V60 H0z" fill="#6c9a6b" />
      <rect y="58" width="100" height="42" fill="#5b8fc4" />
      <path d="M10 68h22M50 74h30M20 84h40M64 90h22" stroke="#cde9fb" strokeWidth="1.6" opacity="0.7" />
    </>
  ),
  sunflower: (
    <>
      <rect width="100" height="100" fill="#8ec9f5" />
      <path d="M50 55 V100" stroke="#3f8f3a" strokeWidth="4" />
      <path d="M50 80 q14 -8 22 -2 q-10 9 -22 4z" fill="#4ea54a" />
      {petals(50, 40, 14, 4.5, 11, 15, '#ffcc1f')}
      <circle cx="50" cy="40" r="12" fill="#6d4c41" />
      <circle cx="50" cy="40" r="7" fill="#5a3d33" />
    </>
  ),
  mountain: (
    <>
      <rect width="100" height="100" fill="#d7ecfb" />
      <path d="M0 80 L30 34 L52 66 L70 42 L100 80z" fill="#6a8ca8" />
      <path d="M30 34 L38 46 L33 44 L28 48 L24 43z" fill="#fff" />
      <path d="M70 42 L77 52 L70 50 L65 54z" fill="#fff" />
      <rect y="78" width="100" height="22" fill="#7fb36a" />
    </>
  ),
  clouds: (
    <>
      <rect width="100" height="100" fill="#7fbdf0" />
      <g fill="#fff">
        <circle cx="26" cy="36" r="10" />
        <circle cx="38" cy="32" r="13" />
        <circle cx="50" cy="38" r="9" />
        <rect x="22" y="38" width="32" height="9" rx="4.5" />
        <circle cx="70" cy="66" r="8" />
        <circle cx="80" cy="62" r="10" />
        <rect x="64" y="66" width="26" height="8" rx="4" />
      </g>
    </>
  ),
  bench: (
    <>
      <rect width="100" height="100" fill="#cfe8fb" />
      <rect y="55" width="100" height="45" fill="#8cc66d" />
      <circle cx="80" cy="34" r="18" fill="#4f9a45" />
      <rect x="77" y="44" width="5" height="16" fill="#7a5233" />
      <rect x="18" y="58" width="52" height="5" rx="1.5" fill="#9b6a43" />
      <rect x="18" y="66" width="52" height="5" rx="1.5" fill="#9b6a43" />
      <rect x="22" y="71" width="4" height="12" fill="#5b4030" />
      <rect x="62" y="71" width="4" height="12" fill="#5b4030" />
    </>
  ),
  leaves: (
    <>
      <rect width="100" height="100" fill="#ead8b8" />
      {[
        [20, 22, 30, '#e0632f'], [55, 18, -20, '#f2a541'], [80, 40, 60, '#c9412b'], [30, 55, -40, '#f2a541'],
        [62, 62, 15, '#e0632f'], [16, 84, 50, '#c9412b'], [48, 88, -10, '#e8b04b'], [86, 82, 30, '#e0632f'],
      ].map(([x, y, r, c], i) => (
        <ellipse key={i} cx={x} cy={y} rx="11" ry="6" fill={c as string} transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </>
  ),
};
