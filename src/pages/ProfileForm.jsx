import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AVATARS, useProfiles } from "../profiles.jsx";
import Avatar from "../Avatar.jsx";

const GENDERS = ["Feminino", "Masculino", "Não-binário", "Prefiro não informar"];

const maskDate = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
};

const validDate = (s) => {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const [, dd, mm, yyyy] = m.map(Number);
  const dt = new Date(yyyy, mm - 1, dd);
  return dt.getFullYear() === yyyy && dt.getMonth() === mm - 1 && dt.getDate() === dd && dt <= new Date() && yyyy > 1900;
};

export default function ProfileForm() {
  const { id } = useParams();
  const { state } = useLocation();
  const { list, add, update, remove, select } = useProfiles();
  const nav = useNavigate();
  const existing = id ? list.find((p) => p.id === id) : null;

  const [avatar, setAvatar] = useState(existing?.avatar ?? Math.floor(Math.random() * AVATARS.length));
  const [pickAvatar, setPickAvatar] = useState(false);
  const [name, setName] = useState(existing?.name ?? "");
  const [birth, setBirth] = useState(existing?.birth ?? "");
  const [gender, setGender] = useState(existing?.gender ?? "");
  const [junior, setJunior] = useState(existing?.junior ?? false);
  const [errors, setErrors] = useState({});

  const back = () => (list.length ? nav("/perfis") : null);

  const save = () => {
    const e = {};
    if (!name.trim()) e.name = "Digite um nome para o perfil.";
    if (!validDate(birth)) e.birth = "Use uma data válida no formato DD/MM/AAAA.";
    if (!gender) e.gender = "Escolha uma opção.";
    setErrors(e);
    if (Object.keys(e).length) return;

    const data = { name: name.trim(), avatar, birth, gender, junior };
    if (existing) {
      update(existing.id, data);
      nav("/perfis");
    } else {
      const p = add(data);
      select(p.id); // o perfil recém-criado já entra ativo
      nav("/");
    }
  };

  const del = () => {
    if (window.confirm(`Excluir o perfil "${existing.name}" e todos os dados dele?`)) {
      remove(existing.id);
      nav("/perfis");
    }
  };

  return (
    <main className="screen form">
      <header className="form-bar">
        {list.length > 0 ? (
          <button className="round" onClick={back} aria-label="Voltar">‹</button>
        ) : <span />}
        <h1>{existing ? "Editar perfil" : "Adicionar perfil"}</h1>
        <button className="save" onClick={save}>Salvar</button>
      </header>

      {state?.first && <p className="lead">Para continuar, forneça as seguintes informações.</p>}

      <button className="avatar-btn" onClick={() => setPickAvatar((v) => !v)} aria-label="Escolher avatar">
        <Avatar index={avatar} size={125}>
          <span className="edit-badge">✎</span>
        </Avatar>
      </button>

      {pickAvatar && (
        <div className="avatar-picker">
          {AVATARS.map((_, i) => (
            <button key={i} onClick={() => { setAvatar(i); setPickAvatar(false); }} aria-label={`Avatar ${i + 1}`}>
              <Avatar index={i} size={64} />
            </button>
          ))}
        </div>
      )}

      <input className="field" placeholder="Nome do perfil" value={name} maxLength={20}
        onChange={(e) => setName(e.target.value)} />
      {errors.name && <p className="error">{errors.name}</p>}

      <label className="label">DATA DE NASCIMENTO</label>
      <input className="field" placeholder="DD/MM/AAAA" inputMode="numeric" value={birth}
        onChange={(e) => setBirth(maskDate(e.target.value))} />
      {errors.birth && <p className="error">{errors.birth}</p>}

      <label className="label">GÊNERO</label>
      <select className="field" value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="" disabled>Que opção melhor descreve você?</option>
        {GENDERS.map((g) => <option key={g}>{g}</option>)}
      </select>
      {errors.gender && <p className="error">{errors.gender}</p>}

      <hr />
      <div className="junior">
        <div>
          <h2>Modo Júnior</h2>
          <p>Um perfil com conteúdo e recursos selecionados e uma interface de usuário simplificada.</p>
        </div>
        <button className={`toggle ${junior ? "on" : ""}`} role="switch" aria-checked={junior}
          onClick={() => setJunior((j) => !j)}><span /></button>
      </div>

      {existing && <button className="danger" onClick={del}>Excluir perfil</button>}
    </main>
  );
}
