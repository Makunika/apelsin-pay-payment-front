import { Navigate ,useRoutes } from 'react-router-dom';
// layouts
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import PaymentPage from "./pages/PaymentPage";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <PaymentPage /> },
      ]
    },
    { path: '*', element: <Navigate to="/" /> }
  ]);
}
