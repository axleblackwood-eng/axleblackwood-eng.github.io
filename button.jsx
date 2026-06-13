import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import AuthCallback from "@/pages/AuthCallback";
import AppShell from "@/components/AppShell";
import Dashboard from "@/pages/Dashboard";
import Headmates from "@/pages/Headmates";
import MemberDetail from "@/pages/MemberDetail";
import Journal from "@/pages/Journal";
import Friends from "@/pages/Friends";
import SharedView from "@/pages/SharedView";
import CalendarPage from "@/pages/CalendarPage";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Supporting from "@/pages/Supporting";

function Router() {
  const location = useLocation();
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/share/:token" element={<SharedView />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/headmates" element={<Headmates />} />
        <Route path="/headmates/:id" element={<MemberDetail />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/supporting" element={<Supporting />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Router />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
