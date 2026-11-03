import {
  Calendar,
  AlignLeft,
  FileText,
  Plus,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "../styles/SideBar.css";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}
interface SideBarProps {
  userName: string;
  userRole: string;
  sidebarOpen?: boolean;
  onCloseSidebar?: () => void;
  onLogout?: () => void;
}
const navItems: NavItem[] = [
  { to: "/calendario", label: "Calendario", icon: Calendar },
  { to: "/cronograma", label: "Cronograma", icon: AlignLeft },
  { to: "/pedidos", label: "Pedidos", icon: FileText },
  { to: "/pedidos/nuevo", label: "Capturar pedido", icon: Plus },
];

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const Sidebar = ({
  userName,
  userRole,
  sidebarOpen = false,
  onCloseSidebar,
  onLogout,
}: SideBarProps) => {
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <h1>Imprenta Ríos</h1>
        <span>Gestión operativa</span>
      </div>

      <nav>
        <ul className="sidebar-menu">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                onClick={onCloseSidebar}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} strokeWidth={1.75} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-bottom">
        <button type="button" className="sidebar-link sidebar-logout" onClick={onLogout}>
          <LogOut size={18} strokeWidth={1.75} />
          <span>Cerrar sesión</span>
        </button>

        <div className="sidebar-footer">
          <div className="sidebar-avatar" aria-hidden="true">
            {getInitials(userName)}
          </div>
          <div className="sidebar-user">
            <span className="sidebar-user-name">{userName}</span>
            <span className="sidebar-user-role">{userRole}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
