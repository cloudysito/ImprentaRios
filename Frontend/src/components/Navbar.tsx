import "../styles/Navbar.css";

interface NavbarProps {
    seccion: string;
}
const Navbar = ({ seccion }: NavbarProps) => {
    return (
        <header className="navbar">
            <div className="navbar__content">
                <h1>{seccion}</h1>
            </div>
        </header>
    )
}
export default Navbar;