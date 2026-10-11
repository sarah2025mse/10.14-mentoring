import type { AvatarLook } from '../parts/Avatar';
import type { PhotoKind } from '../parts/FakePhoto';

/** 연습 화면에 쓰는 가짜 데이터. 실제 사람, 실제 대화가 아니다. */

/* ---------- 시간 표시 (지금 시각 기준으로 계산해서 늘 자연스럽게 보이게) ---------- */

const timeFormat = new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true });
const dayFormat = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' });
const fullDayFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

/** 예: '오전 11:01' (몇 분 전) */
export function minutesAgo(minutes: number): string {
  return timeFormat.format(new Date(Date.now() - minutes * 60_000));
}

/** 예: '어제', '10월 7일' (며칠 전) */
export function daysAgo(days: number): string {
  if (days === 1) return '어제';
  return dayFormat.format(new Date(Date.now() - days * 86_400_000));
}

/** 예: '2026년 10월 9일 금요일' (며칠 전, 0이면 오늘) */
export function fullDay(days: number): string {
  return fullDayFormat.format(new Date(Date.now() - days * 86_400_000));
}

/* ---------- 사람 ---------- */

export const me = { name: '김순자', look: { color: '#a9cdf2' } satisfies AvatarLook };

export const daughter = { name: '딸', look: { photo: 'blossom' } satisfies AvatarLook };

/** 친구 탭 '업데이트한 프로필' 줄 */
export const updatedFriends: { name: string; look: AvatarLook }[] = [
  daughter,
  { name: '손녀 지민', look: { photo: 'sunflower' } },
  { name: '아들', look: { color: '#b7b3f2' } },
  { name: '막내동생', look: { photo: 'mountain' } },
  { name: '영희 언니', look: { color: '#96d8cf' } },
];

/** 친구 탭 '생일인 친구' */
export const birthdayFriends: { name: string; look: AvatarLook }[] = [
  { name: '박정자', look: { photo: 'tulips' } },
  { name: '이복순', look: { color: '#f2c3a9' } },
];

/** 친구 탭 '친구' 목록 */
export const friendList: { name: string; status?: string; look: AvatarLook }[] = [
  { name: '경로당 회장님', status: '건강이 최고', look: { color: '#96d8cf' } },
  { name: '딸', status: '엄마 사랑해요', look: daughter.look },
  { name: '막내동생', look: { photo: 'mountain' } },
  { name: '손녀 지민', status: '할머니 최고', look: { photo: 'sunflower' } },
];

/* ---------- 채팅 목록 ---------- */

export type ChatRoomSummary = {
  id: string;
  name: string;
  memberCount?: number;
  look: AvatarLook;
  secondLook?: AvatarLook;
  preview: string;
  time: string;
  unread?: number;
};

export function chatRooms(): ChatRoomSummary[] {
  return [
    {
      id: 'daughter',
      name: daughter.name,
      look: daughter.look,
      preview: '오늘 날씨 좋아요. 산책 다녀오세요 🌷',
      time: minutesAgo(2),
      unread: 1,
    },
    { id: 'son', name: '아들', look: { color: '#b7b3f2' }, preview: '주말에 애들 데리고 갈게요', time: minutesAgo(95) },
    {
      id: 'senior-center',
      name: '경로당 친구들',
      memberCount: 6,
      look: { color: '#96d8cf' },
      secondLook: { color: '#f2c3a9' },
      preview: '내일 10시에 경로당에서 만나요',
      time: daysAgo(1),
    },
    { id: 'granddaughter', name: '손녀 지민', look: { photo: 'sunflower' }, preview: '할머니 사랑해요 ❤️', time: daysAgo(1) },
    {
      id: 'walking',
      name: '동네 산책 모임',
      memberCount: 12,
      look: { photo: 'path' },
      secondLook: { color: '#a9cdf2' },
      preview: '사진을 보냈습니다.',
      time: daysAgo(2),
    },
    { id: 'sister', name: '막내동생', look: { photo: 'mountain' }, preview: '언니 김치 잘 받았어 고마워', time: daysAgo(3) },
  ];
}

/* ---------- 딸과의 대화방 ---------- */

export type ChatMessage =
  | { id: string; kind: 'date'; text: string }
  | { id: string; from: 'them' | 'me'; kind: 'text'; text: string; time: string; unread?: number }
  | { id: string; from: 'them' | 'me'; kind: 'photo'; photo: PhotoKind; time: string; unread?: number };

export function daughterMessages(): ChatMessage[] {
  return [
    { id: 'd1', kind: 'date', text: fullDay(1) },
    { id: 'y1', from: 'them', kind: 'text', text: '엄마 보내주신 반찬 잘 받았어요', time: minutesAgo(60 * 24 + 30) },
    { id: 'y2', from: 'me', kind: 'text', text: '그래 맛있게 먹어라', time: minutesAgo(60 * 24 + 20) },
    { id: 'd2', kind: 'date', text: fullDay(0) },
    { id: 'm1', from: 'them', kind: 'text', text: '엄마 점심 드셨어요?', time: minutesAgo(40) },
    { id: 'm2', from: 'me', kind: 'text', text: '응 먹었다', time: minutesAgo(32) },
    { id: 'm3', from: 'them', kind: 'text', text: '오늘 날씨 좋아요. 산책 다녀오세요 🌷', time: minutesAgo(2) },
  ];
}

/** 문자 보내기 레슨에서 쓸 답장 (낱말마다 한 단계) */
export const replyWords = ['응', '고마워'];
export const replyText = replyWords.join(' ');

/** 레슨에서 보내게 될 사진 */
export const photoToSend: PhotoKind = 'flower';

/** + 판 '최근 사진' 줄 */
export const recentPhotos: PhotoKind[] = ['flower', 'tulips', 'path', 'tree'];

/** 사진 고르기 화면 (최근 항목) */
export const galleryPhotos: PhotoKind[] = [
  'flower', 'tulips', 'path', 'tree', 'sunset', 'blossom', 'lake', 'sunflower', 'mountain', 'clouds', 'bench', 'leaves',
];
