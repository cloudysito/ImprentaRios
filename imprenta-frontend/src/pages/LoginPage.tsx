import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "../styles/LoginPage.css";

// Fuera del componente para no llamar a Date en cada render
const ANIO_ACTUAL = new Date().getFullYear();

const LoginPage = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Iniciar sesión | Imprenta Ríos";
  }, []);

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async () => {
    if (!usuario.trim() || !password) {
      setError("Escribe tu usuario y tu contraseña");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(usuario.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <aside className="login__aside">
        <div className="login__brand">
          <h1>Imprenta Ríos</h1>
          <span>Gestión operativa</span>
        </div>

        <div className="login__pitch">
          <p className="login__quote">Cada pedido, en su lugar y a tiempo.</p>
          <p className="login__pitch-text">
            Captura pedidos, organiza el calendario de producción y consulta el
            avance de cada trabajo desde un solo lugar.
          </p>
        </div>

        <span className="login__copy">© {ANIO_ACTUAL} Imprenta Ríos</span>
      </aside>

      <main className="login__main">
        <form
          className="login__card"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="login__mobile-brand">Imprenta Ríos</div>

          <span className="login__eyebrow">Iniciar sesión</span>
          <h2 className="login__title">Entra a tu cuenta</h2>
          <p className="login__subtitle">Usa el usuario que te asignó la imprenta.</p>

          {error && (
            <div className="login__error" role="alert">
              <AlertCircle size={16} strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <label className="login__field">
            <span>Usuario</span>
            <input
              type="text"
              autoComplete="username"
              autoFocus
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="ej. mruiz"
            />
          </label>

          <label className="login__field">
            <span>Contraseña</span>
            <div className="login__password">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="login__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button type="submit" className="login__submit" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </main>
    </div>
  );
};
export default LoginPage;
