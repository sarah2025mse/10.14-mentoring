import type { ReactNode } from 'react';

/**
 * 디딤 화면 아이콘 ('앱 이미지/DIDIM' 시안의 선 아이콘 모양).
 * 24×24, 선 두께 2, 색은 currentColor. 디딤 화면에서는 항상 글자와 함께 쓴다.
 */
type IconProps = { size?: number };

function Line({ size = 24, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const ArrowLeftIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </Line>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </Line>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M9 18l6-6-6-6" />
  </Line>
);

export const HelpIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M8.6 8.6a3.5 3.5 0 0 1 6.8 1.1c0 2.4-3.4 3-3.4 5.1" strokeWidth="2.6" />
    <path d="M12 19.3h.01" strokeWidth="3" />
  </Line>
);

export const CheckIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Line>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </Line>
);

export const InfoIcon = (p: IconProps) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </Line>
);

export const WarningIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M21.7 18l-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z" />
    <path d="M12 9v4M12 17h.01" />
  </Line>
);

export const CloseIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Line>
);

export const RetryIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </Line>
);

export const CameraIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </Line>
);

export const SendIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </Line>
);

export const MessageIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
  </Line>
);

export const PhoneIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </Line>
);

export const BookIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </Line>
);

/** 아이콘 이름으로 고르기 (레슨 데이터처럼 글자로 아이콘을 정할 때) */
export const didimIcons = {
  camera: CameraIcon,
  send: SendIcon,
  message: MessageIcon,
  phone: PhoneIcon,
  book: BookIcon,
  check: CheckIcon,
} as const;

export type DidimIconName = keyof typeof didimIcons;
