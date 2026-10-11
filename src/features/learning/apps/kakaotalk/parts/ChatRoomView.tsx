import type { ReactNode } from 'react';
import { Avatar } from './Avatar';
import { FakePhoto } from './FakePhoto';
import {
  BackIcon,
  ChatbotIcon,
  DotsIcon,
  HashIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  SendPlaneIcon,
  SmileIcon,
  SpellCheckIcon,
  TranslateIcon,
} from './icons';
import { usePracticeInput } from '../../../engine/PracticeInput';
import { daughter, type ChatMessage } from '../data/fakeData';
import kk from './kakao.module.css';
import styles from './ChatRoomView.module.css';

type ChatRoomViewProps = {
  messages: ChatMessage[];
  /** 채팅방 위에 덮는 것 (+ 판, 사진 고르기 화면 등). 있으면 뒤 채팅방이 어두워진다 */
  overlay?: ReactNode;
  /** 입력창을 눌러 글자를 쓰는 중 (진짜 입력 칸 + 도구 줄. 글자가 있으면 # 자리가 노란 전송 버튼) */
  typing?: boolean;
};

/** 딸과의 채팅방. 대화가 많으면 위쪽이 잘리고, 아래 입력창은 항상 보인다. */
export function ChatRoomView({ messages, overlay, typing = false }: ChatRoomViewProps) {
  return (
    <div className={`${kk.root} ${styles.room}`}>
      <div className={styles.header}>
        <button type="button" className={kk.iconBtn} data-target="room-back" aria-label="뒤로">
          <BackIcon size={26} />
        </button>
        <h2 className={styles.title}>{daughter.name}</h2>
        <button type="button" className={kk.iconBtn} data-target="room-search" aria-label="검색">
          <SearchIcon size={25} />
        </button>
        <button type="button" className={kk.iconBtn} data-target="room-menu" aria-label="메뉴">
          <MenuIcon size={25} />
        </button>
      </div>

      <div className={styles.messages}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      {typing ? <TypingComposer /> : <IdleComposer />}

      {overlay && (
        <>
          <div className={styles.dim} />
          {overlay}
        </>
      )}
    </div>
  );
}

/** 입력창 (아직 누르지 않음) */
function IdleComposer() {
  return (
    <div className={styles.composer}>
      <button type="button" className={`${kk.btn} ${styles.plus}`} data-target="composer-plus" aria-label="더하기">
        <PlusIcon size={22} />
      </button>
      <span className={styles.input} data-target="composer-input">
        메시지 입력
      </span>
      <button type="button" className={`${kk.btn} ${styles.emoji}`} data-target="composer-emoji" aria-label="이모티콘">
        <SmileIcon size={22} />
      </button>
      <button type="button" className={`${kk.btn} ${styles.hash}`} data-target="composer-hash" aria-label="샵 검색">
        <HashIcon size={20} />
      </button>
    </div>
  );
}

/**
 * 입력창을 눌러 글자를 쓰는 중. 휴대폰의 진짜 키보드로 쓴다.
 * 글자가 있으면 # 자리에 노란 전송 버튼이 나오고, 입력창 아래에 도구 줄이 붙는다 (실제 캡처 기준).
 */
function TypingComposer() {
  const { value, setValue } = usePracticeInput();
  const hasText = value.length > 0;

  return (
    <>
      <div className={styles.composer}>
        <button type="button" className={`${kk.btn} ${styles.plus}`} data-target="composer-plus" aria-label="더하기">
          <PlusIcon size={22} />
        </button>
        <input
          className={styles.inputReal}
          data-target="composer-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="메시지 입력"
          aria-label="메시지 입력"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
        />
        <button type="button" className={`${kk.btn} ${styles.emoji}`} data-target="composer-emoji" aria-label="이모티콘">
          <SmileIcon size={22} />
        </button>
        {hasText ? (
          <button type="button" className={`${kk.btn} ${styles.send}`} data-target="composer-send" aria-label="전송">
            <SendPlaneIcon size={22} />
          </button>
        ) : (
          <button type="button" className={`${kk.btn} ${styles.hash}`} data-target="composer-hash" aria-label="샵 검색">
            <HashIcon size={20} />
          </button>
        )}
      </div>
      <div className={styles.tools}>
        <span className={styles.tool} data-target="tool-spell">
          <SpellCheckIcon size={20} /> 맞춤법
        </span>
        <span className={styles.tool} data-target="tool-translate">
          <TranslateIcon size={20} /> 번역
        </span>
        <span className={styles.tool} data-target="tool-chatbot">
          <ChatbotIcon size={20} /> 챗봇
        </span>
        <span className={styles.toolPill} data-target="tool-chatgpt">
          + ChatGPT
        </span>
        <span className={styles.toolMore} data-target="tool-more">
          <DotsIcon size={20} />
        </span>
      </div>
    </>
  );
}

function Message({ message }: { message: ChatMessage }) {
  if (message.kind === 'date') {
    return (
      <div className={styles.dateLine}>
        <span>{message.text}</span>
      </div>
    );
  }

  const content =
    message.kind === 'text' ? (
      <span className={message.from === 'me' ? styles.bubbleMe : styles.bubbleThem}>{message.text}</span>
    ) : (
      <span className={styles.photo} data-target="sent-photo">
        <FakePhoto kind={message.photo} />
      </span>
    );

  const meta = (
    <span className={styles.meta}>
      {message.unread ? <span className={styles.unread}>{message.unread}</span> : null}
      <span>{message.time}</span>
    </span>
  );

  if (message.from === 'me') {
    return (
      <div className={styles.rowMe}>
        {meta}
        {content}
      </div>
    );
  }

  return (
    <div className={styles.rowThem}>
      <Avatar look={daughter.look} size={40} />
      <div className={styles.themBody}>
        <span className={styles.sender}>{daughter.name}</span>
        <div className={styles.themLine}>
          {content}
          {meta}
        </div>
      </div>
    </div>
  );
}
