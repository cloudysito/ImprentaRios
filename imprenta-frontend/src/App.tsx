import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import GestionarPedidosPage from "./pages/GestionarPedidosPage";
import CapturarPedido from "./pages/CapturarPedido.tsx";
import RegistrarDisenio from "./pages/RegistrarArchivoDiseno.tsx";
import LoginPage from "./pages/LoginPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/login"} element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" />
          <Route path="/calendario" />
          <Route path="/cronograma" />
          <Route path={"/pedidos"} element={<GestionarPedidosPage />} />
          <Route path="/pedidos/nuevo" element={<CapturarPedido />} />
          <Route
            path="/archivos-de-diseno/registrar"
            element={<RegistrarDisenio />}
          />
          <Route path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
