import { createContext } from 'react';

/** 카카오톡 학습을 닫고 디딤 학습 탭으로 돌아갈 때 쓴다. */
export const KakaoLearnExitContext = createContext<() => void>(() => {});
