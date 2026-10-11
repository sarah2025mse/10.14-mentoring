import type { ReactNode } from 'react';
import { CheckCircleIcon, InfoIcon, WarningIcon } from './icons';
import styles from './Toast.module.css';

/**
 * 짧은 알림 줄 ('앱 이미지/DIDIM/Toast.png')
 * - info    : 알려 드려요 (파랑)
 * - success : 잘 됐어요 (초록)
 * - warning : 확인해 주세요 (노랑)
 * 틀렸을 때도 혼내지 않도록 빨간 '실패' 모양은 학습에서 쓰지 않는다.
 */
type ToastProps = {
  tone: 'info' | 'success' | 'warning';
  children: ReactNode;
};

const icons = { info: InfoIcon, success: CheckCircleIcon, warning: WarningIcon };

export function Toast({ tone, children }: ToastProps) {
  const Icon = icons[tone];
  return (
    <div className={`${styles.toast} ${styles[tone]}`} role="status" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">
        <Icon size={22} />
      </span>
      <div className={styles.text}>{children}</div>
    </div>
  );
}
