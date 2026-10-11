import { ActionButton } from '../../../shared/ui/ActionButton';
import { ProgressSegments } from '../../../shared/ui/ProgressSegments';
import styles from './StepHeader.module.css';

type StepHeaderProps = {
  /** 가운데 제목 (예: '카카오톡 배우기') */
  title: string;
  /** 진행 막대 아래 글자에 들어갈 레슨 이름 (예: '사진 보내기') */
  lessonTitle: string;
  stepNumber: number;
  total: number;
  /** 진행 막대에서 채울 칸 수 */
  filled: number;
  instruction: string;
  onBack: () => void;
  onHelp: () => void;
};

/**
 * 레슨 화면 맨 위의 단계 표시 탭.
 * '앱 이미지/DIDIM/Activity Top Bar.png' 모양 + 아래에 지금 할 일 한 줄.
 */
export function StepHeader({ title, lessonTitle, stepNumber, total, filled, instruction, onBack, onHelp }: StepHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <ActionButton kind="prev" onClick={onBack} />
        <h1 className={styles.title}>{title}</h1>
        <ActionButton kind="help" onClick={onHelp} />
      </div>
      <ProgressSegments total={total} filled={filled} caption={`${lessonTitle} · ${stepNumber} / ${total}`} />
      <p className={styles.instruction} aria-live="polite">
        {instruction}
      </p>
    </header>
  );
}
