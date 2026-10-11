import { Avatar } from '../parts/Avatar';
import { DidimBanner } from '../parts/DidimBanner';
import { TabBar } from '../parts/TabBar';
import { NewChatIcon, SearchIcon, SettingsIcon } from '../parts/icons';
import { chatRooms } from '../data/fakeData';
import kk from '../parts/kakao.module.css';
import styles from './ChatListScreen.module.css';

/** 채팅 탭: 채팅방 목록 */
export function ChatListScreen() {
  const rooms = chatRooms();

  return (
    <div className={kk.root}>
      <div className={kk.topBar}>
        <h2 className={kk.topTitle}>채팅</h2>
        <div className={kk.topIcons}>
          <button type="button" className={kk.iconBtn} data-target="search" aria-label="검색">
            <SearchIcon size={25} />
          </button>
          <button type="button" className={kk.iconBtn} data-target="new-chat" aria-label="새로운 채팅">
            <NewChatIcon size={25} />
          </button>
          <button type="button" className={kk.iconBtn} data-target="settings" aria-label="설정">
            <SettingsIcon size={25} />
          </button>
        </div>
      </div>

      <div className={kk.chips}>
        <button type="button" className={kk.chipOn} data-target="chip-all">
          전체
        </button>
        <button type="button" className={kk.chip} data-target="chip-unread">
          안읽음
        </button>
        <button type="button" className={kk.chip} data-target="chip-call">
          통화
        </button>
      </div>

      <div className={kk.body}>
        <DidimBanner />
        {rooms.map((room) => (
          <button
            type="button"
            key={room.id}
            className={`${kk.btn} ${styles.room}`}
            data-target={`chatroom-${room.id}`}
          >
            <Avatar look={room.look} second={room.secondLook} size={52} />
            <span className={styles.texts}>
              <span className={styles.nameLine}>
                <span className={styles.name}>{room.name}</span>
                {room.memberCount && <span className={styles.members}>{room.memberCount}</span>}
              </span>
              <span className={styles.preview}>{room.preview}</span>
            </span>
            <span className={styles.meta}>
              <span className={styles.time}>{room.time}</span>
              {room.unread ? <span className={kk.badge}>{room.unread}</span> : null}
            </span>
          </button>
        ))}
      </div>

      <TabBar active="chat" chatBadge={1} />
    </div>
  );
}
