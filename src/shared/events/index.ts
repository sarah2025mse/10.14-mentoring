import type { DidimEventMap } from './types';

export type { DidimEventMap, LessonCompletedEvent } from './types';

type EventName = keyof DidimEventMap;
type Handler<K extends EventName> = (payload: DidimEventMap[K]) => void;

const bus = new EventTarget();

/** 이벤트 내보내기. 누가 듣는지는 모른다. */
export function emit<K extends EventName>(name: K, payload: DidimEventMap[K]): void {
  if (import.meta.env.DEV) {
    console.info(`[디딤 이벤트] ${name}`, payload);
  }
  bus.dispatchEvent(new CustomEvent(name, { detail: payload }));
}

/** 이벤트 듣기. 돌려받은 함수를 부르면 그만 듣는다. */
export function on<K extends EventName>(name: K, handler: Handler<K>): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<DidimEventMap[K]>).detail);
  bus.addEventListener(name, listener);
  return () => bus.removeEventListener(name, listener);
}
