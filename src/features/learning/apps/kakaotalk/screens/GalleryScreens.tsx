import { ChatRoomView } from '../parts/ChatRoomView';
import { FakePhoto, type PhotoKind } from '../parts/FakePhoto';
import { CheckCircleIcon, ChevronDownIcon, CloseIcon, DotsIcon, SparkleIcon } from '../parts/icons';
import { daughterMessages, galleryPhotos, photoToSend } from '../data/fakeData';
import kk from '../parts/kakao.module.css';
import styles from './GalleryScreens.module.css';

/** + → '사진'을 눌렀을 때 나오는 사진 고르기 화면 (아직 아무것도 안 고름) */
export function GalleryScreen() {
  return <GalleryView selected={[]} />;
}

/** 사진 한 장(꽃 사진)을 고른 상태: 노란 테두리와 숫자 1, 위쪽 버튼이 '1 전송'으로 바뀜 */
export function GallerySelectedScreen() {
  return <GalleryView selected={[photoToSend]} />;
}

function GalleryView({ selected }: { selected: PhotoKind[] }) {
  const count = selected.length;

  return (
    <ChatRoomView
      messages={daughterMessages()}
      overlay={
        <div className={styles.sheet}>
          <span className={styles.handle} />
          <div className={styles.head}>
            <button type="button" className={kk.iconBtn} data-target="gallery-close" aria-label="닫기">
              <CloseIcon size={24} />
            </button>
            <button type="button" className={`${kk.btn} ${styles.album}`} data-target="gallery-album">
              최근 항목 <ChevronDownIcon size={18} />
            </button>
            <button
              type="button"
              className={`${kk.btn} ${count ? styles.sendOn : styles.sendOff}`}
              data-target="gallery-send"
            >
              {count ? `${count} 전송` : '전송'}
            </button>
          </div>

          {count > 0 && (
            <div className={styles.picked}>
              {selected.map((kind) => (
                <span key={kind} className={styles.pickedThumb}>
                  <FakePhoto kind={kind} />
                  <span className={styles.pickedX}>
                    <CloseIcon size={9} />
                  </span>
                </span>
              ))}
            </div>
          )}

          <div className={styles.grid}>
            {galleryPhotos.map((kind) => {
              const order = selected.indexOf(kind) + 1;
              return (
                <button
                  type="button"
                  key={kind}
                  className={`${kk.btn} ${styles.cell} ${order ? styles.cellOn : ''}`}
                  data-target={`gallery-photo-${kind}`}
                >
                  <FakePhoto kind={kind} />
                  {order ? <span className={styles.number}>{order}</span> : <span className={styles.ring} />}
                </button>
              );
            })}
          </div>

          <div className={styles.foot}>
            <span className={styles.bundle}>
              <CheckCircleIcon size={22} />
              사진 묶어보내기
            </span>
            <span className={styles.footIcons}>
              <SparkleIcon size={22} />
              <DotsIcon size={22} />
            </span>
          </div>
        </div>
      }
    />
  );
}
