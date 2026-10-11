import { ChatRoomView } from '../parts/ChatRoomView';
import { daughterMessages, minutesAgo, photoToSend, replyText } from '../data/fakeData';

/** 채팅방 기본 모습 */
export function ChatRoomScreen() {
  return <ChatRoomView messages={daughterMessages()} />;
}

/** 입력창을 눌러 글자를 쓰는 중 (휴대폰 키보드가 올라와 있음) */
export function ChatRoomTypingScreen() {
  return <ChatRoomView messages={daughterMessages()} typing />;
}

/** 사진을 보낸 뒤: 내가 보낸 꽃 사진이 채팅방에 올라가 있다 */
export function PhotoSentScreen() {
  return (
    <ChatRoomView
      messages={[
        ...daughterMessages(),
        { id: 'sent', from: 'me', kind: 'photo', photo: photoToSend, time: minutesAgo(0), unread: 1 },
      ]}
    />
  );
}

/** 답장을 보낸 뒤: 내가 쓴 글이 노란 말풍선으로 올라가 있다 */
export function TextSentScreen() {
  return (
    <ChatRoomView
      messages={[
        ...daughterMessages(),
        { id: 'sent', from: 'me', kind: 'text', text: replyText, time: minutesAgo(0), unread: 1 },
      ]}
    />
  );
}
