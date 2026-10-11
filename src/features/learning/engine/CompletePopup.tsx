import { useEffect, useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { Dialog } from '../../../shared/ui/Dialog';
import { Stone } from '../../../shared/ui/Stone';
import { ArrowRightIcon, CheckIcon, RetryIcon } from '../../../shared/ui/icons';
import styles from './CompletePopup.module.css';

type CompletePopupProps = {
  /** 예: '사진 보내기를 해냈어요' */
  message: string;
  onRetry: () => void;
  onExit: () => void;
};

/** 레슨을 끝냈을 때. 결과 화면을 잠깐 보여준 뒤 팝업을 띄운다. 저절로 다음으로 넘어가지 않는다. */
export function CompletePopup({ message, onRetry, onExit }: CompletePopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Dialog
      art={
        <div className={styles.art}>
          <Stone tone="green" shape={1} width={110} icon={<CheckIcon size={34} />} />
        </div>
      }
      title={<span className={styles.title}>잘했어요!</span>}
      description={<span className={styles.message}>{message}</span>}
      stackActions
      actions={
        <>
          <Button variant="soft" icon={<RetryIcon />} onClick={onRetry}>
            다시 해보기
          </Button>
          <Button icon={<ArrowRightIcon />} onClick={onExit}>
            학습 처음으로
          </Button>
        </>
      }
    />
  );
}
