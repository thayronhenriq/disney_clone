import { createContext, useContext, useState } from "react";

// Cada perfil guarda seus próprios dados em "dp:data:<id>" (lista, progresso etc.)
const K_LIST = "dp:profiles";
const K_ACTIVE = "dp:active";
const read = (k, fb) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const MAX_PROFILES = 7;

export const AVATARS = [
  { emoji: "🦸", bg: ["#c0392b", "#6c1d1d"] },
  { emoji: "👑", bg: ["#8e44ad", "#3b1f5c"] },
  { emoji: "🧞", bg: ["#2980b9", "#123a5c"] },
  { emoji: "🐉", bg: ["#27ae60", "#0f4d2a"] },
  { emoji: "🚀", bg: ["#34495e", "#10161d"] },
  { emoji: "🦁", bg: ["#e67e22", "#7a3b0a"] },
  { emoji: "🧜", bg: ["#16a0b8", "#0a4654"] },
  { emoji: "🐻", bg: ["#a0522d", "#4a2410"] },
  { emoji: "🤖", bg: ["#7f8c8d", "#2c3436"] },
  { emoji: "🧙", bg: ["#5b3fd1", "#241466"] },
  { emoji: "🐼", bg: ["#2d3748", "#0e1118"] },
  { emoji: "🌟", bg: ["#d4a017", "#5e4506"] },
];

const Ctx = createContext(null);
export const useProfiles = () => useContext(Ctx);

export function ProfilesProvider({ children }) {
  const [list, setList] = useState(() => read(K_LIST, []));
  const [activeId, setActive] = useState(() => read(K_ACTIVE, null));

  const persist = (next) => { setList(next); write(K_LIST, next); };

  const api = {
    list,
    active: list.find((p) => p.id === activeId) || null,
    select(id) { setActive(id); write(K_ACTIVE, id); },
    leave() { setActive(null); localStorage.removeItem(K_ACTIVE); },
    add(data) {
      const p = { id: crypto.randomUUID(), ...data };
      persist([...list, p]);
      return p;
    },
    update(id, data) { persist(list.map((p) => (p.id === id ? { ...p, ...data } : p))); },
    remove(id) {
      persist(list.filter((p) => p.id !== id));
      localStorage.removeItem(`dp:data:${id}`);
      if (id === activeId) api.leave();
    },
    // Dados separados por perfil
    getData: (id, fb = {}) => read(`dp:data:${id}`, fb),
    setData: (id, v) => write(`dp:data:${id}`, v),
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
