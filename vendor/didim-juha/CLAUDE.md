# 디딤 웹앱 개발 규칙

**디딤**은 70세 이상 경도인지장애(MCI) 어르신이 인지 훈련(디지털 기기 학습), 신체 운동(산책), 규칙적 생활(계획표)을 한 앱에서 함께 관리하도록 돕는 서비스다.

- 기술: Vite + React + TypeScript, React Router(`react-router`, `RouterProvider`는 `react-router/dom`), CSS Modules, localStorage. 서버 없음.
- 원본 요구사항: `디딤_카카오톡학습_프롬프트.md` / 사용 방법과 확장 방법: `README.md`
- 디자인 시안: `앱 이미지/` (공통 부품 `앱 이미지/DIDIM/`, 화면 시안 `앱 이미지/DIDIM (1)`, `(2)`, `계획표.png`)
- 실행: `npm run dev` / 검사와 빌드: `npm run build`
- 사용자에게 하는 설명과 앱 화면의 글자는 모두 한국어로 쓴다.

## 1. 폴더 구조 원칙

```
src/
  app/          라우터, 휴대폰 프레임, 기능 등록(features.ts). 기능 코드는 여기 두지 않는다.
  shared/       여러 기능이 같이 쓰는 것만: theme(색상), ui(디딤 부품), assets(디딤돌 그림), events, storage, feature(기능 등록 타입)
  features/
    learning/   디지털 기기 학습 (/learn)
      engine/   레슨 실행 엔진. 어떤 앱인지 모른다.
      pages/    레슨 목록, 레슨 진행 화면 (앱 구분 없이 공통)
      apps/     연습 앱별 폴더 (kakaotalk/, 나중에 smartphone/, navermap/, kiosk/)
    (나중에) onboarding/  connect/  planner/  activity/  points/  settings/
```

- 기능끼리 서로의 폴더를 `import` 하지 않는다. 같이 써야 하는 것은 `shared/`로 옮긴다.
- `shared/`는 어떤 기능도 `import` 하지 않는다.
- 아직 만들지 않는 기능의 폴더는 미리 만들지 않는다.

## 2. 기능 등록 방법

1. `src/features/<기능>/index.ts(x)`에서 `FeatureDefinition`(`src/shared/feature.ts`)을 내보낸다.
   - `id`, `name`, `path`(예약된 경로 중 하나), `routes`(그 경로 아래의 하위 경로), 필요하면 `setup`(앱이 켜질 때 한 번 실행: 이벤트 구독 등)
2. `src/app/features.ts`의 `features` 배열에 한 줄 추가한다. 그 밖의 파일(`App.tsx` 등)은 고치지 않는다.

## 3. 예약된 경로

| 경로 | 기능 | 상태 |
|---|---|---|
| `/learn` | 디지털 기기 학습 (`/learn/:appId`, `/learn/:appId/:lessonId`) | 사용 중 |
| `/onboarding` | 가입과 로그인 | 예약 |
| `/connect` | 보호자와 어르신 계정 연결 | 예약 |
| `/planner` | 오늘의 계획표, 일정 조사 | 예약 |
| `/activity` | 활동 탭 (산책, 사진, 가족 답장) | 예약 |
| `/points` | 포인트 | 예약 |
| `/settings` | 설정 | 예약 |

- 한 기능은 자기 경로 아래만 쓴다. 다른 기능의 예약 경로를 쓰지 않는다.
- `/`는 지금은 `/learn`으로 보내고, `/learn`은 첫 연습 앱(`/learn/kakaotalk`)으로 보낸다(`app/features.ts`의 `homePath`). 계획표가 생기면 바꾼다.

## 4. localStorage 키 규칙

- 형식: `didim.<기능>.<이름>` (예: `didim.learning.progress`)
- 직접 `localStorage`를 부르지 말고 `shared/storage`의 `createStorage('<기능>')`을 쓴다. 접두어가 자동으로 붙는다.
- 다른 기능의 키를 읽거나 쓰지 않는다. 필요하면 이벤트로 받는다.

| 키 | 내용 |
|---|---|
| `didim.learning.progress` | 레슨별 진행 중인 단계 `{ [lessonId]: { stepIndex, phase, updatedAt } }` |
| `didim.learning.completions` | 레슨별 완료 기록 `{ [lessonId]: { firstCompletedAt, lastCompletedAt, count } }` |
| `didim.planner.*`, `didim.activity.*`, `didim.points.*`, `didim.onboarding.*`, `didim.connect.*`, `didim.settings.*` | 예약 |

## 5. 학습 엔진과 앱별 폴더 분리

- `features/learning/engine/`은 **화면 ID, 눌러야 할 대상 ID(data-target), 안내 문구, 확인 질문**만 안다. 카카오톡, 네이버 지도 같은 단어나 화면이 들어가면 안 된다.
- 앱별 내용(화면, 아이콘, 가짜 데이터, 레슨 데이터)은 전부 `features/learning/apps/<앱>/` 안에만 둔다.
- 앱 하나는 `PracticeApp`(`engine/types.ts`) 하나로 묶어 `apps/registry.ts`에 등록한다.
- 연습 화면은 **그림만 그린다.** 클릭 처리를 하지 않고, 누를 수 있는 곳에 `data-target="이름"`만 붙인다. 맞고 틀림은 엔진이 판단한다.
- 연습 화면은 스크롤하지 않는다. 공간이 모자라면 가운데 내용을 잘라낸다(위 머리줄과 아래 탭/입력창은 항상 보이게).
- 새 레슨 = `apps/<앱>/lessons/`에 데이터 파일 하나 + (필요하면) `screens/`에 화면 하나 + 앱 `index.ts`에 등록.
- 글자를 써야 하는 단계는 `typing: { text }`를 쓴다. 입력 칸은 `engine/PracticeInput`의 `usePracticeInput()`에 연결하고, 글자는 어르신 휴대폰의 진짜 키보드로 쓴다(가짜 키보드를 그리지 않는다). 낱말 하나를 한 단계로 나눈다.
- 레슨 단계 문구: `instruction`(단계 표시 탭), `bubble`(말풍선), `hintAfterMistakes`(2번 틀렸을 때, 위치를 구체적으로). 모두 "~해 보세요"처럼 짧게.

## 6. 기능 간 연결은 이벤트로만

- 기능끼리 서로의 함수를 직접 부르지 않는다. `shared/events`의 `emit` / `on`만 쓴다.
- 이벤트 이름과 내용 모양은 `shared/events/types.ts`의 `DidimEventMap`에 적는다.
- 지금 있는 이벤트: `learning.lessonCompleted` `{ lessonId, appId, completedAt }`
  - 나중에 계획표(학습 일정 완료 처리)와 포인트(+50)가 이 이벤트를 구독한다.
- 구독은 각 기능 `FeatureDefinition.setup`에서 한다. 앱이 켜질 때 한 번 실행되므로 놓치는 이벤트가 없다.

## 7. 디딤 색상과 어르신을 위한 UI 원칙

**색상** (`shared/theme/tokens.css`의 CSS 변수로만 쓴다)

| 변수 | 값 | 용도 |
|---|---|---|
| `--didim-primary` | `#156051` | 주색상. 앞으로 가는 버튼(다음, 완료, 확인)은 이 색으로 채운다 |
| `--didim-bg` | `#F4F4F0` | 배경 |
| `--didim-text` | `#161D24` | 기본 글자 |
| `--didim-accent` | `#D24F20` | 강조. 뒤로 가거나 멈추는 버튼(이전, 그만하기)은 이 색으로 채우거나 테두리 |

- 디딤 색상 규칙은 디딤 화면(단계 표시 탭, 팝업, 확인 질문, 목록 등)에만 쓴다. **연습 앱 화면 안에는 쓰지 않는다**(실제 앱과 비슷하게 보이는 게 우선).

**디딤 부품** (`앱 이미지/DIDIM/` 시안 → `shared/ui/`). 새 화면은 먼저 이 부품으로 만들고, 시안에 있는데 아직 없는 부품은 `shared/ui/`에 같은 방식으로 추가한다.

| 시안 | 부품 |
|---|---|
| Button.png | `Button` (primary, soft, outline, back, neutral, danger) |
| Prev action / Help action | `ActionButton` (kind: prev, help). 네모 아이콘 아래 글자 |
| Activity Top Bar / Progress | 레슨 단계 표시 탭 `engine/StepHeader` + `ProgressSegments` |
| Dialog.png | `Dialog` |
| Choice.png | `Choice` |
| Toast.png | `Toast` (info, success, warning. 학습에서는 빨간 실패 모양을 쓰지 않음) |
| Stone.png | `Stone` (green, gray, 위에 아이콘) |
| Header.png | `PageHeader` |
| 선 아이콘 | `shared/ui/icons.tsx` |

아직 만들지 않은 시안 부품: Global Navigation Bar(하단 탭), Date Navigator, Text Input, Time Picker, Settings action, Status Bar(만들지 않기로 함).

**어르신을 위한 원칙**
- 글씨는 크게(본문 20px 이상), 배경과 대비가 분명하게.
- 버튼은 넓게(높이 60px 이상), 버튼 사이 간격도 충분히.
- 디딤 화면의 아이콘에는 항상 글자를 같이 붙인다.
- 안내 문구는 짧고 쉬운 말로, "~해 보세요"처럼 행동을 바로 알려준다.
- 한 화면에 한 가지 행동만 요구한다.
- 스크롤은 되도록 쓰지 않는다. 써야 하면 스크롤 막대가 항상 보이게 한다.
- 틀렸을 때 혼내지 않는다. 빨간색, X 표시, 경고음, 점수, 감점을 쓰지 않는다.
- 다음 화면으로 저절로 넘어가지 않는다. 어르신이 직접 눌러서 넘어간다.
- 음성 인식(말로 입력)은 쓰지 않는다.
- 화면은 가운데 390×844 휴대폰 프레임 안에 들어가야 한다(모바일에서는 화면 전체).

## 8. 기타

- 실제 서비스 로고나 상표 이미지 파일을 쓰지 않는다. 도형과 일반 아이콘으로 그린다.
- 연습 화면에는 "연습 화면" 표시를 작게 둔다.
- 실제 메시지 전송, 로그인, 서버 연동은 하지 않는다.
- `apps/*/reference/`의 캡처 이미지는 Git에 올리지 않는다(실제 개인정보 포함).
