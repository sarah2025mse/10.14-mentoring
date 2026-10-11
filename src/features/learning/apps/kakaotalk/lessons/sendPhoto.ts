import type { Lesson } from '../../../engine/types';
import { openChatTab, openDaughterRoom } from './commonSteps';

/**
 * 첫 번째 레슨: 카카오톡에서 사진 보내기
 * 실제 안드로이드 카카오톡 기준: 채팅 탭 → 대화방 → + → 사진 → 사진 고르기 → 전송
 */
export const sendPhoto: Lesson = {
  id: 'kakaotalk-send-photo',
  appId: 'kakaotalk',
  title: '사진 보내기',
  description: '딸에게 꽃 사진을 보내 봐요',
  order: 1,
  icon: 'camera',
  status: 'ready',
  completeMessage: '사진 보내기를 해냈어요',
  finishScreenId: 'chat-room-photo-sent',
  steps: [
    openChatTab,
    openDaughterRoom,
    {
      id: 'open-plus-menu',
      screenId: 'chat-room',
      targetId: 'composer-plus',
      instruction: '왼쪽 아래 더하기(+) 버튼을 눌러 보세요',
      bubble: '여기를 눌러 보세요',
      hintAfterMistakes: '입력창 맨 왼쪽에 있는 더하기(+) 버튼이에요',
      check: {
        type: 'choice',
        question: '사진을 보내려면 채팅방에서 어떤 버튼을 먼저 눌러야 할까요?',
        choices: [
          { id: 'plus', symbol: '+', label: '더하기 버튼', detail: '입력창 맨 왼쪽', correct: true },
          { id: 'hash', symbol: '#', label: '샵 버튼', detail: '입력창 맨 오른쪽', correct: false },
        ],
        praise: '더하기(+) 버튼을 누르면 사진을 보낼 수 있어요.',
        explanation: '정답은 더하기(+) 버튼이에요. 입력창 왼쪽에 있어요. # 버튼은 검색할 때 쓰는 버튼이에요.',
      },
    },
    {
      id: 'open-photo-picker',
      screenId: 'attach-sheet',
      targetId: 'attach-photo',
      instruction: "'사진'을 눌러 보세요",
      bubble: '여기를 눌러 보세요',
      hintAfterMistakes: "초록색 그림 옆에 있는 '사진' 글자예요",
    },
    {
      id: 'pick-photo',
      screenId: 'gallery',
      targetId: 'gallery-photo-flower',
      instruction: '보내고 싶은 사진을 눌러 고르세요',
      bubble: '이 꽃 사진을 눌러 보세요',
      hintAfterMistakes: '맨 위 왼쪽에 있는 분홍 꽃 사진이에요',
    },
    {
      id: 'send-photo',
      screenId: 'gallery-selected',
      targetId: 'gallery-send',
      instruction: '전송 버튼을 누르면 사진이 가요',
      bubble: '노란 전송 버튼을 눌러 보세요',
      hintAfterMistakes: "오른쪽 위에 있는 노란 '1 전송' 버튼이에요",
    },
  ],
};
