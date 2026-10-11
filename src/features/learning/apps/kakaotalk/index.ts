import type { PracticeApp } from '../../engine/types';
import { kakaotalkScreens } from './screens';
import { sendPhoto } from './lessons/sendPhoto';
import { sendText } from './lessons/sendText';

/** 카카오톡 연습 앱: 연습 화면 + 레슨. 새 레슨은 lessons/ 에 만들고 아래 배열에 추가한다. */
export const kakaotalkApp: PracticeApp = {
  id: 'kakaotalk',
  name: '카카오톡',
  listTitle: '카카오톡 배우기',
  screens: kakaotalkScreens,
  lessons: [sendPhoto, sendText],
};
