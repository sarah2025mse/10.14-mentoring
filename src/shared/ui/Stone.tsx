import type { ReactNode } from 'react';
import stoneSprite from '../assets/stone.png';
import styles from './Stone.module.css';

/**
 * 디딤돌 그림 ('앱 이미지/DIDIM/Stone.png'). 한 장에 돌 6개(위: 초록 3, 아래: 회색 3)가 모여 있어
 * 그중 하나만 잘라서 보여준다. 위에 아이콘을 얹을 수 있다.
 */
type StoneProps = {
  tone: 'green' | 'gray';
  /** 같은 색 돌 3개 중 몇 번째 모양인지 (0~2) */
  shape?: 0 | 1 | 2;
  /** 돌 너비(px) */
  width?: number;
  icon?: ReactNode;
};

// 원본 그림 한 칸 크기
const CELL_W = 96;
const CELL_H = 93;

export function Stone({ tone, shape = 0, width = 84, icon }: StoneProps) {
  const scale = width / CELL_W;
  const row = tone === 'green' ? 0 : 1;
  return (
    <span
      className={`${styles.stone} ${styles[tone]}`}
      style={{
        width,
        height: CELL_H * scale,
        backgroundImage: `url(${stoneSprite})`,
        backgroundSize: `${288 * scale}px ${186 * scale}px`,
        backgroundPosition: `${-CELL_W * shape * scale}px ${-CELL_H * row * scale}px`,
      }}
      aria-hidden="true"
    >
      {icon && <span className={styles.icon}>{icon}</span>}
    </span>
  );
}
