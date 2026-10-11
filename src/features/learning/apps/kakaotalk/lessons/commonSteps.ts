import type { LessonStep } from '../../../engine/types';

/** 여러 레슨이 똑같이 거치는 앞부분 단계. 모든 레슨은 친구 탭(카카오톡 첫 화면)에서 시작한다. */

export const openChatTab: LessonStep = {
  id: 'open-chat-tab',
  screenId: 'friends',
  targetId: 'tab-chat',
  instruction: '아래에 있는 채팅 버튼을 눌러 보세요',
  bubble: '여기를 눌러 보세요',
  hintAfterMistakes: '아래쪽 왼쪽에서 두 번째, 말풍선 모양 버튼이에요',
};

export const openDaughterRoom: LessonStep = {
  id: 'open-daughter-room',
  screenId: 'chat-list',
  targetId: 'chatroom-daughter',
  instruction: '사진을 보낼 사람의 대화방을 눌러 보세요',
  bubble: "'딸' 대화방을 눌러 보세요",
  hintAfterMistakes: "맨 위에 있는 '딸' 대화방이에요",
};
