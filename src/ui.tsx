import type { ReactNode } from 'react'
import arrowLeft from './assets/arrow-left.svg'
import arrowRight from './assets/arrow-right.svg'
import arrowGreen from './assets/arrow-green.svg'
import settingsIcon from './assets/settings.svg'
import checkIcon from './assets/check.svg'
import checkCircle from './assets/check-circle.svg'
import circleCheck from './assets/circle-check.svg'
import chevron from './assets/chevron.svg'
import eye from './assets/eye.svg'
import google from './assets/google.svg'
import navClockOn from './assets/nav-clock-on.svg'
import navClockOff from './assets/nav-clock-off.svg'
import navBookOn from './assets/nav-book-on.svg'
import navBookOff from './assets/nav-book-off.svg'
import navWalk from './assets/nav-walk.svg'
import navStar from './assets/nav-star.svg'

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="icon-btn back" onClick={onClick} aria-label="뒤로">
      <img src={arrowLeft} width={24} height={24} alt="" />
    </button>
  )
}

export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="icon-btn help" onClick={onClick} aria-label="도움말">
      ?
    </button>
  )
}

export function TopBar({
  title,
  onBack,
  onHelp,
}: {
  title: string
  onBack?: () => void
  onHelp?: () => void
}) {
  return (
    <header className="topbar">
      {onBack ? <BackButton onClick={onBack} /> : <span />}
      <p className="topbar-title">{title}</p>
      {onHelp ? <HelpButton onClick={onHelp} /> : <span />}
    </header>
  )
}

export function MainTopBar({
  title,
  date,
  onSettings,
  onHelp,
}: {
  title: string
  date?: string
  onSettings: () => void
  onHelp: () => void
}) {
  return (
    <header className="topbar main">
      <div className="main-title">
        {date ? <span className="date">{date}</span> : null}
        <h1>{title}</h1>
      </div>
      <div className="nav-actions">
        <button type="button" className="nav-action" onClick={onSettings}>
          <span className="icon-btn settings">
            <img src={settingsIcon} width={44} height={44} alt="" />
          </span>
          <span className="settings-label">설정</span>
        </button>
        <button type="button" className="nav-action" onClick={onHelp}>
          <span className="icon-btn help">?</span>
          <span className="help-label">도움말</span>
        </button>
      </div>
    </header>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  icon,
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  icon?: 'arrow' | 'google'
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon === 'arrow' ? <img src={arrowRight} width={24} height={24} alt="" /> : null}
      {icon === 'google' ? <img src={google} width={20} height={20} alt="" /> : null}
      {children}
    </button>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
  passwordToggle,
  showPassword,
  onTogglePassword,
}: {
  label?: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
  passwordToggle?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}) {
  return (
    <div className="field">
      {label ? <label>{label}</label> : null}
      <div className={passwordToggle ? 'input-wrap' : undefined}>
        <input
          className={`input${disabled ? ' is-disabled' : ''}`}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          type={passwordToggle ? (showPassword ? 'text' : 'password') : type}
          disabled={disabled}
        />
        {passwordToggle ? (
          <button type="button" className="eye-btn" onClick={onTogglePassword} aria-label="비밀번호 보기">
            <img src={eye} width={24} height={24} alt="" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export function Rule({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div className={`rule${ok ? ' ok' : ''}`}>
      <img src={checkIcon} width={20} height={20} alt="" style={{ opacity: ok ? 1 : 0.28 }} />
      <span>{children}</span>
    </div>
  )
}

export function Choice({
  title,
  desc,
  selected,
  onClick,
}: {
  title: string
  desc: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button type="button" className={`choice${selected ? ' selected' : ''}`} onClick={onClick}>
      <div className="copy">
        <p className="title">{title}</p>
        <p className="desc">{desc}</p>
      </div>
      {selected ? <img src={checkCircle} width={24} height={24} alt="" /> : null}
    </button>
  )
}

export function Progress({ step, total }: { step: number; total: number }) {
  const pct = Math.floor((step / total) * 100)
  return (
    <>
      <div className="progress-row">
        <span>
          설정 {step} / {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </>
  )
}

export function TimePicker({
  emoji,
  label,
  minutes,
  onChange,
}: {
  emoji: string
  label: string
  minutes: number
  onChange: (minutes: number) => void
}) {
  const hh = String(Math.floor(minutes / 60) % 24).padStart(2, '0')
  const mm = String(minutes % 60).padStart(2, '0')
  return (
    <div className="time-row">
      <div className="label-group">
        <span className="emoji">{emoji}</span>
        <span>{label}</span>
      </div>
      <div className="time-controls">
        <button type="button" className="step-btn" onClick={() => onChange((minutes + 24 * 60 - 30) % (24 * 60))}>
          -
        </button>
        <div className="time-slot">
          {hh}:{mm}
        </div>
        <button type="button" className="step-btn" onClick={() => onChange((minutes + 30) % (24 * 60))}>
          +
        </button>
      </div>
    </div>
  )
}

export function TabBar({
  tab,
  onChange,
}: {
  tab: 'plan' | 'learn' | 'activity' | 'points'
  onChange: (tab: 'plan' | 'learn' | 'activity' | 'points') => void
}) {
  const items = [
    { id: 'plan' as const, label: '계획표', on: navClockOn, off: navClockOff },
    { id: 'learn' as const, label: '학습', on: navBookOn, off: navBookOff },
    { id: 'activity' as const, label: '활동', on: navWalk, off: navWalk },
    { id: 'points' as const, label: '포인트', on: navStar, off: navStar },
  ]
  return (
    <nav className="tabbar">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`tab${tab === item.id ? ' active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <img src={tab === item.id ? item.on : item.off} width={24} height={24} alt="" />
          {item.label}
        </button>
      ))}
    </nav>
  )
}

export function DateNav({
  label,
  tag,
  onPrev,
  onNext,
}: {
  label: string
  tag: string
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="date-nav">
      <button type="button" className="icon-btn" onClick={onPrev} aria-label="이전 날">
        <img src={arrowGreen} width={24} height={24} alt="" style={{ transform: 'scaleX(-1)' }} />
      </button>
      <div className="center">
        <span>{label}</span>
        <span className="tag">{tag}</span>
      </div>
      <button type="button" className="icon-btn" onClick={onNext} aria-label="다음 날">
        <img src={arrowGreen} width={24} height={24} alt="" />
      </button>
    </div>
  )
}

export function Dialog({
  title,
  body,
  cancel,
  confirm,
  onCancel,
  onConfirm,
}: {
  title: string
  body: string
  cancel: string
  confirm: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="overlay">
      <div className="dialog" role="dialog" aria-modal="true">
        <h3>{title}</h3>
        <p>{body}</p>
        <div className="dialog-actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancel}
          </Button>
          <Button onClick={onConfirm}>{confirm}</Button>
        </div>
      </div>
    </div>
  )
}

export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="toast">
      <img src={circleCheck} width={20} height={20} alt="" />
      <span>{children}</span>
    </div>
  )
}

export function Chevron() {
  return <img src={chevron} width={9} height={18} alt="" />
}
