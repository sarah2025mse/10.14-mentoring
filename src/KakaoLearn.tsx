import { useMemo } from 'react'
import { createMemoryRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { KakaoLearnExitContext } from './features/learning/exitContext'
import { learningFeature } from './features/learning'

/** 이 앱에 넣어 둔 카카오톡 연습 화면을 연다. GitHub로 나가지 않는다. */
export function KakaoLearn({ onExit }: { onExit: () => void }) {
  const router = useMemo(
    () =>
      createMemoryRouter(
        [
          { path: '/learn', children: learningFeature.routes },
          { path: '*', element: <Navigate to="/learn/kakaotalk" replace /> },
        ],
        { initialEntries: ['/learn/kakaotalk'] },
      ),
    [],
  )

  return (
    <KakaoLearnExitContext.Provider value={onExit}>
      <div className="kakao-learn-root">
        <RouterProvider router={router} />
      </div>
    </KakaoLearnExitContext.Provider>
  )
}
