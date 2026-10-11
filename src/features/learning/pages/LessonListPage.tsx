import { useContext } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { ActionButton } from '../../../shared/ui/ActionButton';
import { Button } from '../../../shared/ui/Button';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { Stone } from '../../../shared/ui/Stone';
import { ArrowRightIcon, CheckIcon, RetryIcon, didimIcons } from '../../../shared/ui/icons';
import { KakaoLearnExitContext } from '../exitContext';
import { findPracticeApp } from '../apps/registry';
import { loadCompletion, loadProgress } from '../engine/progressStore';
import type { Lesson } from '../engine/types';
import styles from './LessonListPage.module.css';

const dateFormat = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' });

/** 한 앱의 레슨 목록 (예: /learn/kakaotalk) */
export function LessonListPage() {
  const { appId } = useParams();
  const app = findPracticeApp(appId);
  const onExit = useContext(KakaoLearnExitContext);
  if (!app) return <Navigate to="/learn" replace />;

  const lessons = [...app.lessons].sort((a, b) => a.order - b.order);

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <ActionButton kind="prev" onClick={onExit} />
      </div>
      <PageHeader title={app.listTitle} description="하나씩 차근차근 따라 해 보세요." />
      <ol className={styles.list}>
        {lessons.map((lesson, index) => (
          <LessonCard key={lesson.id} lesson={lesson} shape={(index % 3) as 0 | 1 | 2} />
        ))}
      </ol>
    </main>
  );
}

function LessonCard({ lesson, shape }: { lesson: Lesson; shape: 0 | 1 | 2 }) {
  const navigate = useNavigate();
  const Icon = didimIcons[lesson.icon ?? 'book'];

  if (lesson.status === 'coming-soon') {
    return (
      <li className={`${styles.card} ${styles.soon}`} aria-disabled="true">
        <div className={styles.row}>
          <Stone tone="gray" shape={shape} width={76} icon={<Icon size={24} />} />
          <div className={styles.texts}>
            <p className={styles.caption}>레슨 {lesson.order} · 준비 중</p>
            <h2 className={styles.title}>{lesson.title}</h2>
          </div>
        </div>
      </li>
    );
  }

  const completion = loadCompletion(lesson.id);
  const progress = loadProgress(lesson.id);
  const start = () => navigate(`/learn/${lesson.appId}/${lesson.id}`);

  let caption = `레슨 ${lesson.order} · 처음 해 봐요`;
  let action = (
    <Button block icon={<ArrowRightIcon />} onClick={start}>
      시작하기
    </Button>
  );
  if (progress) {
    caption = `레슨 ${lesson.order} · ${lesson.steps.length}단계 중 ${progress.stepIndex}단계까지 했어요`;
    action = (
      <Button block icon={<ArrowRightIcon />} onClick={start}>
        이어서 하기
      </Button>
    );
  } else if (completion) {
    caption = `레슨 ${lesson.order} · ${dateFormat.format(new Date(completion.lastCompletedAt))} 완료`;
    action = (
      <Button block variant="soft" icon={<RetryIcon />} onClick={start}>
        복습하러 가기
      </Button>
    );
  }

  return (
    <li className={`${styles.card} ${completion && !progress ? styles.done : ''}`}>
      <div className={styles.row}>
        <Stone tone="green" shape={shape} width={76} icon={<Icon size={24} />} />
        <div className={styles.texts}>
          <p className={styles.caption}>
            {completion && !progress && <CheckIcon size={16} />}
            {caption}
          </p>
          <h2 className={styles.title}>{lesson.title}</h2>
          <p className={styles.description}>{lesson.description}</p>
        </div>
      </div>
      <div className={styles.action}>{action}</div>
    </li>
  );
}
