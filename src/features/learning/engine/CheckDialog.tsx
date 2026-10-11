import { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { Choice } from '../../../shared/ui/Choice';
import { Dialog } from '../../../shared/ui/Dialog';
import { Toast } from '../../../shared/ui/Toast';
import { ArrowRightIcon } from '../../../shared/ui/icons';
import type { ChoiceCheck, ComprehensionCheck } from './types';
import styles from './CheckDialog.module.css';

type CheckDialogProps = {
  check: ComprehensionCheck;
  /** 맞히고 '계속하기'를 눌렀을 때 */
  onPass: () => void;
};

/**
 * 단계 사이의 확인 질문. 순서를 기억해 내는 것 자체가 기억력 훈련이 된다.
 * 점수나 감점은 없고, 틀리면 정답과 이유를 보여준 뒤 다시 고르게 한다.
 * 질문 종류(check.type)가 늘어나면 여기서 나눠 보여준다.
 */
export function CheckDialog({ check, onPass }: CheckDialogProps) {
  switch (check.type) {
    case 'choice':
      return <ChoiceQuestion check={check} onPass={onPass} />;
  }
}

function ChoiceQuestion({ check, onPass }: { check: ChoiceCheck; onPass: () => void }) {
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = check.choices.find((choice) => choice.id === pickedId);
  const solved = picked?.correct === true;

  return (
    <Dialog
      title={check.question}
      description="알맞은 것을 눌러 골라 보세요."
      actions={
        solved && (
          <Button block icon={<ArrowRightIcon />} onClick={onPass}>
            계속하기
          </Button>
        )
      }
    >
      <div className={styles.choices}>
        {check.choices.map((choice) => (
          <Choice
            key={choice.id}
            symbol={choice.symbol}
            title={choice.label}
            detail={choice.detail}
            selected={solved && choice.id === pickedId}
            dimmed={pickedId !== null && choice.id === pickedId && !choice.correct}
            disabled={solved}
            onClick={() => setPickedId(choice.id)}
          />
        ))}
      </div>

      {picked && (
        <div className={styles.feedback} key={pickedId}>
          {solved ? (
            <Toast tone="success">
              <strong className={styles.praise}>맞아요!</strong> {check.praise}
            </Toast>
          ) : (
            <Toast tone="info">
              {check.explanation}
              <br />
              <strong>다시 골라 보세요.</strong>
            </Toast>
          )}
        </div>
      )}
    </Dialog>
  );
}
