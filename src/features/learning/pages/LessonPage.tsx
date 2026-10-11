import { Navigate, useNavigate, useParams } from 'react-router';
import { findPracticeApp } from '../apps/registry';
import { LessonPlayer } from '../engine/LessonPlayer';

/** 레슨 진행 화면 (예: /learn/kakaotalk/kakaotalk-send-photo) */
export function LessonPage() {
  const { appId, lessonId } = useParams();
  const navigate = useNavigate();
  const app = findPracticeApp(appId);
  const lesson = app?.lessons.find((item) => item.id === lessonId);

  if (!app) return <Navigate to="/learn" replace />;
  if (!lesson || lesson.status !== 'ready') return <Navigate to={`/learn/${app.id}`} replace />;

  return <LessonPlayer key={lesson.id} app={app} lesson={lesson} onExit={() => navigate(`/learn/${app.id}`)} />;
}
