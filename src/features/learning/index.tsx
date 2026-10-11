import { Navigate } from 'react-router';
import type { FeatureDefinition } from '../../shared/feature';
import { practiceApps } from './apps/registry';
import { LessonListPage } from './pages/LessonListPage';
import { LessonPage } from './pages/LessonPage';

/**
 * 디지털 기기 학습 기능 (/learn)
 * - /learn                    : 나중에 '학습 탭'(오늘의 학습, 분야 고르기). 지금은 첫 연습 앱 목록으로 보낸다.
 * - /learn/:appId             : 한 앱의 레슨 목록
 * - /learn/:appId/:lessonId   : 레슨 진행
 */
export const learningFeature: FeatureDefinition = {
  id: 'learning',
  name: '학습',
  path: '/learn',
  routes: [
    { index: true, element: <Navigate to={`/learn/${practiceApps[0].id}`} replace /> },
    { path: ':appId', Component: LessonListPage },
    { path: ':appId/:lessonId', Component: LessonPage },
  ],
};
