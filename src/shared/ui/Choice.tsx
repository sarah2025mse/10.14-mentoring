import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { CheckCircleIcon } from './icons';
import styles from './Choice.module.css';

/**
 * 고르기 카드 ('앱 이미지/DIDIM/Choice.png')
 * 왼쪽 네모 그림 + 제목 + 상세. 고르면 주색상으로 채워지고 오른쪽에 체크 표시.
 */
type ChoiceProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> & {
  title: ReactNode;
  detail?: ReactNode;
  /** 왼쪽 네모 안에 들어갈 아이콘이나 짧은 글자 */
  symbol?: ReactNode;
  selected?: boolean;
  /** 고르지 않은 것처럼 흐리게 (틀린 답을 고른 뒤 등) */
  dimmed?: boolean;
};

export function Choice({ title, detail, symbol, selected = false, dimmed = false, className, type = 'button', ...rest }: ChoiceProps) {
  return (
    <button
      type={type}
      className={[styles.choice, selected && styles.selected, dimmed && styles.dimmed, className].filter(Boolean).join(' ')}
      aria-pressed={selected}
      {...rest}
    >
      {symbol !== undefined && (
        <span className={styles.symbol} aria-hidden="true">
          {symbol}
        </span>
      )}
      <span className={styles.texts}>
        <span className={styles.title}>{title}</span>
        {detail && <span className={styles.detail}>{detail}</span>}
      </span>
      {selected && (
        <span className={styles.check} aria-hidden="true">
          <CheckCircleIcon size={26} />
        </span>
      )}
    </button>
  );
}
