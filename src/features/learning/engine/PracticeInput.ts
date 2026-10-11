import { createContext, useContext } from 'react';

/**
 * 연습 화면 속 글자 입력 칸 하나의 값.
 * 엔진이 값을 들고 있고, 연습 화면은 이 값을 입력 칸에 보여주고 바뀐 값을 알려주기만 한다.
 * (어르신의 휴대폰 키보드로 직접 쓰는 단계에 쓴다)
 */
export type PracticeInput = {
  value: string;
  setValue: (value: string) => void;
};

export const PracticeInputContext = createContext<PracticeInput>({ value: '', setValue: () => {} });

export function usePracticeInput(): PracticeInput {
  return useContext(PracticeInputContext);
}
