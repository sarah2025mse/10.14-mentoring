import type { Lesson } from '../../../engine/types';
import { replyText, replyWords } from '../data/fakeData';
import { openChatTab, openDaughterRoom } from './commonSteps';

/**
 * 두 번째 레슨: 문자 보내기 (딸에게 '응 고마워' 답장)
 * 실제 안드로이드 카카오톡 기준: 채팅 탭 → 대화방 → 입력창 누르기 → 휴대폰 키보드로 쓰기 → 노란 전송 버튼
 * 글자는 어르신 휴대폰의 진짜 키보드로 쓰고, 낱말 하나가 한 단계다.
 */
export const sendText: Lesson = {
  id: 'kakaotalk-send-text',
  appId: 'kakaotalk',
  title: '문자 보내기',
  description: `딸에게 '${replyText}' 답장을 써 봐요`,
  order: 2,
  icon: 'message',
  status: 'ready',
  completeMessage: '문자 보내기를 해냈어요',
  finishScreenId: 'chat-room-text-sent',
  steps: [
    openChatTab,
    { ...openDaughterRoom, instruction: '답장을 보낼 사람의 대화방을 눌러 보세요' },
    {
      id: 'open-keyboard',
      screenId: 'chat-room',
      targetId: 'composer-input',
      instruction: "아래 '메시지 입력' 칸을 눌러 보세요",
      bubble: '여기를 눌러 보세요',
      hintAfterMistakes: "맨 아래, '메시지 입력'이라고 쓰인 칸이에요",
    },
    {
      id: 'type-first-word',
      screenId: 'chat-room-typing',
      targetId: 'composer-input',
      typing: { text: replyWords[0] },
      instruction: `키보드로 '${replyWords[0]}'을 써 보세요`,
      bubble: `'${replyWords[0]}'을 써 보세요`,
      hintAfterMistakes: '휴대폰 아래쪽 키보드로 써요. 키보드가 안 보이면 이 칸을 한 번 눌러 보세요',
    },
    {
      id: 'type-second-word',
      screenId: 'chat-room-typing',
      targetId: 'composer-input',
      typing: { text: replyText },
      instruction: `한 칸 띄우고 '${replyWords[1]}'를 써 보세요`,
      bubble: `띄어쓰기 후 '${replyWords[1]}'`,
      hintAfterMistakes: '키보드 맨 아래 넓은 버튼이 띄어쓰기예요. 그다음 글자를 써요',
    },
    {
      id: 'send-text',
      screenId: 'chat-room-typing',
      targetId: 'composer-send',
      instruction: '전송 버튼을 누르면 글이 가요',
      bubble: '노란 전송 버튼을 눌러 보세요',
      hintAfterMistakes: '입력창 오른쪽 끝에 있는 노란 동그라미 버튼이에요',
      check: {
        type: 'choice',
        question: '다 쓴 글을 보내려면 어떤 버튼을 눌러야 할까요?',
        choices: [
          { id: 'send', symbol: '▶', label: '노란 전송 버튼', detail: '입력창 맨 오른쪽', correct: true },
          { id: 'plus', symbol: '+', label: '더하기 버튼', detail: '입력창 맨 왼쪽', correct: false },
        ],
        praise: '글을 다 쓰면 노란 전송 버튼을 눌러 보내요.',
        explanation: '정답은 노란 전송 버튼이에요. 글자를 쓰면 입력창 오른쪽 끝에 생겨요. 더하기(+) 버튼은 사진을 보낼 때 써요.',
      },
    },
  ],
};
