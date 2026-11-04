import {
  Calendar,
  AlignLeft,
  FileText,
  Plus,
  LogOut,
  Cog,
  FolderOpen,
  CalendarCheck,
  ListTodo,
  Package,
  Wrench,
  Users,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Rol } from "../services/authService";
import "../styles/SideBar.css";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface SeccionMenu {
  titulo?: string;
  items: NavItem[];
}

interface SideBarProps {
  userName: string;
  userRole: string;
  rol?: Rol;
  sidebarOpen?: boolean;
  onCloseSidebar?: () => void;
  onLogout?: () => void;
}

const calendario: NavItem = { to: "/calendario", label: "Calendario", icon: Calendar };
const cronograma: NavItem = { to: "/cronograma", label: "Cronograma", icon: AlignLeft };

const MENU: Record<Rol, SeccionMenu[]> = {
  SECRETARIA: [
    {
      titulo: "General",
      items: [
        calendario,
        cronograma,
        { to: "/pedidos/nuevo", label: "Capturar pedido", icon: Plus },
        { to: "/pedidos", label: "Pedidos", icon: FileText },
      ],
    },
  ],
  DISENADOR: [
    {
      titulo: "General",
      items: [
        calendario,
        cronograma,
        { to: "/archivos-de-diseno/registrar", label: "Archivos de diseño", icon: FolderOpen },
      ],
    },
  ],
  MANUFACTURA: [{ items: [calendario, cronograma, { to: "/taller", label: "Taller", icon: Cog }] }],
  DUENO: [
    {
      titulo: "General",
      items: [calendario, cronograma] },
    {
      titulo: "Pedidos",
      items: [
        { to: "/pedidos", label: "Pedidos", icon: FileText },
        { to: "/pedidos/nuevo", label: "Capturar pedido", icon: Plus },
        { to: "/archivos-de-diseno/registrar", label: "Archivos de diseño", icon: FolderOpen },
      ],
    },
    {
      titulo: "Administración",
      items: [
        { to: "/calendario/generar", label: "Programar entregas", icon: CalendarCheck },
        { to: "/cronograma/generar", label: "Asignar cronograma", icon: ListTodo },
        { to: "/inventario", label: "Inventario", icon: Package },
        { to: "/mantenimiento", label: "Mantenimiento", icon: Wrench },
        { to: "/empleados", label: "Empleados", icon: Users },
      ],
    },
  ],
};

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
  rol,
  sidebarOpen = false,
  onCloseSidebar,
  onLogout,
}: SideBarProps) => {
  const secciones = MENU[rol ?? "SECRETARIA"] ?? MENU.SECRETARIA;

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <h1>Imprenta Ríos</h1>
        <span>Gestión operativa</span>
      </div>

      <nav>
        {secciones.map((seccion, i) => (
          <div key={seccion.titulo ?? i} className="sidebar-grupo">
            {seccion.titulo && <span className="sidebar-seccion">{seccion.titulo}</span>}
            <ul className="sidebar-menu">
              {seccion.items.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    onClick={onCloseSidebar}
                    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
