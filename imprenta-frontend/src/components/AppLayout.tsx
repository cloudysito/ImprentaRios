import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";
import { rolLabels } from "../services/authService";

interface RouteMeta {
  seccion?: string;
  titulo: string;
}

const routeMeta: Record<string, RouteMeta> = {
  "/": { seccion: "Inicio", titulo: "Dashboard" },
  "/calendario": { seccion: "Calendario", titulo: "Generar calendario" },
  "/cronograma": { seccion: "Cronograma", titulo: "Consultar cronograma" },
  "/pedidos": { seccion: "Seguimiento administrativo", titulo: "Gestionar pedidos" },
  "/pedidos/nuevo": { seccion: "Pedidos", titulo  : "Capturar pedido" },
  "/archivos-de-diseno/registrar": { seccion: "Archivos de diseño", titulo: "Registrar archivo de diseño" },
};


const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const { seccion, titulo } = routeMeta[location.pathname] ?? { titulo: "Imprenta Ríos" };

  return (
    <div className="app-shell">
      <Sidebar
        userName={user.nombre}
        userRole={rolLabels[user.rol] ?? user.rol}
        sidebarOpen={true}
        onLogout={logout}
      />

      <div className="content-shell">
        <Navbar seccion={seccion} titulo={titulo} userName={user.nombre} />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AppLayout;
