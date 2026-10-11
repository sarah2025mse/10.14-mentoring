import { useEffect, useId, useRef, type ReactNode } from 'react';
import styles from './Dialog.module.css';

type DialogProps = {
  title: ReactNode;
  /** 제목 아래 설명 */
  description?: ReactNode;
  /** 제목 위 그림이나 아이콘 */
  art?: ReactNode;
  /** 설명 아래 내용 (선택지 등) */
  children?: ReactNode;
  /** 맨 아래 버튼들. 2개면 나란히 놓인다 */
  actions?: ReactNode;
  /** 버튼을 위아래로 쌓기 (버튼 글자가 길 때) */
  stackActions?: boolean;
};

/**
 * 디딤 팝업 ('앱 이미지/DIDIM/Dialog.png'). 휴대폰 틀 안을 덮는다.
 * 바깥을 눌러도 닫히지 않는다(실수로 닫히지 않게).
 */
export function Dialog({ title, description, art, children, actions, stackActions = false }: DialogProps) {
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  return (
    <div className={styles.backdrop}>
      <div
        ref={cardRef}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {art && <div className={styles.art}>{art}</div>}
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {description && <div className={styles.description}>{description}</div>}
        {children && <div className={styles.body}>{children}</div>}
        {actions && <div className={`${styles.actions} ${stackActions ? styles.stacked : ''}`}>{actions}</div>}
      </div>
    </div>
  );
}
