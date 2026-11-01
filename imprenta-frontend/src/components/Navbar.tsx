import { useState } from "react";
import "../styles/Navbar.css";

interface NavbarProps {
  seccion?: string;
  titulo: string;
  userName?: string;
  fecha?: Date;
}

const formatDate = (date: Date) => {
  const weekday = date.toLocaleDateString("es-MX", { weekday: "long" });
  const month = date.toLocaleDateString("es-MX", { month: "long" });
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${date.getDate()} de ${month}`;
};

const Navbar = ({ seccion, titulo, userName, fecha }: NavbarProps) => {
  const [hoy] = useState(() => new Date());
  const firstName = userName?.trim().split(/\s+/)[0];

  return (
    <header className="navbar">
      <div className="navbar__heading">
        {seccion && <span className="navbar__section">{seccion}</span>}
        <h1 className="navbar__title">{titulo}</h1>
      </div>

      <div className="navbar__user">
        {firstName && <span className="navbar__greeting">Hola, {firstName}</span>}
        <span className="navbar__date">{formatDate(fecha ?? hoy)}</span>
      </div>
    </header>
  );
};
export default Navbar;
