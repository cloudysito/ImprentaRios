import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import GestionarPedidosPage from "./pages/GestionarPedidosPage";
import CapturarPedido from "./pages/CapturarPedido.tsx";
import RegistrarDisenio from "./pages/RegistrarArchivoDiseno.tsx";
import CalendarioPage from "./pages/CalendarioPage.tsx";
import GenerarCronogramaPage from "./pages/GenerarCronogramaPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import VerificarProgresoPage from "./pages/VerificarProgresoPage";
import GestionarStockPage from "./pages/GestionarStockPage";
import GestionarMantenimientoPage from "./pages/GestionarMantenimientoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/pedidos" replace />} />
          <Route path="/calendario" element={<CalendarioPage />} />
          <Route path="/calendario/generar" element={<CalendarioPage />} />
          <Route path="/cronograma" element={<GenerarCronogramaPage />} />
          <Route path="/cronograma/generar" element={<GenerarCronogramaPage />} />
          <Route path="/pedidos" element={<GestionarPedidosPage />} />
          <Route path="/pedidos/nuevo" element={<CapturarPedido />} />
          <Route
            path="/archivos-de-diseno/registrar"
            element={<RegistrarDisenio />}
          />
          <Route path="/taller" element={<VerificarProgresoPage />} />
          <Route path="/inventario" element={<GestionarStockPage />} />
          <Route path="/mantenimiento" element={<GestionarMantenimientoPage />} />
          <Route path="*" element={<Navigate to="/pedidos" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
