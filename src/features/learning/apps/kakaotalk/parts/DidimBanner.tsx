import styles from './DidimBanner.module.css';

/** 실제 카카오톡의 광고 자리에 넣는 디딤 소개 배너 */
export function DidimBanner() {
  return (
    <div className={styles.banner} data-target="banner">
      <div className={styles.text}>
        <p className={styles.title}>오늘도 한 걸음씩, 디딤</p>
        <p className={styles.sub}>내 일상의 작은 디딤</p>
      </div>
      <svg className={styles.art} viewBox="0 0 96 64" aria-hidden="true">
        <path d="M6 58 Q40 50 54 34 T92 8" stroke="#c9ddd5" strokeWidth="10" fill="none" strokeLinecap="round" />
        <ellipse cx="16" cy="55" rx="11" ry="6" fill="#156051" />
        <ellipse cx="42" cy="43" rx="10" ry="5.5" fill="#156051" opacity="0.85" />
        <ellipse cx="62" cy="27" rx="9" ry="5" fill="#156051" opacity="0.7" />
        <ellipse cx="80" cy="14" rx="7.5" ry="4.2" fill="#156051" opacity="0.55" />
        <path d="M84 4 q4 -3 6 1 q-3 3 -6 -1z" fill="#6aa84f" />
      </svg>
    </div>
  );
}
