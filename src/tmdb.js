const KEY = import.meta.env.VITE_TMDB_KEY || "";
export const hasKey = KEY.length > 0;
const BASE = "https://api.themoviedb.org/3";

export const img = (p, size = "w500") => (p ? `https://image.tmdb.org/t/p/${size}${p}` : "");

export async function tmdb(path, params = {}) {
  const qs = new URLSearchParams({ language: "pt-BR", ...params });
  const headers = {};
  if (KEY.length > 50) headers.Authorization = `Bearer ${KEY}`; // token v4
  else qs.set("api_key", KEY); // chave v3
  const r = await fetch(`${BASE}${path}?${qs}`, { headers });
  if (!r.ok) throw new Error(`TMDB respondeu ${r.status}`);
  return r.json();
}

export const titleOf = (i) => i.title || i.name || "";
export const yearOf = (i) => (i.release_date || i.first_air_date || "").slice(0, 4);
export const typeOf = (i) => i.media_type || (i.title ? "movie" : "tv");
