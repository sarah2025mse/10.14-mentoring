import { Avatar } from '../parts/Avatar';
import { DidimBanner } from '../parts/DidimBanner';
import { TabBar } from '../parts/TabBar';
import { AddFriendIcon, CakeIcon, ChevronRightIcon, GiftBoxIcon, SearchIcon, SettingsIcon } from '../parts/icons';
import { birthdayFriends, friendList, me, updatedFriends } from '../data/fakeData';
import kk from '../parts/kakao.module.css';
import styles from './FriendsScreen.module.css';

/** 친구 탭 (카카오톡 첫 화면). 업데이트 후 모습에서 위쪽 '친구'가 골라진 상태. */
export function FriendsScreen() {
  return (
    <div className={kk.root}>
      <div className={kk.topBar}>
        <button type="button" className={`${kk.btn} ${styles.me}`} data-target="my-profile">
          <Avatar look={me.look} size={36} />
          <span className={styles.myName}>{me.name}</span>
        </button>
        <div className={kk.topIcons}>
          <button type="button" className={kk.iconBtn} data-target="search" aria-label="검색">
            <SearchIcon size={25} />
          </button>
          <button type="button" className={kk.iconBtn} data-target="add-friend" aria-label="친구 추가">
            <AddFriendIcon size={25} />
          </button>
          <button type="button" className={kk.iconBtn} data-target="gift" aria-label="선물하기">
            <GiftBoxIcon size={25} />
          </button>
          <button type="button" className={kk.iconBtn} data-target="settings" aria-label="설정">
            <SettingsIcon size={25} />
          </button>
        </div>
      </div>

      <div className={kk.chips}>
        <button type="button" className={kk.chipOn} data-target="chip-friends">
          친구
        </button>
        <button type="button" className={kk.chip} data-target="chip-news">
          소식
        </button>
      </div>

      <div className={kk.body}>
        <DidimBanner />

        <div className={styles.updated}>
          {updatedFriends.map((friend) => (
            <button type="button" key={friend.name} className={`${kk.btn} ${styles.updatedItem}`} data-target="friend">
              <Avatar look={friend.look} size={58} />
              <span className={styles.updatedName}>{friend.name}</span>
            </button>
          ))}
        </div>

        <p className={styles.section}>생일인 친구 {birthdayFriends.length}</p>
        {birthdayFriends.map((friend) => (
          <div key={friend.name} className={styles.row}>
            <Avatar look={friend.look} size={44} />
            <span className={styles.name}>{friend.name}</span>
            <button type="button" className={`${kk.btn} ${styles.giftBtn}`} data-target="birthday-gift">
              선물하기
            </button>
          </div>
        ))}
        <div className={styles.row}>
          <span className={styles.cake}>
            <CakeIcon size={26} />
          </span>
          <span className={styles.name}>친구의 생일을 확인해 보세요.</span>
          <span className={styles.more}>
            5 <ChevronRightIcon size={16} />
          </span>
        </div>

        <p className={styles.section}>친구 {friendList.length + 19}</p>
        {friendList.map((friend) => (
          <div key={friend.name} className={styles.row}>
            <Avatar look={friend.look} size={44} />
            <span className={styles.name}>{friend.name}</span>
            {friend.status && <span className={styles.status}>{friend.status}</span>}
          </div>
        ))}
      </div>

      <TabBar active="friends" chatBadge={1} />
    </div>
  );
}
