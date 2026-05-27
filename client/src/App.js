import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "./utils/userSlice";

import LandingPage   from "./pages/LandingPage";
import SigninPage    from "./pages/SigninPage";
import SignupPage    from "./pages/SignupPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportForm    from "./pages/ReportForm";
import AllItemsPage  from "./pages/AllItemsPage";
import MyItemsPage   from "./pages/MyItemsPage";
import ClaimantsPage from "./pages/ClaimantsPage";
import HelpersPage   from "./pages/HelpersPage";
import NotFound      from "./pages/NotFound";

function PrivateRoute({ children }) {
  const user = useSelector(selectUser);
  return user ? children : <Navigate to="/sign-in" replace />;
}

function AdminRoute({ children }) {
  const user = useSelector(selectUser);
  if (!user) return <Navigate to="/sign-in" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<LandingPage />} />
      <Route path="/home"      element={<LandingPage />} />
      <Route path="/sign-in"   element={<SigninPage />} />
      <Route path="/sign-up"   element={<SignupPage />} />

      <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      <Route path="/my-items"  element={<PrivateRoute><MyItemsPage /></PrivateRoute>} />
      <Route path="/all-items" element={<PrivateRoute><AllItemsPage /></PrivateRoute>} />
      <Route path="/report"    element={<PrivateRoute><ReportForm /></PrivateRoute>} />
      <Route path="/claimants" element={<PrivateRoute><ClaimantsPage /></PrivateRoute>} />
      <Route path="/helpers"   element={<PrivateRoute><HelpersPage /></PrivateRoute>} />

      <Route path="/admin"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      <Route path="*"          element={<NotFound />} />
    </Routes>
  );
}
