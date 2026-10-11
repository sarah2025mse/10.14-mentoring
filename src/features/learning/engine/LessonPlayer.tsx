import { useEffect, useMemo, useState } from 'react';
import type { Lesson, PracticeApp } from './types';
import { useLessonRun } from './useLessonRun';
import { StepHeader } from './StepHeader';
import { PracticeStage } from './PracticeStage';
import { Spotlight } from './Spotlight';
import { HelpDialog } from './HelpDialog';
import { CheckDialog } from './CheckDialog';
import { CompletePopup } from './CompletePopup';
import { PracticeInputContext } from './PracticeInput';

/** 글자 쓰기 단계에서 목표와 다르게 썼을 때 (어떤 앱이든 같은 말) */
const TYPED_WRONG_MESSAGE = '글자가 조금 달라요. 지우기(⌫)로 지우고 다시 써 보세요';
import styles from './LessonPlayer.module.css';

type LessonPlayerProps = {
  app: PracticeApp;
  lesson: Lesson;
  /** 레슨 목록으로 나가기 */
  onExit: () => void;
};

/** 레슨 하나를 처음부터 끝까지 진행한다. 어떤 앱의 레슨이든 똑같이 동작한다. */
export function LessonPlayer({ app, lesson, onExit }: LessonPlayerProps) {
  const run = useLessonRun(lesson, onExit);
  // 화면 상자가 실제로 생긴 뒤에 하이라이트가 위치를 잴 수 있도록 상태로 받는다.
  const [stageEl, setStageEl] = useState<HTMLDivElement | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const { typed, type } = run;
  const practiceInput = useMemo(() => ({ value: typed, setValue: type }), [typed, type]);

  // 개발 중에만: 레슨 데이터가 없는 화면을 가리키면 알려준다.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    for (const step of lesson.steps) {
      if (!app.screens[step.screenId]) {
        console.warn(`[학습 엔진] '${lesson.id}' 레슨의 화면 '${step.screenId}'이(가) 등록되지 않았어요.`);
      }
    }
  }, [app, lesson]);

  const instruction =
    run.phase === 'doing' && run.currentStep
      ? run.currentStep.instruction
      : run.phase === 'checking'
        ? '질문에 답해 보세요'
        : `잘했어요! ${lesson.completeMessage}`;

  return (
    <div className={styles.player}>
      <StepHeader
        title={app.listTitle}
        lessonTitle={lesson.title}
        stepNumber={run.stepNumber}
        total={run.total}
        filled={run.stepNumber}
        instruction={instruction}
        onBack={() => {
          setHelpOpen(false);
          run.goBack();
        }}
        onHelp={() => {
          if (run.phase !== 'finished') setHelpOpen(true);
        }}
      />
      <PracticeInputContext.Provider value={practiceInput}>
      <PracticeStage ref={setStageEl} Screen={app.screens[run.screenId]} screenId={run.screenId} onTap={run.tap}>
        {run.currentStep && stageEl && (
          <Spotlight
            key={run.currentStep.id}
            stageEl={stageEl}
            screenId={run.screenId}
            targetId={run.currentStep.targetId}
            bubble={run.currentStep.bubble}
            hintAfterMistakes={run.currentStep.hintAfterMistakes}
            mistakes={run.mistakes}
            override={run.typedWrong ? TYPED_WRONG_MESSAGE : undefined}
          />
        )}
        {/* 확인 질문은 연습 화면 위에만 띄워서, 질문 중에도 '이전'과 '도움말'을 누를 수 있게 한다 */}
        {run.phase === 'checking' && run.pendingCheck && (
          <CheckDialog key={run.stepNumber} check={run.pendingCheck} onPass={run.passCheck} />
        )}
        {run.phase === 'finished' && (
          <CompletePopup message={lesson.completeMessage} onRetry={run.restart} onExit={onExit} />
        )}
      </PracticeStage>
      </PracticeInputContext.Provider>

      {helpOpen && (
        <HelpDialog
          lessonTitle={lesson.title}
          stepNumber={run.stepNumber}
          total={run.total}
          instruction={instruction}
          hint={
            run.currentStep
              ? (run.currentStep.hintAfterMistakes ?? run.currentStep.bubble)
              : '방금 한 단계를 떠올려 보고, 알맞은 답을 눌러 골라 보세요.'
          }
          onClose={() => setHelpOpen(false)}
        />
      )}
    </div>
  );
}
