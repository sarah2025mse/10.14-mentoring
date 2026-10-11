import type { ReactNode } from 'react';

/**
 * 연습용 카카오톡 화면의 아이콘. 공식 이미지 대신 일반 도형으로 비슷하게 그린다.
 * 모두 24×24 기준이며 색은 currentColor 를 따른다.
 */
type IconProps = { size?: number; className?: string };

function Svg({ size = 24, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const line = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" {...line} />
    <path d="M15.5 15.5L20.5 20.5" {...line} />
  </Svg>
);

export const AddFriendIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9.5" cy="8" r="3.8" {...line} />
    <path d="M2.8 20c.6-3.8 3.4-6 6.7-6s6.1 2.2 6.7 6" {...line} />
    <path d="M18.5 6.5v6M15.5 9.5h6" {...line} />
  </Svg>
);

export const GiftBoxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 11h16v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5V11z" fill="#ffd43b" stroke="#191919" strokeWidth="1.6" />
    <path d="M3 8h18v3H3z" fill="#ffe680" stroke="#191919" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M12 7.6C10.4 5 7 5.4 7.6 3.8 8.3 2 11 3.4 12 5.4c1-2 3.7-3.4 4.4-1.6.6 1.6-2.8 1.2-4.4 3.8z" fill="#ff4d5e" />
    <path d="M12 8v13" stroke="#191919" strokeWidth="1.6" />
  </Svg>
);

/** 톱니바퀴: 계산해서 그린다 */
function gearPath(teeth = 8, outer = 10, inner = 7.6) {
  const points: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const corners = [
      [inner, a - step * 0.32],
      [outer, a - step * 0.18],
      [outer, a + step * 0.18],
      [inner, a + step * 0.32],
    ];
    for (const [r, angle] of corners) {
      points.push(`${(12 + r * Math.cos(angle)).toFixed(2)} ${(12 + r * Math.sin(angle)).toFixed(2)}`);
    }
  }
  return `M${points.join('L')}Z`;
}
const GEAR = gearPath();

export const SettingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d={GEAR} {...line} strokeWidth={1.9} />
    <circle cx="12" cy="12" r="3" {...line} strokeWidth={1.9} />
  </Svg>
);

export const NewChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5c-5 0-9 3.2-9 7.3 0 2.5 1.5 4.7 3.9 6L6 20.5l4.2-2.6c.6.1 1.2.2 1.8.2 5 0 9-3.3 9-7.3" {...line} />
    <path d="M18.5 2.5v6M15.5 5.5h6" {...line} />
  </Svg>
);

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12H4.5M10.5 5.5L4 12l6.5 6.5" {...line} strokeWidth={2.2} />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" {...line} strokeWidth={2.2} />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4.5v15M4.5 12h15" {...line} strokeWidth={2.2} />
  </Svg>
);

export const SmileIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="10" r="1.4" fill="currentColor" />
    <circle cx="15" cy="10" r="1.4" fill="currentColor" />
    <path d="M8 14.2c1 1.5 2.4 2.3 4 2.3s3-.8 4-2.3" {...line} />
  </Svg>
);

export const HashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.5 4l-2 16M16.5 4l-2 16M4.5 9h16M3.5 15h16" {...line} strokeWidth={2.2} />
  </Svg>
);

export const CameraIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3l1.5-2.5h6L16.5 7h3A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-10z" fill="currentColor" />
    <circle cx="12" cy="13.3" r="4" fill="#9e9e9e" />
    <circle cx="12" cy="13.3" r="2.6" fill="currentColor" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" {...line} strokeWidth={2.2} />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 9.5L12 15l5.5-5.5" {...line} />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.5 6l6 6-6 6" {...line} />
  </Svg>
);

export const ExpandIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 13.5V19h5.5M19 10.5V5h-5.5" {...line} strokeWidth={2.2} />
  </Svg>
);

export const SparkleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" {...line} strokeWidth={1.8} />
  </Svg>
);

export const DotsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="5" cy="12" r="1.9" fill="currentColor" />
    <circle cx="12" cy="12" r="1.9" fill="currentColor" />
    <circle cx="19" cy="12" r="1.9" fill="currentColor" />
  </Svg>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" fill="#fee500" />
    <path d="M7.5 12.3l3 3 6-6.3" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/* ---------- 하단 탭 아이콘 (채움) ---------- */

export const TabFriendsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="7.5" r="4.5" fill="currentColor" />
    <path d="M3.5 20.5c0-4.4 3.8-7.5 8.5-7.5s8.5 3.1 8.5 7.5c0 .6-.4 1-1 1h-15c-.6 0-1-.4-1-1z" fill="currentColor" />
  </Svg>
);

export const TabChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.8c-5.6 0-10 3.6-10 8.2 0 2.9 1.8 5.5 4.6 6.9l-.9 3.6c-.1.4.3.7.7.5l4.3-2.8c.4 0 .9.1 1.3.1 5.6 0 10-3.6 10-8.2S17.6 2.8 12 2.8z" fill="currentColor" />
  </Svg>
);

export const TabOpenChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 4.5c4.1 0 7.3 2.7 7.3 6.1 0 2-1.1 3.8-2.9 4.9l.6 2.9-3-2c-.6.1-1.3.2-2 .2" fill="currentColor" opacity="0.75" />
    <path d="M9.5 6.5c-4.4 0-8 3-8 6.6 0 2.2 1.3 4.1 3.3 5.3l-.6 3 3.3-2.1c.6.1 1.3.2 2 .2 4.4 0 8-3 8-6.4s-3.6-6.6-8-6.6z" fill="currentColor" />
    <path d="M8 10.6v5l4.2-2.5L8 10.6z" fill="#fff" />
  </Svg>
);

export const TabShoppingIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 8V6.5a4 4 0 0 1 8 0V8" stroke="currentColor" strokeWidth="2" />
    <path d="M4.2 8.5c.1-.6.5-1 1.1-1h13.4c.6 0 1 .4 1.1 1l1.2 11c.1.8-.5 1.5-1.3 1.5H4.3c-.8 0-1.4-.7-1.3-1.5l1.2-11z" fill="currentColor" />
  </Svg>
);

/* ---------- + 판 메뉴 아이콘 (색 있음) ---------- */

export const AttachPhotoIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="#1fb36b" />
    <path d="M6.5 16.5l3.6-4.3 2.6 2.6 2.4-3.6 2.9 5.3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AttachMoneyIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" fill="#ffa800" />
    <path d="M6.8 8.5l1.9 7 1.9-5.5h2.8l1.9 5.5 1.9-7M6 11.6h12" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AttachFileIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 3.5c0-.6.4-1 1-1h8l5 5V20.5c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-17z" fill="#7d8a9a" />
    <path d="M14 2.5v4c0 .6.4 1 1 1h4" fill="#c4ccd6" />
  </Svg>
);

export const AttachGiftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 10.5h17v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9z" fill="#ff5a5f" />
    <path d="M2.5 8h19v3.5h-19z" fill="#ff7b80" />
    <path d="M12 8.2C10 4.8 6.4 5.6 7.3 3.5 8.2 1.6 11 3.4 12 5.8c1-2.4 3.8-4.2 4.7-2.3.9 2.1-2.7 1.3-4.7 4.7z" fill="#ff5a5f" />
  </Svg>
);

export const AttachCallIcon = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      fill="#13a35a"
    />
  </Svg>
);

export const CakeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 13.5h16v6a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-6z" fill="#ffb3c1" />
    <path d="M4 13.5c1.3 1.6 2.7 1.6 4 0 1.3 1.6 2.7 1.6 4 0 1.3 1.6 2.7 1.6 4 0 1.3 1.6 2.7 1.6 4 0" stroke="#fff" strokeWidth="1.4" />
    <path d="M12 7.5v5" stroke="#ffcf3f" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 3.2c.9 1.1 1.2 1.9.9 2.6-.3.6-1.5.6-1.8 0-.3-.7 0-1.5.9-2.6z" fill="#ff7a45" />
  </Svg>
);

/* ---------- 글자 입력 중 ---------- */

/** 노란 전송 버튼 안의 종이비행기 */
export const SendPlaneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.6 4.1c-.4-.2-.9.2-.7.7L5.8 12l-2.9 7.2c-.2.5.3.9.7.7l17-7.3c.4-.2.4-.8 0-1L3.6 4.1z" fill="currentColor" />
  </Svg>
);

export const SpellCheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12.5l4.5 4.5L20 6.5" {...line} />
    <path d="M4 20.5h16" {...line} strokeWidth={1.6} />
  </Svg>
);

export const TranslateIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4" {...line} />
  </Svg>
);

export const ChatbotIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 17a8 8 0 0 1 16 0" {...line} />
    <path d="M3 17.5h18" {...line} />
    <circle cx="12" cy="6.5" r="1.6" fill="currentColor" />
    <circle cx="9.3" cy="13.5" r="1" fill="currentColor" />
    <circle cx="14.7" cy="13.5" r="1" fill="currentColor" />
  </Svg>
);
