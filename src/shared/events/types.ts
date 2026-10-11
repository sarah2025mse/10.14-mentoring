/**
 * 디딤 기능끼리 주고받는 이벤트의 이름과 내용.
 * 기능끼리는 서로의 코드를 직접 부르지 않고, 여기 적힌 이벤트로만 소식을 전한다.
 * 새 이벤트는 이 표에 한 줄 추가한다. 이름 형식: '<보내는 기능>.<일어난 일>'
 */

export type LessonCompletedEvent = {
  lessonId: string;
  appId: string;
  /** ISO 날짜 문자열 */
  completedAt: string;
};

export type DidimEventMap = {
  /** 학습 레슨 하나를 끝까지 마쳤을 때 (나중에 계획표 완료 처리, 포인트 적립이 구독) */
  'learning.lessonCompleted': LessonCompletedEvent;
};
