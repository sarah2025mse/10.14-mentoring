import { DotsIcon, TabChatIcon, TabFriendsIcon, TabOpenChatIcon, TabShoppingIcon } from './icons';
import styles from './TabBar.module.css';

type TabId = 'friends' | 'chat' | 'openchat' | 'shopping' | 'more';

const tabs: { id: TabId; label: string; Icon: typeof TabChatIcon }[] = [
  { id: 'friends', label: '친구', Icon: TabFriendsIcon },
  { id: 'chat', label: '채팅', Icon: TabChatIcon },
  { id: 'openchat', label: '오픈채팅', Icon: TabOpenChatIcon },
  { id: 'shopping', label: '쇼핑', Icon: TabShoppingIcon },
  { id: 'more', label: '더보기', Icon: DotsIcon },
];

type TabBarProps = {
  active: TabId;
  /** 채팅 아이콘 위 빨간 숫자 */
  chatBadge?: number;
};

/** 카카오톡 하단 탭. 실제처럼 글자 없이 아이콘만 보인다 (화면 읽기용 이름만 있음). */
export function TabBar({ active, chatBadge }: TabBarProps) {
  return (
    <nav className={styles.bar}>
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`${styles.tab} ${id === active ? styles.on : ''}`}
          data-target={`tab-${id}`}
          aria-label={label}
        >
          <span className={styles.iconWrap}>
            <Icon size={27} />
            {id === 'chat' && chatBadge ? <span className={styles.count}>{chatBadge}</span> : null}
            {id === 'more' && <span className={styles.dot} />}
          </span>
        </button>
      ))}
    </nav>
  );
}
