import type { ComponentType } from 'react';
import type { DidimIconName } from '../../../shared/ui/icons';

/**
 * 레슨 엔진이 아는 것은 이 파일의 모양뿐이다.
 * 엔진은 화면 ID, 눌러야 할 대상 ID(data-target), 안내 문구, 확인 질문만 보고 움직인다.
 * 어떤 앱(카카오톡, 네이버 지도, 키오스크 ...)인지는 모른다.
 */

export type Lesson = {
  /** 예: 'kakaotalk-send-photo' */
  id: string;
  /** 예: 'kakaotalk' (나중에 'navermap', 'kiosk' 등) */
  appId: string;
  /** 예: '사진 보내기' */
  title: string;
  /** 레슨 목록에 보일 한 줄 설명 */
  description: string;
  /** 쉬운 것부터의 순서 (1부터) */
  order: number;
  /** 레슨 목록의 디딤돌 위 아이콘 */
  icon?: DidimIconName;
  status: 'ready' | 'coming-soon';
  steps: LessonStep[];
  /** 마지막 단계를 마친 뒤 완료 팝업 뒤에 보여줄 화면. 없으면 마지막 단계 화면 */
  finishScreenId?: string;
  /** 완료 팝업 문구. 예: '사진 보내기를 해냈어요' */
  completeMessage: string;
};

export type LessonStep = {
  id: string;
  /** 어떤 연습 화면을 보여줄지 (PracticeApp.screens 의 키) */
  screenId: string;
  /** 눌러야 할 곳의 data-target 값 */
  targetId: string;
  /** 단계 표시 탭에 나오는 안내 한 줄 */
  instruction: string;
  /** 하이라이트 옆 말풍선 */
  bubble: string;
  /** 2번 연속 틀렸을 때 말풍선 문구 (더 구체적으로) */
  hintAfterMistakes?: string;
  /**
   * 글자 쓰기 단계: 누르기 대신, 연습 입력 칸(usePracticeInput)에 이 글자가 써지면 다음으로 넘어간다.
   * text 는 지금까지 입력 칸에 있어야 할 글자 전체 (예: '응' → 다음 단계 '응 고마워').
   * targetId 는 입력 칸의 이름표로 둔다(하이라이트 위치).
   */
  typing?: { text: string };
  /** 이 단계를 마친 뒤 띄울 확인 질문 */
  check?: ComprehensionCheck;
};

/**
 * 확인 질문. type 으로 종류를 나눠서 나중에 늘릴 수 있게 한다.
 * (예: 'tap' — 다음에 누를 곳을 화면에서 직접 눌러 보기, 'review' — 며칠 뒤 안내 없이 다시 해 보기)
 */
export type ComprehensionCheck = ChoiceCheck;

export type ChoiceCheck = {
  type: 'choice';
  /** 큰 글씨 질문 하나 */
  question: string;
  /** 선택지 2개 (최대 3개), 정답은 하나 */
  choices: CheckChoice[];
  /** 맞혔을 때 덧붙이는 한 줄 (없으면 '맞아요!'만) */
  praise?: string;
  /** 틀렸을 때 보여줄 짧은 이유 */
  explanation: string;
};

export type CheckChoice = {
  id: string;
  /** 큰 글씨 선택지 (예: '더하기 버튼') */
  label: string;
  /** 왼쪽 네모 안에 넣을 짧은 글자 (예: '+') */
  symbol?: string;
  /** 선택지 아래 작은 설명 (예: '입력창 왼쪽') */
  detail?: string;
  correct: boolean;
};

/** 연습 앱 하나의 묶음. 엔진은 이 안에 무엇이 들었는지 모르고 screenId 로만 화면을 꺼내 쓴다. */
export type PracticeApp = {
  /** 예: 'kakaotalk' — 주소 /learn/<id> 에 쓰인다 */
  id: string;
  /** 예: '카카오톡' */
  name: string;
  /** 레슨 목록 제목. 예: '카카오톡 배우기' */
  listTitle: string;
  /** 화면 ID → 연습 화면. 화면은 그림만 그리고, 누를 수 있는 곳에 data-target 만 붙인다. */
  screens: Record<string, ComponentType>;
  lessons: Lesson[];
};

/** 레슨이 끝났을 때 다른 기능에 알리는 내용 (shared/events 의 learning.lessonCompleted) */
export type { LessonCompletedEvent } from '../../../shared/events/types';
