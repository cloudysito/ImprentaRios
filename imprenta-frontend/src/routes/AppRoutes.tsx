import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import LoginPage from "../pages/LoginPage";
import ConsultarCalendario from "../pages/ConsultarCalendario";
import CalendarioPage from "../pages/CalendarioPage";
import ConsultarCronograma from "../pages/ConsultarCronograma";
import GenerarCronogramaPage from "../pages/GenerarCronogramaPage";
import GestionarPedidosPage from "../pages/GestionarPedidosPage";
import CapturarPedido from "../pages/CapturarPedido";
import RegistrarDisenio from "../pages/RegistrarArchivoDiseno";
import GestionarArchivosDisenoPage from "../pages/GestionarArchivosDisenoPage";
import VerificarProgresoPage from "../pages/VerificarProgresoPage";
import GestionarStockPage from "../pages/GestionarStockPage";
import GestionarMantenimientoPage from "../pages/GestionarMantenimientoPage";
import GestionarEmpleadosPage from "../pages/GestionarEmpleadosPage";
import GestionarClientesPage from "../pages/GestionarClientesPage";
import "../styles/404-error.tiki.css";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/calendario" replace />} />
        <Route path="/calendario" element={<ConsultarCalendario />} />
        <Route path="/calendario/generar" element={<CalendarioPage />} />
        <Route path="/cronograma" element={<ConsultarCronograma />} />
        <Route path="/cronograma/generar" element={<GenerarCronogramaPage />} />
        <Route path="/pedidos" element={<GestionarPedidosPage />} />
        <Route path="/pedidos/nuevo" element={<CapturarPedido key="nuevo" />} />
        <Route path="/archivos-de-diseno" element={<GestionarArchivosDisenoPage />} />
        <Route path="/archivos-de-diseno/registrar" element={<RegistrarDisenio />} />
          <Route path="/pedidos/:id/editar" element={<CapturarPedido key="editar" />} />
        <Route path="/taller" element={<VerificarProgresoPage />} />
        <Route path="/inventario" element={<GestionarStockPage />} />
        <Route path="/mantenimiento" element={<GestionarMantenimientoPage />} />
        <Route path="/empleados" element={<GestionarEmpleadosPage />} />
        <Route path="/clientes" element={<GestionarClientesPage />} />

        <Route
          path="*"
          element={
            <div className="404-error-page">
              <h2>404 - Página no encontrada</h2>
              <p>La página que estás buscando no existe.</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}