import { useNavigate } from "react-router-dom";
import { useProfiles } from "../profiles.jsx";
import Avatar from "../Avatar.jsx";

const TABS = [
  ["Início", "⌂"], ["Ao Vivo", "ϟ"], ["Minha Lista", "⊞"],
  ["Filmes", "▤"], ["Séries", "▭"], ["Originais", "★"],
];

export default function TopNav() {
  const { active, leave } = useProfiles();
  const nav = useNavigate();
  return (
    <header className="topnav">
      <button className="nav-avatar" aria-label="Trocar perfil" onClick={() => { leave(); nav("/perfis"); }}>
        <Avatar index={active.avatar} size={36} />
      </button>
      <nav>
        {TABS.map(([label, icon]) => (
          <button key={label} className={`nav-item ${label === "Início" ? "on" : ""}`}>
            <span aria-hidden>{icon}</span><b>{label}</b>
          </button>
        ))}
      </nav>
      <button className="nav-search" aria-label="Buscar">⌕</button>
    </header>
  );
}
