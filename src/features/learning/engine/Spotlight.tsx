import { useCallback, useLayoutEffect, useState } from 'react';
import styles from './Spotlight.module.css';

/** 틀리게 눌렀을 때 문구 (어떤 앱이든 같은 말) */
const MISTAKE_MESSAGE = '여기가 아니에요. 빛나는 곳을 눌러 보세요';

type SpotlightProps = {
  /** 연습 화면이 들어 있는 상자 */
  stageEl: HTMLDivElement;
  /** 화면이 바뀌면 다시 위치를 잰다 */
  screenId: string;
  /** 눌러야 할 곳의 data-target */
  targetId: string;
  bubble: string;
  hintAfterMistakes?: string;
  /** 지금 단계에서 연속으로 틀린 횟수 */
  mistakes: number;
  /** 있으면 말풍선에 이 문구를 보여준다 (글자를 다르게 썼을 때 등) */
  override?: string;
};

type Box = { top: number; left: number; width: number; height: number };

/**
 * 눌러야 할 곳 하나만 밝게 남기고 나머지를 살짝 어둡게 한다. 옆에 말풍선을 붙인다.
 * 위치는 화면 속 data-target 이름표를 찾아 계산하므로, 화면 배치가 바뀌어도 레슨 데이터는 그대로 쓴다.
 * 하이라이트는 누름을 막지 않는다(아래 화면이 그대로 눌린다).
 */
export function Spotlight({ stageEl, screenId, targetId, bubble, hintAfterMistakes, mistakes, override }: SpotlightProps) {
  const [target, setTarget] = useState<Box | null>(null);
  const [stage, setStage] = useState<{ width: number; height: number } | null>(null);

  const measure = useCallback(() => {
    const stageRect = stageEl.getBoundingClientRect();
    const el = stageEl.querySelector(`[data-target="${CSS.escape(targetId)}"]`);
    setStage((prev) => sameSize(prev, stageRect) ? prev : { width: stageRect.width, height: stageRect.height });
    if (!el) {
      if (import.meta.env.DEV) console.warn(`[학습 엔진] 화면 '${screenId}'에서 '${targetId}' 이름표를 찾지 못했어요.`);
      setTarget(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const next = {
      top: rect.top - stageRect.top,
      left: rect.left - stageRect.left,
      width: rect.width,
      height: rect.height,
    };
    setTarget((prev) => (prev && sameSize(prev, next) && prev.top === next.top && prev.left === next.left ? prev : next));
  }, [stageEl, screenId, targetId]);

  useLayoutEffect(() => {
    measure();
    // 크기가 바뀌거나, 화면 속 움직임이 끝나거나, 글꼴을 다 불러오면 다시 잰다.
    const observer = new ResizeObserver(measure);
    observer.observe(stageEl);
    stageEl.addEventListener('animationend', measure, true);
    stageEl.addEventListener('transitionend', measure, true);
    let active = true;
    document.fonts?.ready.then(() => {
      if (active) measure();
    });
    return () => {
      active = false;
      observer.disconnect();
      stageEl.removeEventListener('animationend', measure, true);
      stageEl.removeEventListener('transitionend', measure, true);
    };
  }, [measure, stageEl]);

  if (!target || !stage) return null;

  const strong = mistakes >= 2;
  const pad = strong ? 12 : 6;
  const hole = {
    top: target.top - pad,
    left: target.left - pad,
    width: target.width + pad * 2,
    height: target.height + pad * 2,
  };

  const text = override ?? (mistakes === 0 ? bubble : mistakes === 1 ? MISTAKE_MESSAGE : (hintAfterMistakes ?? MISTAKE_MESSAGE));

  // 말풍선: 눌러야 할 곳이 화면 아래쪽이면 위에, 위쪽이면 아래에 붙인다.
  const gap = 14;
  const bubbleWidth = Math.min(290, stage.width - 24);
  const centerX = hole.left + hole.width / 2;
  const bubbleLeft = clamp(centerX - bubbleWidth / 2, 12, stage.width - bubbleWidth - 12);
  const arrowLeft = clamp(centerX - bubbleLeft, 22, bubbleWidth - 22);
  const placeAbove = hole.top + hole.height / 2 > stage.height / 2;
  const bubbleStyle = placeAbove
    ? { left: bubbleLeft, width: bubbleWidth, bottom: stage.height - hole.top + gap }
    : { left: bubbleLeft, width: bubbleWidth, top: hole.top + hole.height + gap };

  return (
    <div className={styles.layer}>
      <div className={styles.hole} style={hole} />
      <div className={`${styles.ring} ${strong ? styles.ringStrong : ''}`} style={hole} />
      <div
        key={override ? 'override' : mistakes}
        className={`${styles.bubble} ${placeAbove ? styles.above : styles.below} ${mistakes > 0 || override ? styles.nudge : ''}`}
        style={bubbleStyle}
        role="status"
        aria-live="polite"
      >
        {text}
        <span className={styles.arrow} style={{ left: arrowLeft }} />
      </div>
    </div>
  );
}

function sameSize(a: { width: number; height: number } | null, b: { width: number; height: number }) {
  return !!a && a.width === b.width && a.height === b.height;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
