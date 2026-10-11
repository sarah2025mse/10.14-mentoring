import { ChatRoomView } from '../parts/ChatRoomView';
import { FakePhoto } from '../parts/FakePhoto';
import {
  AttachCallIcon,
  AttachFileIcon,
  AttachGiftIcon,
  AttachMoneyIcon,
  AttachPhotoIcon,
  CameraIcon,
  ExpandIcon,
} from '../parts/icons';
import { daughterMessages, recentPhotos } from '../data/fakeData';
import kk from '../parts/kakao.module.css';
import styles from './AttachSheetScreen.module.css';

const menu = [
  { id: 'attach-photo', label: '사진', Icon: AttachPhotoIcon },
  { id: 'attach-money', label: '송금', Icon: AttachMoneyIcon },
  { id: 'attach-file', label: '파일', Icon: AttachFileIcon },
  { id: 'attach-gift', label: '선물하기', Icon: AttachGiftIcon },
];

/** 채팅방에서 + 를 눌렀을 때 아래에서 올라오는 판 (최근 사진, 사진, 송금, 파일, 선물하기, 통화) */
export function AttachSheetScreen() {
  return (
    <ChatRoomView
      messages={daughterMessages()}
      overlay={
        <div className={styles.sheet}>
          <span className={styles.handle} />
          <div className={styles.head}>
            <span className={styles.headTitle}>최근 사진</span>
            <button type="button" className={`${kk.btn} ${styles.sendOff}`} data-target="recent-send">
              전송
            </button>
          </div>

          <div className={styles.strip}>
            <button type="button" className={`${kk.btn} ${styles.camera}`} data-target="recent-camera" aria-label="카메라">
              <CameraIcon size={40} />
            </button>
            {recentPhotos.map((kind) => (
              <button type="button" key={kind} className={`${kk.btn} ${styles.thumb}`} data-target={`recent-photo-${kind}`}>
                <FakePhoto kind={kind} />
                <span className={styles.selectRing} />
                <span className={styles.expand}>
                  <ExpandIcon size={14} />
                </span>
              </button>
            ))}
          </div>

          <div className={styles.menu}>
            {menu.map(({ id, label, Icon }) => (
              <button type="button" key={id} className={`${kk.btn} ${styles.item}`} data-target={id}>
                <Icon size={26} />
                <span>{label}</span>
              </button>
            ))}
            <div className={styles.divider} />
            <button type="button" className={`${kk.btn} ${styles.item}`} data-target="attach-call">
              <AttachCallIcon size={26} />
              <span>통화</span>
            </button>
          </div>
        </div>
      }
    />
  );
}
