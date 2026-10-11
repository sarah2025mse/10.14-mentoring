/**
 * localStorage 도우미. 키 앞에 자동으로 `didim.<기능>.` 접두어를 붙인다.
 * 예: createStorage('learning').write('progress', ...) → 키 `didim.learning.progress`
 * 개인 정보 보호 모드 등으로 저장소를 못 쓰는 경우에도 앱이 멈추지 않게 오류를 삼킨다.
 */
export function createStorage(featureId: string) {
  if (!/^[a-z][a-z0-9-]*$/.test(featureId)) {
    throw new Error(`저장소 이름은 영어 소문자로 써야 해요: ${featureId}`);
  }
  const prefix = `didim.${featureId}.`;

  return {
    read<T>(key: string, fallback: T): T {
      try {
        const raw = localStorage.getItem(prefix + key);
        return raw === null ? fallback : (JSON.parse(raw) as T);
      } catch {
        return fallback;
      }
    },
    write<T>(key: string, value: T): void {
      try {
        localStorage.setItem(prefix + key, JSON.stringify(value));
      } catch {
        // 저장 실패는 학습을 막지 않는다.
      }
    },
    remove(key: string): void {
      try {
        localStorage.removeItem(prefix + key);
      } catch {
        // 무시
      }
    },
  };
}
