import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/SideBar";
import Navbar from "./components/Navbar";
import GestionarPedidosPage from "./pages/GestionarPedidosPage";
import CapturarPedido from "./pages/CapturarPedido.tsx";
import RegistrarDisenio from "./pages/RegistrarArchivoDiseno.tsx";
import CalendarioPage from "./pages/CalendarioPage.tsx";
import GenerarCronogramaPage from "./pages/GenerarCronogramaPage.tsx";

interface RouteMeta {
  seccion?: string;
  titulo: string;
}

const routeMeta: Record<string, RouteMeta> = {
  "/": { seccion: "Inicio", titulo: "Dashboard" },
  "/calendario": { seccion: "Calendario", titulo: "Generar calendario" },
  "/cronograma": { seccion: "Cronograma", titulo: "Consultar cronograma" },
  "/cronograma/generar": { seccion: "Cronograma", titulo: "Generar cronograma" },
  "/pedidos": { seccion: "Seguimiento administrativo", titulo: "Gestionar pedidos" },
  "/pedidos/nuevo": { seccion: "Pedidos", titulo: "Capturar pedido" },
  "/archivos-de-diseno/registrar": { seccion: "Archivos de diseño", titulo: "Registrar archivo de diseño" }
};

const currentUser = { name: "Marisol Ruiz", role: "Secretaria" };

function AppLayout() {
  const location = useLocation();
  const { seccion, titulo } = routeMeta[location.pathname] ?? { titulo: "Imprenta Ríos" };

  return (
    <div className="app-shell">
      <Sidebar
        userName={currentUser.name}
        userRole={currentUser.role}
        sidebarOpen={true}
        onCloseSidebar={() => console.log("Sidebar closed")}
        onLogout={() => console.log("Cerrar sesión")}
      />
      <div className="content-shell">
        <Navbar seccion={seccion} titulo={titulo} userName={currentUser.name} />
        <main className="page-content">
          <Routes>
            <Route path="/"/>
            <Route path="/calendario" element={<CalendarioPage />} />
            <Route path="/cronograma" element={<GenerarCronogramaPage />} />
            <Route path="/cronograma/generar" element={<GenerarCronogramaPage />} />
            <Route path="/pedidos" element={<GestionarPedidosPage />} />
            <Route path="/pedidos/nuevo" element={<CapturarPedido />} />
            <Route path="/archivos-de-diseno/registrar" element={<RegistrarDisenio />} />
            <Route path="*"/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
