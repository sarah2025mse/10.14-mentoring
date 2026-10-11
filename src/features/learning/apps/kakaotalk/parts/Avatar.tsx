import { FakePhoto, type PhotoKind } from './FakePhoto';
import styles from './Avatar.module.css';

/** 프로필 사진: 기본 프로필(색 + 사람 모양) 또는 가짜 사진 */
export type AvatarLook = { color: string } | { photo: PhotoKind };

type AvatarProps = {
  look: AvatarLook;
  size?: number;
  /** 단톡방처럼 두 사람이 겹친 모양 */
  second?: AvatarLook;
};

export function Avatar({ look, size = 52, second }: AvatarProps) {
  if (second) {
    const small = Math.round(size * 0.68);
    return (
      <span className={styles.group} style={{ width: size, height: size }}>
        <span className={styles.groupBack}>
          <Face look={look} size={small} />
        </span>
        <span className={styles.groupFront}>
          <Face look={second} size={small} />
        </span>
      </span>
    );
  }
  return <Face look={look} size={size} />;
}

function Face({ look, size }: { look: AvatarLook; size: number }) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size }}>
      {'photo' in look ? (
        <FakePhoto kind={look.photo} />
      ) : (
        <span className={styles.default} style={{ background: look.color }}>
          <svg viewBox="0 0 40 40" width="62%" height="62%" aria-hidden="true">
            <circle cx="20" cy="15" r="7" fill="#fff" opacity="0.9" />
            <path d="M7 34c1-7 6.5-11 13-11s12 4 13 11z" fill="#fff" opacity="0.9" />
          </svg>
        </span>
      )}
    </span>
  );
}
