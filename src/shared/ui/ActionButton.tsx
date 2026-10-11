import type { ButtonHTMLAttributes } from 'react';
import { ArrowLeftIcon, HelpIcon } from './icons';
import styles from './ActionButton.module.css';

/**
 * 화면 위쪽의 작은 네모 버튼 + 아래 글자 ('앱 이미지/DIDIM'의 Prev action, Help action, Settings action)
 * - prev : 왼쪽 위 '이전' (연한 주황)
 * - help : 오른쪽 위 '도움말' (주황 채움)
 */
type ActionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  kind: 'prev' | 'help';
};

const content = {
  prev: { label: '이전', Icon: ArrowLeftIcon },
  help: { label: '도움말', Icon: HelpIcon },
};

export function ActionButton({ kind, className, type = 'button', ...rest }: ActionButtonProps) {
  const { label, Icon } = content[kind];
  return (
    <button type={type} className={[styles.action, styles[kind], className].filter(Boolean).join(' ')} {...rest}>
      <span className={styles.box} aria-hidden="true">
        <Icon size={24} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
