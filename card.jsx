import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Moon, LayoutDashboard, Users, BookOpen, Heart, LogOut, Calendar, User, Settings as SettingsIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

const NavItem = ({ to, icon: Icon, label, testId }) => (
  <NavLink
    to={to}
    end
    data-testid={testId}
    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
  >
    <Icon size={16} /> {label}
  </NavLink>
);

export default function AppShell() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[color:var(--text-secondary)]" />
      </div>
    );
  }
  if (!user) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b"
        style={{
          background: "rgba(22,22,21,0.78)",
          borderColor: "var(--border-default)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Moon className="text-[color:var(--brand-highlight)]" size={18} />
            <span className="font-serif text-xl">pluralhaven</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <NavItem
              to="/dashboard"
              icon={LayoutDashboard}
              label="Home"
              testId="nav-dashboard"
            />
            <NavItem
              to="/headmates"
              icon={Users}
              label="Headmates"
              testId="nav-headmates"
            />
            <NavItem
              to="/journal"
              icon={BookOpen}
              label="Journal"
              testId="nav-journal"
            />
            <NavItem
              to="/calendar"
              icon={Calendar}
              label="Calendar"
              testId="nav-calendar"
            />
            <NavItem
              to="/friends"
              icon={Heart}
              label="Friends"
              testId="nav-friends"
            />
          </nav>
          <div className="flex items-center gap-2">
            <NavLink
              to="/profile"
              data-testid="nav-profile"
              className={({ isActive }) =>
                `nav-link !p-2 ${isActive ? "active" : ""}`
              }
              title="Profile"
            >
              <User size={15} />
            </NavLink>
            <NavLink
              to="/settings"
              data-testid="nav-settings"
              className={({ isActive }) =>
                `nav-link !p-2 ${isActive ? "active" : ""}`
              }
              title="Settings"
            >
              <SettingsIcon size={15} />
            </NavLink>
            <button
              data-testid="logout-button"
              onClick={logout}
              title="Sign out"
              className="btn-ghost !py-2 !px-3"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
        <div className="md:hidden max-w-6xl mx-auto px-3 pb-3 flex gap-1 overflow-x-auto">
          <NavItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="Home"
            testId="nav-dashboard-mobile"
          />
          <NavItem
            to="/headmates"
            icon={Users}
            label="Headmates"
            testId="nav-headmates-mobile"
          />
          <NavItem
            to="/journal"
            icon={BookOpen}
            label="Journal"
            testId="nav-journal-mobile"
          />
          <NavItem
            to="/calendar"
            icon={Calendar}
            label="Calendar"
            testId="nav-calendar-mobile"
          />
          <NavItem
            to="/friends"
            icon={Heart}
            label="Friends"
            testId="nav-friends-mobile"
          />
          <NavItem
            to="/supporting"
            icon={Heart}
            label="Supporting"
            testId="nav-supporting-mobile"
          />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <Outlet />
      </main>
    </div>
  );
}
