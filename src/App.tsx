import { useEffect, useMemo, useState, type ReactNode } from 'react'
import './App.css'
import logo from './assets/logo.svg'
import qrCode from './assets/qr.png'
import pebbleGreen1 from './assets/stone-green-1.png'
import pebbleGreen2 from './assets/stone-green-2.png'
import pebbleGray1 from './assets/stone-gray-1.png'
import pebbleGray2 from './assets/stone-gray-2.png'
import pebbleGray3 from './assets/stone-gray-3.png'
import pebbleGray3b from './assets/stone-gray-3b.png'
import iconSunrise from './assets/icon-sunrise.svg'
import iconChat from './assets/icon-chat.svg'
import iconWalkDark from './assets/icon-walk-dark.svg'
import iconCamera from './assets/icon-camera.svg'
import iconHeart from './assets/icon-heart.svg'
import iconMoon from './assets/icon-moon.svg'
import chevron from './assets/chevron.svg'
import learnPhone from './assets/learn-phone.png'
import learnKakao from './assets/learn-kakao.png'
import learnMap from './assets/learn-map.png'
import learnKiosk from './assets/learn-kiosk.png'
import activityPhoto from './assets/activity-photo.jpg'
import arrowRight from './assets/arrow-right.svg'
import voicePlay from './assets/voice-play.svg'
import voiceSpectrum from './assets/voice-spectrum.svg'
import guardianAvatar from './assets/guardian-avatar.png'
import { KakaoLearn } from './KakaoLearn'
import {
  Button,
  Choice,
  DateNav,
  Dialog,
  MainTopBar,
  Progress,
  Rule,
  TabBar,
  TextField,
  TimePicker,
  Toast,
  TopBar,
} from './ui'

type Role = 'senior' | 'guardian'
type Tab = 'plan' | 'learn' | 'activity' | 'points'
type Screen =
  | 'welcome'
  | 'email'
  | 'login'
  | 'verify'
  | 'password'
  | 'terms'
  | 'role'
  | 'name'
  | 'guardianAsk'
  | 'guardianName'
  | 'qr'
  | 'connected'
  | 'setupConsent'
  | 'setupActivities'
  | 'setupTimes'
  | 'main'
  | 'kakaoLearn'
  | 'settings'

type Profile = {
  email: string
  password: string
  role: Role
  name: string
  guardianName: string
  withGuardian: boolean
  activities: string[]
  wake: number
  walk: number
  study: number
  sleep: number
  onboarded: boolean
}

const STORAGE_KEY = 'didim-profile'
const EXISTING_EMAIL = 'user@example.com'

const ACTIVITIES = [
  { id: 'walk', title: '산책하기', desc: '가볍게 걷고 사진 남기기', icon: '🚶' },
  { id: 'brain', title: '두뇌 활동', desc: '기억력과 집중력 깨우기', icon: '📷' },
  { id: 'music', title: '음악 듣기', desc: '좋아하는 노래와 함께하기', icon: '🎵' },
  { id: 'cook', title: '생활 요리', desc: '쉬운 음식 차근차근 만들기', icon: '📷' },
]

const WEEK = ['일', '월', '화', '수', '목', '금', '토']

function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Profile) : null
  } catch {
    return null
  }
}

function formatDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEK[date.getDay()]}요일`
}

function honorific(name: string) {
  const n = name.trim() || '주하'
  return n.endsWith('님') ? n : `${n}님`
}

function walkSteps(dayOffset: number) {
  if (dayOffset < 0) return 3240
  if (dayOffset === 0) return 1180
  return 0
}

function pointsForDay(dayOffset: number, photoTaken: boolean, voiceSent: boolean) {
  const steps = walkSteps(dayOffset)
  const items: { label: string; amount: number }[] = []
  if (steps >= 3000) items.push({ label: '하루 3,000보 달성', amount: 30 })
  if (steps >= 5000) items.push({ label: '하루 5,000보 달성', amount: 20 })
  if (steps >= 7000) items.push({ label: '하루 7,000보 달성', amount: 20 })
  if (steps >= 10000) items.push({ label: '하루 10,000보 달성', amount: 50 })
  if (dayOffset < 0 || (dayOffset === 0 && photoTaken)) items.push({ label: '사진 미션 완료', amount: 50 })
  if (dayOffset < 0 || (dayOffset === 0 && voiceSent)) items.push({ label: '음성 기록 미션 완료', amount: 50 })
  if (dayOffset <= 0) items.push({ label: '학습 미션 완료', amount: 50 })
  return { items, total: items.reduce((sum, item) => sum + item.amount, 0) }
}

function App() {
  const saved = loadProfile()
  const [screen, setScreen] = useState<Screen>(saved?.onboarded ? 'main' : 'welcome')
  const [tab, setTab] = useState<Tab>('plan')
  const [, setHistory] = useState<Screen[]>([])
  const [email, setEmail] = useState(saved?.email ?? '')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [code, setCode] = useState('')
  const [role, setRole] = useState<Role>(saved?.role ?? 'senior')
  const [name, setName] = useState(saved?.name ?? '')
  const [guardianName, setGuardianName] = useState(saved?.guardianName ?? '')
  const [withGuardian, setWithGuardian] = useState(saved?.withGuardian ?? true)
  const [selectedActs, setSelectedActs] = useState<string[]>(saved?.activities ?? ['walk', 'music'])
  const [wake, setWake] = useState(saved?.wake ?? 7 * 60)
  const [walk, setWalk] = useState(saved?.walk ?? 14 * 60 + 30)
  const [study, setStudy] = useState(saved?.study ?? 16 * 60)
  const [sleep, setSleep] = useState(saved?.sleep ?? 22 * 60 + 30)
  const [dialog, setDialog] = useState<'signup' | 'help' | 'term1' | 'term2' | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [dayOffset, setDayOffset] = useState(0)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [voiceSent, setVoiceSent] = useState(false)
  const [helpText, setHelpText] = useState('')

  const date = useMemo(() => {
    const d = new Date(2025, 8, 26)
    d.setDate(d.getDate() + dayOffset)
    return d
  }, [dayOffset])

  const displayName = honorific(name)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (screen !== 'qr') return
    const t = setTimeout(() => go('connected'), 2600)
    return () => clearTimeout(t)
  }, [screen])

  function go(next: Screen) {
    setHistory((h) => [...h, screen])
    setScreen(next)
  }

  function back() {
    setHistory((h) => {
      const prev = h[h.length - 1]
      if (prev) setScreen(prev)
      else setScreen('welcome')
      return h.slice(0, -1)
    })
  }

  function persist(extra: Partial<Profile> = {}) {
    const profile: Profile = {
      email,
      password,
      role,
      name: name || '주하',
      guardianName,
      withGuardian,
      activities: selectedActs,
      wake,
      walk,
      study,
      sleep,
      onboarded: true,
      ...extra,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }

  function showHelp(text: string) {
    setHelpText(text)
    setDialog('help')
  }

  function onEmailNext() {
    if (!email.includes('@')) {
      setToast('이메일 형식을 확인해 주세요.')
      return
    }
    if (email.trim().toLowerCase() === EXISTING_EMAIL) {
      go('login')
      return
    }
    setDialog('signup')
  }

  function toggleActivity(id: string) {
    setSelectedActs((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  const longOk = password.length >= 8
  const mixOk = /[A-Za-z]/.test(password) && /\d/.test(password)
  const matchOk = password.length > 0 && password === password2

  let body: ReactNode = null

  if (screen === 'welcome') {
    body = (
      <div className="screen welcome">
        <div className="brand-area">
          <img src={logo} className="logo" width={145.431} height={83.337} alt="디딤" />
          <p className="tagline">
            내 일상의 작은 디딤,
            <br />
            오늘도 한 걸음씩
          </p>
        </div>
        <div className="welcome-actions">
          <Button
            variant="secondary"
            icon="google"
            onClick={() => {
              setEmail('google.user@gmail.com')
              setName('주하')
              go('role')
            }}
          >
            Google로 계속하기
          </Button>
          <div className="divider">
            <span />
            또는
            <span />
          </div>
          <Button onClick={() => go('email')}>이메일로 계속하기</Button>
        </div>
      </div>
    )
  } else if (screen === 'email') {
    body = (
      <div className="screen">
        <TopBar title="이메일로 계속하기" onBack={back} />
        <h2 className="headline">이메일 주소를 입력해 주세요</h2>
        <TextField label="이메일" value={email} onChange={setEmail} placeholder="user@example.com" />
        <p className="hint">
          가입하신 이메일 주소를 잊으셨나요?{' '}
          <button type="button" onClick={() => setToast('계정 찾기는 데모에서 이메일 안내로 대체됩니다.')}>
            계정 찾기
          </button>
        </p>
        <div className="grow" />
        <Button icon="arrow" onClick={onEmailNext} disabled={!email}>
          다음
        </Button>
      </div>
    )
  } else if (screen === 'login') {
    body = (
      <div className="screen">
        <TopBar title="이메일로 계속하기" onBack={back} />
        <h2 className="headline">비밀번호를 입력해주세요</h2>
        <TextField label="이메일" value={email} disabled />
        <TextField
          label="비밀번호"
          value={password}
          onChange={setPassword}
          passwordToggle
          showPassword={showPw}
          onTogglePassword={() => setShowPw((v) => !v)}
        />
        <p className="hint" style={{ marginTop: -12 }}>
          비밀번호를 잊으셨나요?{' '}
          <button type="button" onClick={() => setToast('임시 비밀번호를 이메일로 보내 드렸어요.')}>
            비밀번호 찾기
          </button>
        </p>
        <div className="grow" />
        <Button
          onClick={() => {
            persist({ onboarded: true, name: name || '주하' })
            setScreen('main')
            setHistory([])
          }}
          disabled={password.length < 4}
        >
          로그인
        </Button>
      </div>
    )
  } else if (screen === 'verify') {
    body = (
      <div className="screen">
        <TopBar title="새로 가입하기" onBack={back} />
        <h2 className="headline">
          10분 안에
          <br />
          인증번호를 입력해 주세요
        </h2>
        <TextField label="이메일" value={email} disabled />
        <div className="field">
          <label>인증번호</label>
          <div className="code-row">
            <input
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6자리 숫자"
              inputMode="numeric"
            />
            <Button variant="accent" onClick={() => setToast('이메일로 인증번호를 보내 드렸어요!')}>
              다시 보내기
            </Button>
          </div>
        </div>
        <div className="grow" />
        <Button
          icon="arrow"
          disabled={code.length < 6}
          onClick={() => go('password')}
        >
          다음
        </Button>
      </div>
    )
  } else if (screen === 'password') {
    body = (
      <div className="screen">
        <TopBar title="새로 가입하기" onBack={back} />
        <h2 className="headline">비밀번호를 만들어 주세요</h2>
        <TextField
          label="비밀번호"
          value={password}
          onChange={setPassword}
          passwordToggle
          showPassword={showPw}
          onTogglePassword={() => setShowPw((v) => !v)}
        />
        <TextField
          label="비밀번호 확인"
          value={password2}
          onChange={setPassword2}
          passwordToggle
          showPassword={showPw2}
          onTogglePassword={() => setShowPw2((v) => !v)}
        />
        <div className="rules">
          <h3>아래 규칙을 모두 지켜주세요!</h3>
          <Rule ok={longOk}>8자 이상</Rule>
          <Rule ok={mixOk}>영문·숫자 포함</Rule>
          <Rule ok={matchOk}>두 비밀번호 일치</Rule>
        </div>
        <div className="grow" />
        <Button icon="arrow" disabled={!(longOk && mixOk && matchOk)} onClick={() => go('terms')}>
          다음
        </Button>
      </div>
    )
  } else if (screen === 'terms') {
    body = (
      <div className="screen">
        <TopBar title="새로 가입하기" onBack={back} />
        <h2 className="headline">이용약관에 동의해 주세요</h2>
        <div className="term-list">
          <button type="button" className="term" onClick={() => setDialog('term1')}>
            <span>
              <span className="req">필수</span> 서비스 이용약관
            </span>
            <img src={chevron} width={9} height={18} alt="" />
          </button>
          <button type="button" className="term" onClick={() => setDialog('term2')}>
            <span>
              <span className="req">필수</span> 개인정보 수집·이용 동의
            </span>
            <img src={chevron} width={9} height={18} alt="" />
          </button>
        </div>
        <div className="grow" />
        <Button icon="arrow" onClick={() => go('role')}>
          동의하고 계속하기
        </Button>
      </div>
    )
  } else if (screen === 'role') {
    body = (
      <div className="screen">
        <TopBar
          title="새로 가입하기"
          onBack={back}
          onHelp={() =>
            showHelp('시니어는 매일 계획표와 활동을 쓰고, 보호자는 가족과 연결해 함께 살펴봅니다.')
          }
        />
        <h2 className="headline">누가 이 앱을 사용하시나요?</h2>
        <div className="choices">
          <Choice
            title="제가 사용할 거예요"
            desc="시니어 계정으로 가입할게요"
            selected={role === 'senior'}
            onClick={() => setRole('senior')}
          />
          <Choice
            title="우리 부모님이 사용할 거예요"
            desc="보호자 계정으로 가입할게요"
            selected={role === 'guardian'}
            onClick={() => setRole('guardian')}
          />
        </div>
        <div className="grow" />
        <Button icon="arrow" onClick={() => go('name')}>
          다음
        </Button>
      </div>
    )
  } else if (screen === 'name') {
    body = (
      <div className="screen">
        <TopBar title="새로 가입하기" onBack={back} />
        <h2 className="headline">어떤 이름으로 불러드릴까요?</h2>
        <TextField value={name} onChange={setName} placeholder="이름을 입력해 주세요" />
        <div className="grow" />
        <Button
          icon="arrow"
          disabled={!name.trim()}
          onClick={() => go(role === 'senior' ? 'guardianAsk' : 'qr')}
        >
          다음
        </Button>
      </div>
    )
  } else if (screen === 'guardianAsk') {
    body = (
      <div className="screen">
        <TopBar title="새로 가입하기" onBack={back} />
        <h2 className="headline with-sub">보호자와 함께 사용하시나요?</h2>
        <p className="subhead">보호자 계정과 연결할 수 있게 도와 드릴게요</p>
        <div className="grow" />
        <Button
          variant="accent"
          onClick={() => {
            setWithGuardian(false)
            go('setupConsent')
          }}
        >
          아니요, 혼자 할래요
        </Button>
        <div style={{ height: 12 }} />
        <Button
          onClick={() => {
            setWithGuardian(true)
            go('guardianName')
          }}
        >
          네, 함께 할래요
        </Button>
      </div>
    )
  } else if (screen === 'guardianName') {
    body = (
      <div className="screen">
        <TopBar title="새로 가입하기" onBack={back} />
        <h2 className="headline">보호자 이름을 알려 주세요</h2>
        <TextField
          value={guardianName}
          onChange={setGuardianName}
          placeholder="이름을 입력해 주세요"
        />
        <div className="grow" />
        <Button icon="arrow" disabled={!guardianName.trim()} onClick={() => go('qr')}>
          다음
        </Button>
      </div>
    )
  } else if (screen === 'qr') {
    body = (
      <div className="screen">
        <TopBar title="계정 연결하기" onBack={back} />
        <h2 className="headline with-sub">잠시만 기다려주세요</h2>
        <p className="subhead">보호자가 아래 QR 코드를 촬영하면 연결돼요</p>
        <button type="button" className="qr-wrap" onClick={() => go('connected')} aria-label="연결 완료">
          <img src={qrCode} width={300} height={300} alt="연결 QR 코드" />
        </button>
      </div>
    )
  } else if (screen === 'connected') {
    body = (
      <div className="screen">
        <TopBar title="계정 연결하기" onBack={back} />
        <h2 className="headline">
          {displayName}과
          <br />
          연결되었어요!
        </h2>
        <div className="grow" />
        <Button icon="arrow" onClick={() => go('setupConsent')}>
          다음
        </Button>
      </div>
    )
  } else if (screen === 'setupConsent') {
    body = (
      <div className="screen">
        <h2 className="headline with-sub">
          {displayName}께 몇 가지를
          <br />
          물어봐도 괜찮을까요?
        </h2>
        <p className="subhead">좋아하는 활동을 알아보고 맞는 일상을 준비할게요.</p>
        <div className="grow" />
        <Button icon="arrow" onClick={() => go('setupActivities')}>
          네, 좋아요
        </Button>
      </div>
    )
  } else if (screen === 'setupActivities') {
    body = (
      <div className="screen">
        <Progress step={1} total={3} />
        <h2 className="headline with-sub">어떤 활동을 좋아하세요?</h2>
        <p className="subhead">좋아하는 활동을 2개까지 골라 주세요.</p>
        <div className="choices">
          {ACTIVITIES.map((act) => (
            <Choice
              key={act.id}
              title={act.title}
              desc={act.desc}
              selected={selectedActs.includes(act.id)}
              onClick={() => toggleActivity(act.id)}
            />
          ))}
        </div>
        <div className="grow" />
        <Button icon="arrow" disabled={selectedActs.length === 0} onClick={() => go('setupTimes')}>
          다음
        </Button>
      </div>
    )
  } else if (screen === 'setupTimes') {
    body = (
      <div className="screen">
        <Progress step={2} total={3} />
        <h2 className="headline with-sub">하루 일정을 알려 주세요</h2>
        <p className="subhead">일정에 맞춰 편안한 때에 알려 드릴게요.</p>
        <TimePicker emoji="☀️" label="기상 시간" minutes={wake} onChange={setWake} />
        <TimePicker emoji="🚶" label="산책 시간" minutes={walk} onChange={setWalk} />
        <TimePicker emoji="📚" label="공부 시간" minutes={study} onChange={setStudy} />
        <TimePicker emoji="🌙" label="취침 시간" minutes={sleep} onChange={setSleep} />
        <div className="notice">🔔 활동 10분 전에 큰 알림으로 알려 드려요.</div>
        <div className="grow" />
        <Button
          onClick={() => {
            persist({ onboarded: true })
            setHistory([])
            setScreen('main')
            setTab('plan')
          }}
        >
          시간 저장하기
        </Button>
      </div>
    )
  } else if (screen === 'kakaoLearn') {
    body = (
      <div className="screen kakao-learn">
        <KakaoLearn
          onExit={() => {
            setScreen('main')
          }}
        />
      </div>
    )
  } else if (screen === 'settings') {
    body = (
      <div className="screen">
        <TopBar title="설정" onBack={() => setScreen('main')} />
        <h2 className="headline">기본 설정</h2>
        <div className="settings-list">
          <div className="row">
            {displayName}
            <div className="muted">{email || '구글 계정'}</div>
          </div>
          <button type="button" onClick={() => go('setupActivities')}>
            관심 활동 다시 고르기
            <div className="muted">{selectedActs.length}개 선택됨</div>
          </button>
          <button type="button" onClick={() => go('setupTimes')}>
            생활 시간 바꾸기
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY)
              setScreen('welcome')
              setHistory([])
              setPassword('')
              setPassword2('')
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    )
  } else {
    const dayLabel = formatDate(date)
    const tag =
      dayOffset === 0
        ? '오늘'
        : dayOffset === -1
          ? '어제'
          : dayOffset === 1
            ? '내일'
            : dayOffset < 0
              ? `${Math.abs(dayOffset)}일 전`
              : `${dayOffset}일 후`
    const isToday = dayOffset === 0
    const isPast = dayOffset < 0
    const showPhoto = isPast || photoTaken
    const showVoice = isPast || voiceSent
    const showReply = isPast || (photoTaken && voiceSent)
    const dayPoints = pointsForDay(dayOffset, photoTaken, voiceSent)
    body = (
      <>
        <div className="tab-body">
          <MainTopBar
            title={tab === 'plan' ? '오늘의 계획표' : tab === 'learn' ? '학습' : tab === 'activity' ? '활동' : '포인트'}
            date={tab === 'plan' ? dayLabel : undefined}
            onSettings={() => setScreen('settings')}
            onHelp={() =>
              showHelp(
                tab === 'plan'
                  ? '디딤돌 순서로 하루를 따라가면 돼요. 초록 돌은 이미 마친 일, 회색 돌은 아직 남은 일이에요.'
                  : tab === 'learn'
                    ? '오늘의 학습을 고르고, 아래 메뉴에서 다른 것도 연습할 수 있어요.'
                    : tab === 'activity'
                      ? '걸음과 사진을 가족에게 보여 주는 화면이에요. 아래로 내리면 답장을 볼 수 있어요.'
                      : '활동을 마치면 포인트가 쌓여요. 날짜를 바꿔 기록을 살펴보세요.',
              )
            }
          />

          {tab === 'plan' && (
            <>
              <div className="info-bubble">
                좋은 아침이에요, {displayName}
                <br />
                지금 산책해보는 거 어때요?
              </div>
              <div className="stones">
                <StoneRow pebble={pebbleGreen1} icon={iconSunrise} meta="07:17 완료" metaDone name="기상하기" />
                <StoneRow
                  pebble={pebbleGreen2}
                  icon={iconChat}
                  meta="학습 · 08:57 완료"
                  metaDone
                  name="카카오톡 배우기"
                  chevron
                  onClick={() => go('kakaoLearn')}
                />
                <div className="stone-item current">
                  <div className="stone-top">
                    <div className="stone-visual">
                      <img className="pebble" src={pebbleGray3} width={84} height={84} alt="" />
                      <img className="mark" src={iconWalkDark} width={24} height={24} alt="" />
                    </div>
                    <div className="stone-copy">
                      <p className="meta soon">활동 · 14:00 예정</p>
                      <p className="name">주변 산책하기</p>
                    </div>
                  </div>
                  <div className="start-row">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setTab('activity')}>
                      <img src={arrowRight} width={20} height={20} alt="" />
                      지금 시작하기
                    </button>
                  </div>
                </div>
                <StoneRow
                  pebble={photoTaken ? pebbleGreen1 : pebbleGray1}
                  icon={iconCamera}
                  meta={photoTaken ? '활동 · 13:34 완료' : '활동 · 15:00 예정'}
                  metaDone={photoTaken}
                  name="꽃 사진 찍기"
                  chevron
                  onClick={() => setTab('activity')}
                />
                <StoneRow
                  pebble={voiceSent ? pebbleGreen2 : pebbleGray2}
                  icon={iconHeart}
                  meta={voiceSent ? '활동 · 14:27 완료' : '활동 · 20:00 예정'}
                  metaDone={voiceSent}
                  name="음성 메시지 보내기"
                  chevron
                  onClick={() => setTab('activity')}
                />
                <StoneRow pebble={pebbleGray3b} icon={iconMoon} meta="22:30 예정" name="취침하기" />
              </div>
            </>
          )}

          {tab === 'learn' && (
            <>
              <DateNav label={dayLabel} tag={tag} onPrev={() => setDayOffset((n) => n - 1)} onNext={() => setDayOffset((n) => n + 1)} />
              <div className="section-head">
                <h2>오늘의 학습</h2>
                <span className="status">1 / 1 완료</span>
              </div>
              <div className="stones">
                <StoneRow
                  pebble={pebbleGreen2}
                  icon={iconChat}
                  meta="학습 · 08:57 완료"
                  metaDone
                  name="카카오톡 배우기"
                  chevron
                  onClick={() => go('kakaoLearn')}
                />
              </div>
              <div className="section-head">
                <h2>다른 것도 배워볼까요?</h2>
              </div>
              <div className="learn-grid">
                {[
                  { src: learnPhone, label: '스마트폰 조작법', cls: 'phone' },
                  { src: learnKakao, label: '카카오톡', cls: '' },
                  { src: learnMap, label: '네이버지도', cls: '' },
                  { src: learnKiosk, label: '키오스크', cls: 'kiosk' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="learn-card"
                    onClick={() =>
                      item.label === '카카오톡'
                        ? go('kakaoLearn')
                        : setToast(`${item.label} 학습을 준비 중이에요.`)
                    }
                  >
                    <img className={item.cls} src={item.src} alt="" />
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === 'activity' && (
            <>
              <DateNav label={dayLabel} tag={tag} onPrev={() => setDayOffset((n) => n - 1)} onNext={() => setDayOffset((n) => n + 1)} />
              <div className="section-head">
                <h2>{isToday ? '오늘의 활동' : isPast ? '지난 활동' : '예정된 활동'}</h2>
                <span className="status">{isPast || (photoTaken && voiceSent) ? '3 / 3 완료' : isToday ? '1 / 3 완료' : '0 / 3 완료'}</span>
              </div>
              <div className="steps-card">
                <div className="stone-visual">
                  <img className="pebble" src={pebbleGreen1} width={84} height={84} alt="" />
                  <img className="mark" src={iconWalkDark} width={24} height={24} alt="" />
                </div>
                <div className="steps-copy" style={{ flex: 1 }}>
                  <p className="count">{isPast ? '3,240 걸음' : isToday ? '1,180 걸음' : '0 걸음'}</p>
                  <div className="bar">
                    <span style={{ width: isPast ? '64.8%' : isToday ? '23.6%' : '0%' }} />
                  </div>
                  <p className="goal">목표 5,000 걸음</p>
                </div>
              </div>

              <div className="thread">
                {showPhoto ? (
                  <div className="msg-me">
                    <div>
                      <div className="photo-card">
                        <img src={activityPhoto} alt="산책 중에 찍은 사진" />
                        {isToday && !showVoice ? (
                          <div className="photo-hint">
                            ⌄
                            <br />
                            화면을 아래로 내리면
                            <br />
                            가족에게서 온 답장을 볼 수 있어요
                          </div>
                        ) : null}
                      </div>
                      <p className="photo-caption">13:34에 찍은 사진</p>
                    </div>
                    {showVoice ? (
                      <div>
                        <button
                          type="button"
                          className="voice-bubble"
                          onClick={() => setToast('안부 음성을 들려 드려요.')}
                          aria-label="보낸 음성 메시지 재생"
                        >
                          <img className="play" src={voicePlay} width={40} height={40} alt="" />
                          <img className="spectrum" src={voiceSpectrum} width={124.5} height={27.5} alt="" />
                          <span className="dur">0:12</span>
                        </button>
                        <p className="photo-caption">14:27에 보낸 안부</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {isToday && (!photoTaken || !voiceSent) ? (
                  <div className="activity-actions">
                    {!photoTaken ? (
                      <Button icon="arrow" onClick={() => setPhotoTaken(true)}>
                        사진 찍으러 가기
                      </Button>
                    ) : null}
                    {!voiceSent ? (
                      <Button
                        variant={photoTaken ? 'primary' : 'accent'}
                        icon="arrow"
                        onClick={() => {
                          setVoiceSent(true)
                          setToast('안부 음성을 가족에게 보냈어요.')
                        }}
                      >
                        음성 메시지 기록하기
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                {showReply ? (
                  <div className="msg-you">
                    <div className="msg-avatar">
                      <img src={guardianAvatar} width={24} height={24} alt="" />
                    </div>
                    <div className="msg-you-copy">
                      <p className="who">보호자</p>
                      <div className="msg-bubble">
                        날씨가 너무 좋네요💚
                        <br />
                        산책 잘 다녀오셨어요?
                      </div>
                      <p className="photo-caption" style={{ textAlign: 'left' }}>
                        14:47에 온 답장
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}

          {tab === 'points' && (
            <>
              <div className="points-card">
                <p className="caption">지금까지 모은 포인트</p>
                <p className="value">1,250 P</p>
              </div>
              <div className="section-head">
                <h2>내 포인트 기록</h2>
              </div>
              <DateNav label={dayLabel} tag={tag} onPrev={() => setDayOffset((n) => n - 1)} onNext={() => setDayOffset((n) => n + 1)} />
              <div className="points-day">
                <p className="points-earned">
                  이날 얻은 포인트 <strong>{dayPoints.total.toLocaleString('ko-KR')} P</strong>
                </p>
                {dayPoints.items.length === 0 ? (
                  <p className="points-empty">아직 얻은 포인트가 없어요.</p>
                ) : (
                  <ul className="points-log">
                    {dayPoints.items.map((item) => (
                      <li key={item.label} className="points-log-row">
                        <span>{item.label}</span>
                        <span className="amt">+{item.amount} P</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
        <TabBar tab={tab} onChange={setTab} />
      </>
    )
  }

  return (
    <div className="app-shell">
      <div className="phone">
        {body}
        {dialog === 'signup' && (
          <Dialog
            title="새롭게 계정을 가입할까요?"
            body="입력하신 이메일로 인증번호를 보내 드릴게요"
            cancel="취소"
            confirm="확인"
            onCancel={() => setDialog(null)}
            onConfirm={() => {
              setDialog(null)
              setToast('이메일로 인증번호를 보내 드렸어요!')
              go('verify')
            }}
          />
        )}
        {dialog === 'help' && (
          <Dialog
            title="도움말"
            body={helpText}
            cancel="닫기"
            confirm="알겠어요"
            onCancel={() => setDialog(null)}
            onConfirm={() => setDialog(null)}
          />
        )}
        {dialog === 'term1' && (
          <Dialog
            title="서비스 이용약관"
            body="디딤은 시니어의 하루 계획, 학습, 활동을 가족과 함께 이어 주는 서비스입니다. 데모에서는 약관 전문 대신 요약만 보여 드려요."
            cancel="닫기"
            confirm="확인"
            onCancel={() => setDialog(null)}
            onConfirm={() => setDialog(null)}
          />
        )}
        {dialog === 'term2' && (
          <Dialog
            title="개인정보 수집·이용"
            body="이메일, 이름, 생활 시간, 관심 활동은 맞춤 일정을 만들기 위해 쓰입니다. 데모 데이터는 이 기기에만 저장됩니다."
            cancel="닫기"
            confirm="확인"
            onCancel={() => setDialog(null)}
            onConfirm={() => setDialog(null)}
          />
        )}
        {toast && <Toast>{toast}</Toast>}
      </div>
    </div>
  )
}

function StoneRow({
  pebble,
  icon,
  meta,
  name,
  metaDone,
  chevron: showChevron,
  onClick,
}: {
  pebble: string
  icon: string
  meta: string
  name: string
  metaDone?: boolean
  chevron?: boolean
  onClick?: () => void
}) {
  const inner = (
    <>
      <div className="stone-visual">
        <img className="pebble" src={pebble} width={84} height={84} alt="" />
        <img className="mark" src={icon} width={24} height={24} alt="" />
      </div>
      <div className="stone-copy">
        <p className={`meta ${metaDone ? 'done' : 'soon'}`}>{meta}</p>
        <p className="name">{name}</p>
      </div>
      {showChevron ? <img src={chevron} width={9} height={18} alt="" /> : null}
    </>
  )
  if (onClick) {
    return (
      <button type="button" className="stone-item" onClick={onClick}>
        {inner}
      </button>
    )
  }
  return <div className="stone-item">{inner}</div>
}

export default App
