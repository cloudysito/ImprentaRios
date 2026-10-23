import "../styles/Navbar.css";

interface NavbarProps {
    section: string;
}
const Navbar = ({ section }: NavbarProps) => {
    return (
        <header className="navbar">
            <div className="navbar__content">
                <h1>{section}</h1>
            </div>
        </header>
    )
}
export default Navbar;