import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/Dashboard";
import GoogleLoginTest from "../pages/GoogleLoginTest";
import TokenTest from "../pages/TokenTest";
import TokenDemo from "../pages/TokenDemo";
import RegistrationDemo from "../pages/RegistrationDemo";
import PrivateRoute from "../component/PrivateRoute";
import PricingPage from "../pages/PricePage";
import InitiateRegister from "../pages/InitiateRegister";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import PaymentSuccess from "../pages/PaymentSuccess";
import ManageUser from "../pages/admin/ManageUser";
import ManagePayment from "../pages/admin/ManagePayment";
import DashboardAdmin from "../pages/admin/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/initiate-register",
        element: <InitiateRegister />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/google-test",
        element: <GoogleLoginTest />,
      },
      {
        path: "/token-test",
        element: <TokenTest />,
      },
      {
        path: "/token-demo",
        element: <TokenDemo />,
      },
      {
        path: "/registration-demo",
        element: <RegistrationDemo />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/price",
        element: <PricingPage />,
      },
      {
        path: "/payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "/manage-user",
        element: <ManageUser />,
      },
      {
        path: "/dashboard-admin",
        element: <DashboardAdmin />,
      },
    ],
  },
]);

export default router;
