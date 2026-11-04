import "../../styles/Consulta.css";

interface AvisoSoloConsultaProps {
    texto: string;
}

const AvisoSoloConsulta = ({ texto }: AvisoSoloConsultaProps) => (
    <aside className="cons-tarjeta cons-tarjeta--aviso">
        <strong>Solo para consulta</strong>
        <p>{texto}</p>
    </aside>
);

export default AvisoSoloConsulta;
