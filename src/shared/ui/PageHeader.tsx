import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

/** 화면 제목 + 한 줄 설명 ('앱 이미지/DIDIM/Header.png') */
export function PageHeader({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
}
