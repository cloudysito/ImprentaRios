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
  "/calendario": { seccion: "Consulta sin edición", titulo: "Consultar calendario" },
  "/cronograma": { seccion: "Línea de tiempo · Consulta sin edición", titulo: "Consultar cronograma" },
  "/pedidos": { seccion: "Seguimiento administrativo", titulo: "Gestionar pedidos" },
  "/pedidos/nuevo": { seccion: "Pedidos", titulo  : "Capturar pedido" },
  "/archivos-de-diseno/registrar": { seccion: "Archivos de diseño", titulo: "Registrar archivo de diseño" },
  "/calendario/generar": { seccion: "Fechas límite de entrega", titulo: "Generar calendario" },
  "/cronograma/generar": { seccion: "Asignación de mano de obra", titulo: "Generar cronograma" },
  "/taller": { seccion: "Taller", titulo: "Verificar progreso de trabajo" },
  "/inventario": { seccion: "Inventario de materiales", titulo: "Gestionar stock" },
  "/empleados": { seccion: "Administración", titulo: "Gestionar empleados" },
  "/mantenimiento": { seccion: "Historial técnico del equipo", titulo: "Gestionar mantenimiento de maquinaria" },
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
        rol={user.rol}
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
