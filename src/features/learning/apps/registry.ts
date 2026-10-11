import type { PracticeApp } from '../engine/types';
import { kakaotalkApp } from './kakaotalk';

/** 연습 앱 목록. 네이버 지도, 키오스크 등은 apps/<앱>/ 폴더를 만들고 여기에 추가한다. */
export const practiceApps: PracticeApp[] = [kakaotalkApp];

export function findPracticeApp(appId: string | undefined): PracticeApp | undefined {
  return practiceApps.find((app) => app.id === appId);
}
