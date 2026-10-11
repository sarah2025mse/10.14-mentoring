import type { RouteObject } from 'react-router';

/**
 * 디딤의 기능 하나(학습, 계획표, 활동, 포인트 ...)를 앱에 붙이기 위한 정보.
 * 각 기능은 이것을 하나 내보내고, src/app/features.ts 에 한 줄 추가하면 앱에 붙는다.
 */
export type FeatureDefinition = {
  /** 'learning', 'planner' 처럼 영어 소문자. localStorage 접두어(didim.<id>.*)와 같게 쓴다. */
  id: string;
  /** 화면에 보일 이름 (예: '학습') */
  name: string;
  /** 이 기능이 쓰는 경로. CLAUDE.md 의 예약된 경로 중 하나 (예: '/learn') */
  path: string;
  /** path 아래의 하위 경로들 */
  routes: RouteObject[];
  /** 앱이 켜질 때 한 번 실행 (다른 기능의 이벤트 구독 등) */
  setup?: () => void;
};
