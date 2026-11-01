import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/SideBar";
import Navbar from "./components/Navbar";
import GestionarPedidosPage from "./pages/GestionarPedidosPage";

interface RouteMeta {
  seccion?: string;
  titulo: string;
}

const routeMeta: Record<string, RouteMeta> = {
  "/": { seccion: "Inicio", titulo: "Dashboard" },
  "/calendario": { seccion: "Calendario", titulo: "Generar calendario" },
  "/cronograma": { seccion: "Cronograma", titulo: "Consultar cronograma" },
  "/pedidos": { seccion: "Seguimiento administrativo", titulo: "Gestionar pedidos" },
  "/pedidos/nuevo": { seccion: "Pedidos", titulo: "Capturar pedido" },
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
            <Route path="/calendario"/>
            <Route path="/cronograma" />
            <Route path="/pedidos" element={<GestionarPedidosPage />} />
            <Route path="/pedidos/nuevo" />
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
