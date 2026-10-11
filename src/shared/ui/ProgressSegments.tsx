import styles from './ProgressSegments.module.css';

type ProgressSegmentsProps = {
  total: number;
  /** 채울 칸 수 */
  filled: number;
  /** 막대 아래 글자 (예: '사진 보내기 · 2 / 6') */
  caption?: string;
};

/** 칸으로 나뉜 진행 막대 ('앱 이미지/DIDIM/Progress.png' 아래쪽 모양) */
export function ProgressSegments({ total, filled, caption }: ProgressSegmentsProps) {
  return (
    <div className={styles.wrap}>
      <div
        className={styles.bars}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={filled}
        aria-label={caption}
      >
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={`${styles.bar} ${index < filled ? styles.on : ''}`} />
        ))}
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
