import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/SideBar";
import Navbar from "./components/Navbar";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/calendario": "Calendario",
  "/cronograma": "Cronograma",
  "/pedidos": "Pedidos",
  "/pedidos/nuevo": "Nuevo pedido",
};

function AppLayout() {
  const location = useLocation();
  const pageTitle = routeTitles[location.pathname] ?? "Imprenta Ríos";

  return (
    <div className="app-shell">
      <Sidebar
        userName="John Doe"
        userRole="Admin"
        sidebarOpen={true}
        onCloseSidebar={() => console.log("Sidebar closed")}
      />

      <div className="content-shell">
        <Navbar section={pageTitle} />

        <main className="page-content">
          <Routes>
            <Route path="/"/>
            <Route path="/calendario"/>
            <Route path="/cronograma" />
            <Route path="/pedidos"/>
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
