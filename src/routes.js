import { Navigate ,useRoutes } from 'react-router-dom';
// layouts
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import PaymentPage from "./pages/PaymentPage";
import SuccessTinkoffPay from "./pages/SuccessTinkoffPay";
import GuestGuard from "./utils/route-guard/GuestGuard";
import Login from "./pages/Login";
import AuthGuard from "./utils/route-guard/AuthGuard";
import ApelsinPage from "./pages/ApelsinPage";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <PaymentPage /> },
        { path: '/tinkoff/success', element: <SuccessTinkoffPay /> },
        { path: '/login', element: <Login />},
        { path: '/apelsin', element:
            <AuthGuard>
              <ApelsinPage />
            </AuthGuard>
        }
      ]
    },
    { path: '*', element: <Navigate to="/" /> }
  ]);
}
