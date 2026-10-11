import { useEffect, useState } from 'react';
import { emit } from '../../../shared/events';
import type { ComprehensionCheck, Lesson, LessonStep } from './types';
import { clearProgress, loadProgress, recordCompletion, saveProgress } from './progressStore';

/**
 * 레슨 하나의 진행 상태.
 * - doing    : steps[stepIndex] 를 하는 중 (하이라이트가 보임)
 * - checking : steps[stepIndex - 1] 을 마친 뒤 확인 질문을 푸는 중
 * - finished : 모든 단계를 마침 (완료 팝업)
 */
export type RunPhase = 'doing' | 'checking' | 'finished';

type RunState = {
  stepIndex: number;
  phase: RunPhase;
  /** 지금 단계에서 연속으로 틀린 횟수 */
  mistakes: number;
};

function restoreState(lesson: Lesson): RunState {
  const total = lesson.steps.length;
  const saved = loadProgress(lesson.id);
  if (saved) {
    const { stepIndex, phase } = saved;
    if (phase === 'doing' && stepIndex >= 0 && stepIndex < total) {
      return { stepIndex, phase, mistakes: 0 };
    }
    if (phase === 'checking' && stepIndex > 0 && stepIndex <= total && lesson.steps[stepIndex - 1].check) {
      return { stepIndex, phase, mistakes: 0 };
    }
  }
  return { stepIndex: 0, phase: 'doing', mistakes: 0 };
}

/* ---------- 글자 쓰기 단계 ---------- */

/** 띄어쓰기를 하나로 모으고 앞 빈칸을 지운다 */
function normalize(value: string) {
  return value.replace(/\s+/g, ' ').trimStart();
}

/** 입력 칸 글자가 이 단계의 목표 글자에 닿았는지 (다음 낱말을 이미 쓰기 시작했어도 인정) */
function reachedText(value: string, text: string) {
  const v = normalize(value);
  return v.trimEnd() === text || v.startsWith(`${text} `);
}

/** 목표와 다르게 썼는지 (쓰는 도중 글자가 조합되는 동안은 판단하지 않도록 목표보다 길어졌을 때만) */
function wroteDifferently(value: string, text: string) {
  const v = normalize(value).trimEnd();
  return v.length > text.length && !v.startsWith(text);
}

/** 이 단계에 들어올 때 입력 칸에 이미 있어야 할 글자 (앞선 글자 쓰기 단계의 결과) */
function textBefore(lesson: Lesson, stepIndex: number) {
  for (let i = Math.min(stepIndex, lesson.steps.length) - 1; i >= 0; i--) {
    const typing = lesson.steps[i].typing;
    if (typing) return typing.text;
  }
  return '';
}

export function useLessonRun(lesson: Lesson, onExit: () => void) {
  const [state, setState] = useState<RunState>(() => restoreState(lesson));
  const [typed, setTyped] = useState(() => textBefore(lesson, state.stepIndex));
  const { stepIndex, phase, mistakes } = state;
  const total = lesson.steps.length;
  const lastStep = lesson.steps[total - 1];

  const currentStep: LessonStep | undefined = phase === 'doing' ? lesson.steps[stepIndex] : undefined;
  const pendingCheck: ComprehensionCheck | undefined =
    phase === 'checking' ? lesson.steps[stepIndex - 1]?.check : undefined;

  /** 지금 보여줄 연습 화면: 하는 중인 단계의 화면, 질문 중이면 다음 단계 화면, 끝났으면 완료 화면 */
  const screenId =
    phase !== 'finished' && stepIndex < total
      ? lesson.steps[stepIndex].screenId
      : (lesson.finishScreenId ?? lastStep.screenId);

  // 중간에 나갔다 와도 이어서 할 수 있게 진행 단계를 저장한다.
  useEffect(() => {
    if (phase === 'finished') return;
    if (phase === 'doing' && stepIndex === 0) {
      clearProgress(lesson.id);
    } else {
      saveProgress(lesson.id, { stepIndex, phase });
    }
  }, [lesson.id, stepIndex, phase]);

  function finish() {
    const completedAt = new Date().toISOString();
    clearProgress(lesson.id);
    recordCompletion(lesson.id, completedAt);
    // 다른 기능(계획표, 포인트 등)과는 이 이벤트로만 연결한다.
    emit('learning.lessonCompleted', { lessonId: lesson.id, appId: lesson.appId, completedAt });
    setTyped('');
    setState({ stepIndex: total, phase: 'finished', mistakes: 0 });
  }

  /** 지금 단계를 마쳤을 때: 확인 질문 → 다음 단계 → 끝 */
  function completeStep(step: LessonStep) {
    const next = stepIndex + 1;
    if (step.check) {
      setState({ stepIndex: next, phase: 'checking', mistakes: 0 });
    } else if (next >= total) {
      finish();
    } else {
      setState({ stepIndex: next, phase: 'doing', mistakes: 0 });
    }
  }

  /** 연습 화면을 눌렀을 때. targetId 는 누른 곳의 data-target (없는 곳이면 null) */
  function tap(targetId: string | null) {
    if (!currentStep) return;
    if (targetId === currentStep.targetId) {
      // 글자 쓰기 단계에서 입력 칸을 누르는 것은 맞지도 틀리지도 않다 (키보드를 다시 여는 것)
      if (!currentStep.typing) completeStep(currentStep);
      return;
    }
    setState((s) => ({ ...s, mistakes: s.mistakes + 1 }));
  }

  /** 연습 입력 칸의 글자가 바뀌었을 때 */
  function type(value: string) {
    setTyped(value);
    if (currentStep?.typing && reachedText(value, currentStep.typing.text)) {
      completeStep(currentStep);
    }
  }

  /** 확인 질문을 맞히고 '계속하기'를 눌렀을 때 */
  function passCheck() {
    if (phase !== 'checking') return;
    if (stepIndex >= total) {
      finish();
    } else {
      setState({ stepIndex, phase: 'doing', mistakes: 0 });
    }
  }

  /** '이전' 버튼: 한 단계 전으로. 첫 단계에서는 레슨 목록으로 */
  function goBack() {
    if (phase === 'checking' || (phase === 'doing' && stepIndex > 0)) {
      setTyped(textBefore(lesson, stepIndex - 1));
      setState({ stepIndex: stepIndex - 1, phase: 'doing', mistakes: 0 });
    } else {
      onExit();
    }
  }

  function restart() {
    clearProgress(lesson.id);
    setTyped('');
    setState({ stepIndex: 0, phase: 'doing', mistakes: 0 });
  }

  /** 끝낸 단계 수 */
  const doneCount = phase === 'finished' ? total : stepIndex;
  /** 단계 표시 탭에 보일 번호 */
  const stepNumber = phase === 'doing' ? stepIndex + 1 : doneCount;
  /** 글자 쓰기 단계에서 목표와 다르게 썼는지 */
  const typedWrong = !!currentStep?.typing && wroteDifferently(typed, currentStep.typing.text);

  return {
    phase,
    total,
    stepNumber,
    doneCount,
    mistakes,
    currentStep,
    pendingCheck,
    screenId,
    typed,
    typedWrong,
    tap,
    type,
    passCheck,
    goBack,
    restart,
  };
}
