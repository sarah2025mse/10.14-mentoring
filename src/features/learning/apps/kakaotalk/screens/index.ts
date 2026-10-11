import type { ComponentType } from 'react';
import { FriendsScreen } from './FriendsScreen';
import { ChatListScreen } from './ChatListScreen';
import { ChatRoomScreen, ChatRoomTypingScreen, PhotoSentScreen, TextSentScreen } from './ChatRoomScreens';
import { AttachSheetScreen } from './AttachSheetScreen';
import { GalleryScreen, GallerySelectedScreen } from './GalleryScreens';

/**
 * 화면 ID → 연습용 카카오톡 화면. 레슨 데이터의 screenId 가 이 키를 가리킨다.
 * 화면은 그림만 그리고, 누를 수 있는 곳에 data-target 이름표만 붙인다.
 */
export const kakaotalkScreens: Record<string, ComponentType> = {
  friends: FriendsScreen,
  'chat-list': ChatListScreen,
  'chat-room': ChatRoomScreen,
  'attach-sheet': AttachSheetScreen,
  gallery: GalleryScreen,
  'gallery-selected': GallerySelectedScreen,
  'chat-room-photo-sent': PhotoSentScreen,
  'chat-room-typing': ChatRoomTypingScreen,
  'chat-room-text-sent': TextSentScreen,
};
