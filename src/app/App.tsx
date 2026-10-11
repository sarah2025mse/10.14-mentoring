import { createBrowserRouter, Navigate } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { features, homePath } from './features';
import { PhoneFrame } from './PhoneFrame';

const router = createBrowserRouter([
  {
    Component: PhoneFrame,
    children: [
      { index: true, element: <Navigate to={homePath} replace /> },
      ...features.map((feature) => ({ path: feature.path, children: feature.routes })),
      { path: '*', element: <Navigate to={homePath} replace /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
