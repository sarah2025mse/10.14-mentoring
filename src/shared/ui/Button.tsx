import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

/**
 * 디딤 버튼 ('앱 이미지/DIDIM/Button.png')
 * - primary : 앞으로 가는 버튼(다음, 완료, 확인). 주색상 채움
 * - soft    : 덜 중요한 앞으로 가는 버튼. 연한 초록
 * - outline : 흰 바탕에 주색상 테두리
 * - back    : 뒤로 가거나 멈추는 버튼(이전, 그만하기). 연한 주황 + 강조 색 테두리
 * - neutral : 팝업의 '취소'
 * - danger  : 지우기처럼 되돌릴 수 없는 버튼. 강조 색 채움
 */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'soft' | 'outline' | 'back' | 'neutral' | 'danger';
  /** 아이콘은 항상 글자와 함께 쓴다. */
  icon?: ReactNode;
  block?: boolean;
};

export function Button({
  variant = 'primary',
  icon,
  block = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], block && styles.block, className].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}
