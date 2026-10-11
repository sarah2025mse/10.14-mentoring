# 디딤 웹앱

**디딤**은 70세 이상 경도인지장애(MCI) 어르신이 인지 훈련(디지털 기기 학습), 신체 운동(산책), 규칙적 생활(계획표)을 한 앱에서 함께 관리하도록 돕는 서비스입니다.

지금 들어 있는 기능은 **카카오톡 학습** 하나입니다. 연습용 카카오톡 화면에서 눌러야 할 곳을 빛나게 알려 주고, 중간에 확인 질문을 내며, 끝까지 하면 완료 기록을 남깁니다.

- 요구사항 원본: [디딤_카카오톡학습_프롬프트.md](디딤_카카오톡학습_프롬프트.md)
- 디자인 시안: [앱 이미지/](앱%20이미지/) (공통 부품은 `앱 이미지/DIDIM/`)
- 개발 규칙: [CLAUDE.md](CLAUDE.md)

---

## 1. 실행 방법

### 처음 한 번
1. [Node.js](https://nodejs.org) LTS 버전을 설치합니다.
2. 이 폴더에서 터미널을 열고 필요한 부품을 내려받습니다.
   ```
   npm install
   ```

### 매번
```
npm run dev
```
터미널에 나오는 주소(보통 http://localhost:5173)를 브라우저에서 엽니다.
데스크톱에서는 가운데 휴대폰 크기(390×844) 틀 안에 보이고, 휴대폰으로 열면 화면 전체를 씁니다.

### 그 밖의 명령
| 명령 | 하는 일 |
|---|---|
| `npm run dev:phone` | 같은 와이파이의 휴대폰에서도 열 수 있게 실행합니다 (아래 "휴대폰으로 시험하기") |
| `npm run build` | 타입 검사 후 배포용 파일을 `dist/`에 만듭니다 |
| `npm run preview` | 만든 배포용 파일을 미리 봅니다 |

### 휴대폰으로 시험하기
'문자 보내기' 레슨은 휴대폰의 진짜 키보드로 글자를 씁니다. 컴퓨터에서는 키보드의 한/영 키로 한글을 켜고 쓰면 됩니다.
휴대폰에서 시험하려면:
1. 컴퓨터와 휴대폰을 같은 와이파이에 연결합니다.
2. `npm run dev:phone` 을 실행합니다. 터미널에 `Network: http://192.168.x.x:5173` 같은 주소가 나옵니다.
3. 휴대폰 브라우저에서 그 주소를 엽니다. (Windows가 방화벽 허용을 물으면 '개인 네트워크'만 허용합니다.)

### 진행 기록 지우기
학습 기록은 브라우저에만 저장됩니다(서버 없음). 처음 상태로 돌리려면 브라우저 개발자 도구(F12) → Console에서 다음을 실행하고 새로고침합니다.
```js
localStorage.removeItem('didim.learning.progress'); localStorage.removeItem('didim.learning.completions');
```

---

## 2. 폴더 구조

```
src/
  app/                      라우터, 휴대폰 틀, 기능 목록(features.ts)
  shared/                   여러 기능이 같이 쓰는 것
    theme/                  디딤 색상과 크기 (tokens.css)
    ui/                     디딤 부품: Button, ActionButton(이전·도움말), ProgressSegments,
                            Dialog, Choice, Toast, Stone(디딤돌), PageHeader, 아이콘
    assets/                 디딤돌 그림
    events/                 기능끼리 소식을 전하는 통로
    storage/                localStorage 도우미 (didim.<기능>.* 접두어)
  features/
    learning/               디지털 기기 학습 (/learn)
      pages/                레슨 목록, 레슨 진행 화면
      engine/               레슨 엔진 (어떤 앱인지 모름)
        types.ts            레슨 데이터 모양
        useLessonRun.ts     단계 진행, 저장, 완료 처리
        StepHeader.tsx      맨 위 단계 표시 탭
        PracticeStage.tsx   연습 화면 자리 (누름을 가로채 엔진에 전달)
        Spotlight.tsx       하이라이트와 말풍선
        CheckDialog.tsx     확인 질문
        CompletePopup.tsx   완료 팝업
        HelpDialog.tsx      도움말 팝업
      apps/
        registry.ts         연습 앱 목록
        kakaotalk/
          index.ts          카카오톡 묶음 (화면 + 레슨)
          screens/          연습용 카카오톡 화면
          parts/            화면 조각 (아이콘, 하단 탭, 프로필, 가짜 사진 ...)
          data/             가짜 대화, 가짜 친구
          lessons/          sendPhoto.ts, sendText.ts
          reference/        실제 카카오톡 캡처 (Git에 올리지 않음)
```

### 주소
| 주소 | 화면 |
|---|---|
| `/` | `/learn/kakaotalk`으로 이동 |
| `/learn/kakaotalk` | 카카오톡 레슨 목록 |
| `/learn/kakaotalk/kakaotalk-send-photo` | 사진 보내기 레슨 |
| `/learn/kakaotalk/kakaotalk-send-text` | 문자 보내기 레슨 |

---

## 3. 레슨이 움직이는 방식

1. 레슨 데이터(`lessons/*.ts`)에는 단계마다 **보여줄 화면 ID**(`screenId`), **눌러야 할 곳 이름**(`targetId`), **안내 문구**가 있습니다.
2. 연습 화면은 그림만 그립니다. 누를 수 있는 곳에 `data-target="이름"` 이름표만 붙입니다.
3. 엔진은 화면에서 그 이름표를 찾아 하이라이트를 그리고, 누른 곳의 이름표가 맞는지 비교합니다.
   - 맞으면 다음 단계로 넘어갑니다.
   - 틀리면 "여기가 아니에요. 빛나는 곳을 눌러 보세요"를 보여 줍니다. 두 번 틀리면 하이라이트가 커지고 `hintAfterMistakes` 문구가 나옵니다.
4. **글자 쓰기 단계**(`typing: { text }`)는 누르기 대신, 연습 화면의 입력 칸에 그 글자가 써지면 다음으로 넘어갑니다. 입력 칸은 `engine/PracticeInput`의 `usePracticeInput()`으로 엔진과 값을 주고받고, 글자는 휴대폰의 진짜 키보드로 씁니다. 목표보다 길게 다르게 쓰면 "글자가 조금 달라요…" 안내가 나옵니다.
5. 단계에 `check`가 있으면 그 단계를 마친 뒤 확인 질문을 띄웁니다.
6. 마지막 단계가 끝나면 완료 기록을 저장하고 `learning.lessonCompleted` 이벤트를 내보낸 뒤 완료 팝업을 띄웁니다.

그래서 화면 배치를 바꿔도 이름표만 그대로면 레슨 데이터는 고칠 필요가 없습니다.

---

## 4. 새 레슨을 추가하는 방법 (예: 카카오톡 '이모티콘 보내기')

### ① 필요한 화면 만들기
이미 있는 화면(친구 탭, 채팅 목록, 채팅방, 입력 중 …)은 그대로 다시 씁니다. 새 화면이 필요하면 `apps/kakaotalk/screens/`에 만듭니다.

```tsx
// screens/EmojiScreen.tsx
export function EmojiScreen() {
  return (
    <ChatRoomView messages={daughterMessages()} overlay={/* 이모티콘 판 그림 */} />
    // 누를 수 있는 곳에는 data-target="emoji-1" 처럼 이름표를 붙입니다. onClick은 쓰지 않습니다.
  );
}
```
그다음 `screens/index.ts`에 화면 ID와 함께 등록합니다.
```ts
'emoji-panel': EmojiScreen,
```

### ② 레슨 데이터 만들기
`lessons/sendEmoji.ts`를 만듭니다. 다른 레슨과 같은 앞부분은 `commonSteps.ts`에서 가져와 씁니다. `sendPhoto.ts`(누르기만 하는 레슨)와 `sendText.ts`(글자 쓰기 단계가 있는 레슨)를 본보기로 삼으세요.
```ts
steps: [
  openChatTab,                 // 1. 채팅 탭
  openDaughterRoom,            // 2. 딸 대화방
  {
    id: 'open-emoji',
    screenId: 'chat-room',
    targetId: 'composer-emoji',
    instruction: '입력창 오른쪽의 웃는 얼굴 버튼을 눌러 보세요',
    bubble: '여기를 눌러 보세요',
    hintAfterMistakes: '입력창 안, 오른쪽에서 두 번째 동그라미예요',
  },
  // ...
],
```
- 확인 질문을 넣고 싶은 단계에는 `check`를 붙입니다(선택지 2~3개, 정답 하나).
- 글자를 써야 하는 단계는 `typing: { text: '쓸 글자' }`를 붙이고 입력 칸 화면(`chat-room-typing`)을 씁니다.

### ③ 공개하기
`apps/kakaotalk/index.ts`의 `lessons` 배열에 추가합니다. 만드는 중에는 `status: 'coming-soon'`으로 두면 목록에 '준비 중'으로 보이고, `'ready'`로 바꾸면 바로 시작할 수 있습니다.

> 개발 중에 화면 ID가 등록되지 않았거나 이름표를 찾지 못하면 브라우저 콘솔에 `[학습 엔진]` 경고가 나옵니다.

### 새 연습 앱 추가 (네이버 지도, 키오스크 등)
1. `apps/navermap/`을 `apps/kakaotalk/`과 같은 모양으로 만듭니다 (`screens/`, `lessons/`, `index.ts`).
2. `index.ts`에서 `PracticeApp`을 내보냅니다.
3. `apps/registry.ts`의 `practiceApps` 배열에 추가합니다. 주소는 자동으로 `/learn/navermap`이 됩니다.

엔진(`engine/`)은 고칠 필요가 없습니다. 엔진에 앱 이름이나 앱 전용 화면을 넣지 마세요.

---

## 5. 다른 디딤 기능을 나중에 붙이는 방법

가입, 계정 연결, 계획표, 활동, 포인트, 설정은 아직 만들지 않았습니다. 붙일 때는 아래 순서를 따릅니다.

### ① 기능 폴더와 등록
```
src/features/points/
  index.tsx        ← FeatureDefinition 내보내기
  pages/ ...
```
```tsx
// src/features/points/index.tsx
export const pointsFeature: FeatureDefinition = {
  id: 'points',
  name: '포인트',
  path: '/points',                       // 예약된 경로만 사용
  routes: [{ index: true, Component: PointsPage }],
  setup: () => { /* 이벤트 구독 (아래 ③) */ },
};
```
`src/app/features.ts`의 `features` 배열에서 해당 줄의 주석을 풀거나 한 줄 추가합니다. 다른 파일은 고치지 않습니다.

### ② 예약된 경로와 저장 키
| 기능 | 경로 | 저장 키 |
|---|---|---|
| 가입과 로그인 | `/onboarding` | `didim.onboarding.*` |
| 계정 연결 | `/connect` | `didim.connect.*` |
| 계획표 | `/planner` | `didim.planner.*` |
| 활동 | `/activity` | `didim.activity.*` |
| 포인트 | `/points` | `didim.points.*` |
| 설정 | `/settings` | `didim.settings.*` |

저장은 `createStorage('<기능 id>')`로만 합니다. 다른 기능의 키는 읽지 않습니다.

### ③ 학습과 연결하기 (이벤트로만)
학습은 레슨을 끝내면 `learning.lessonCompleted` 이벤트를 내보내기만 합니다. 계획표나 포인트는 이 이벤트를 **구독**해서 각자 처리합니다. 학습 코드를 직접 부르지 않습니다.
```ts
// pointsFeature.setup 안에서
import { on } from '../../shared/events';

on('learning.lessonCompleted', ({ lessonId, completedAt }) => {
  // 예: 학습 미션 완료 +50 포인트 적립, "잘했어요! 디딤 포인트 +50" 팝업
});
```
새 이벤트가 필요하면 `src/shared/events/types.ts`의 `DidimEventMap`에 한 줄 추가합니다.

### ④ 화면 공통 요소
- 하단 탭(계획표, 학습, 활동, 포인트)은 `앱 이미지/DIDIM/Global Navigation Bar.png`를 보고 `shared/ui`에 만든 뒤 `app/PhoneFrame.tsx`에 붙입니다. 그러면 학습의 `/learn` 첫 화면(학습 탭)도 `앱 이미지/DIDIM (2)/학습.png`대로 만들 수 있습니다.
- 처음 열 화면은 `app/features.ts`의 `homePath`를 바꿉니다(예: `/planner`).
