import { createStorage } from '../../../shared/storage';

/**
 * 학습 진행·완료 기록 (localStorage)
 * - didim.learning.progress    : 레슨별 진행 중인 단계
 * - didim.learning.completions : 레슨별 완료 날짜와 횟수
 */
const storage = createStorage('learning');

export type SavedProgress = {
  stepIndex: number;
  phase: 'doing' | 'checking';
  updatedAt: string;
};

export type CompletionRecord = {
  firstCompletedAt: string;
  lastCompletedAt: string;
  count: number;
};

type ProgressMap = Record<string, SavedProgress>;
type CompletionMap = Record<string, CompletionRecord>;

export function loadProgress(lessonId: string): SavedProgress | undefined {
  return storage.read<ProgressMap>('progress', {})[lessonId];
}

export function saveProgress(lessonId: string, progress: Omit<SavedProgress, 'updatedAt'>): void {
  const all = storage.read<ProgressMap>('progress', {});
  all[lessonId] = { ...progress, updatedAt: new Date().toISOString() };
  storage.write('progress', all);
}

export function clearProgress(lessonId: string): void {
  const all = storage.read<ProgressMap>('progress', {});
  if (!(lessonId in all)) return;
  delete all[lessonId];
  storage.write('progress', all);
}

export function loadCompletion(lessonId: string): CompletionRecord | undefined {
  return storage.read<CompletionMap>('completions', {})[lessonId];
}

export function recordCompletion(lessonId: string, completedAt: string): CompletionRecord {
  const all = storage.read<CompletionMap>('completions', {});
  const before = all[lessonId];
  const record: CompletionRecord = {
    firstCompletedAt: before?.firstCompletedAt ?? completedAt,
    lastCompletedAt: completedAt,
    count: (before?.count ?? 0) + 1,
  };
  all[lessonId] = record;
  storage.write('completions', all);
  return record;
}
