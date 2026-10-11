import type { ComponentType, MouseEvent, ReactNode, Ref } from 'react';
import styles from './PracticeStage.module.css';

type PracticeStageProps = {
  /** 보여줄 연습 화면 (없으면 '준비 중' 안내) */
  Screen: ComponentType | undefined;
  screenId: string;
  /** 화면을 누르면 누른 곳의 data-target 을 알려준다 (없는 곳이면 null) */
  onTap: (targetId: string | null) => void;
  /** 하이라이트 등 화면 위에 덮는 것 */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

/**
 * 연습 화면이 들어가는 자리. 화면 안의 모든 누름을 먼저 가로채서 엔진에 알려준다.
 * 그래서 연습 화면 컴포넌트는 클릭 처리 없이 그림과 data-target 이름표만 있으면 된다.
 */
export function PracticeStage({ Screen, screenId, onTap, children, ref }: PracticeStageProps) {
  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    // 글자 입력 칸은 눌러서 키보드를 열 수 있어야 하므로 기본 동작을 막지 않는다.
    if (!(event.target as Element).closest('input, textarea')) event.preventDefault();
    event.stopPropagation();
    const target = (event.target as Element).closest('[data-target]');
    onTap(target?.getAttribute('data-target') ?? null);
  }

  // 글자 입력 칸이 아닌 곳을 눌러도 입력 칸의 포커스(휴대폰 키보드)가 유지되게 한다.
  function handleMouseDownCapture(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target as Element).closest('input, textarea')) event.preventDefault();
  }

  return (
    <div ref={ref} className={styles.stage}>
      <div className={styles.screen} onClickCapture={handleClickCapture} onMouseDownCapture={handleMouseDownCapture}>
        {Screen ? (
          <Screen />
        ) : (
          <p className={styles.missing}>
            이 화면은 아직 준비 중이에요
            <br />({screenId})
          </p>
        )}
      </div>
      {children}
      <span className={styles.badge}>연습 화면</span>
    </div>
  );
}
