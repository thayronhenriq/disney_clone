import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MAX_PROFILES, useProfiles } from "../profiles.jsx";
import Avatar from "../Avatar.jsx";

export default function ProfileSelect() {
  const { list, select } = useProfiles();
  const nav = useNavigate();
  const [editing, setEditing] = useState(false);

  // Primeiro acesso: nenhum perfil ainda, vai direto para a criação
  useEffect(() => {
    if (list.length === 0) nav("/perfil/novo", { replace: true, state: { first: true } });
  }, [list.length, nav]);

  const open = (p) => {
    if (editing) return nav(`/perfil/${p.id}`);
    select(p.id);
    nav("/");
  };

  return (
    <main className="screen select">
      <button className="top-action" onClick={() => setEditing((e) => !e)}>
        {editing ? "CONCLUÍDO" : "EDITAR PERFIS"}
      </button>
      <h1>{editing ? "Editar perfis" : "Quem vai assistir?"}</h1>

      <div className="profile-grid">
        {list.map((p) => (
          <button key={p.id} className="profile-tile" onClick={() => open(p)}>
            <Avatar index={p.avatar}>
              {editing && <span className="edit-badge">✎</span>}
            </Avatar>
            <span className="profile-name">{p.name}</span>
            {p.junior && <span className="chip">Júnior</span>}
          </button>
        ))}
        {list.length < MAX_PROFILES && (
          <button className="profile-tile" onClick={() => nav("/perfil/novo")}>
            <div className="avatar add" style={{ width: 125, height: 125 }}>+</div>
            <span className="profile-name">Adicionar perfil</span>
          </button>
        )}
      </div>
    </main>
  );
}
