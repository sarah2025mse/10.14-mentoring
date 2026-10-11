import type { FeatureDefinition } from '../shared/feature';
import { learningFeature } from '../features/learning';

/**
 * 디딤 기능 목록. 새 기능은 src/features/<기능>/index.ts(x) 에서 FeatureDefinition 을 내보내고
 * 아래 배열에 한 줄 추가하면 앱에 붙는다.
 */
export const features: FeatureDefinition[] = [
  learningFeature,
  // onboardingFeature,  // /onboarding  가입과 로그인
  // connectFeature,     // /connect     보호자와 어르신 계정 연결
  // plannerFeature,     // /planner     오늘의 계획표
  // activityFeature,    // /activity    활동 (산책, 사진, 가족 답장)
  // pointsFeature,      // /points      포인트
  // settingsFeature,    // /settings    설정
];

/** 기능마다 정해 둔 경로. 다른 경로는 쓰지 않는다. (CLAUDE.md '예약된 경로') */
export const reservedPaths = ['/learn', '/onboarding', '/connect', '/planner', '/activity', '/points', '/settings'];

/** 앱을 처음 열었을 때 갈 곳. 계획표가 생기면 '/planner' 로 바꾼다. */
export const homePath = '/learn';

/** 앱이 켜질 때 한 번: 각 기능의 준비 작업(이벤트 구독 등)을 실행한다. */
export function setupFeatures() {
  for (const feature of features) {
    if (import.meta.env.DEV && !reservedPaths.includes(feature.path)) {
      console.warn(`[디딤] '${feature.name}' 기능의 경로 ${feature.path} 는 예약된 경로가 아니에요.`);
    }
    feature.setup?.();
  }
}
