import { Button } from '../../../shared/ui/Button';
import { Dialog } from '../../../shared/ui/Dialog';
import { Toast } from '../../../shared/ui/Toast';
import styles from './HelpDialog.module.css';

type HelpDialogProps = {
  lessonTitle: string;
  stepNumber: number;
  total: number;
  /** 지금 할 일 (단계 표시 탭의 안내와 같은 말) */
  instruction: string;
  /** 어디를 누르면 되는지 더 자세한 설명 */
  hint: string;
  onClose: () => void;
};

/** '도움말' 버튼: 지금 무엇을 하는 중이고 어디를 누르면 되는지 다시 알려준다. */
export function HelpDialog({ lessonTitle, stepNumber, total, instruction, hint, onClose }: HelpDialogProps) {
  return (
    <Dialog
      title="지금 할 일"
      description={`${lessonTitle} 연습 중이에요. ${total}단계 중 ${stepNumber}단계예요.`}
      actions={
        <Button block onClick={onClose}>
          확인
        </Button>
      }
    >
      <p className={styles.instruction}>{instruction}</p>
      <Toast tone="info">{hint}</Toast>
    </Dialog>
  );
}
