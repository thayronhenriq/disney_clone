import { useNavigate } from "react-router-dom";
import { useProfiles } from "../profiles.jsx";
import Avatar from "../Avatar.jsx";

// Placeholder: aqui entram banner, carrosséis e catálogo do TMDB nas próximas etapas.
export default function Home() {
  const { active, leave } = useProfiles();
  const nav = useNavigate();
  return (
    <main className="screen home">
      <header className="home-bar">
        <strong>Disney Clone</strong>
        <button className="mini-profile" onClick={() => { leave(); nav("/perfis"); }}>
          <Avatar index={active.avatar} size={36} />
          <span>Trocar perfil</span>
        </button>
      </header>
      <h1>Olá, {active.name}</h1>
      <p className="lead">Tela inicial em construção. Os dados deste perfil ficam separados dos demais.</p>
    </main>
  );
}
