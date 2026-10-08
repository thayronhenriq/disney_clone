import { useEffect, useRef, useState } from "react";
import { img, titleOf, yearOf } from "../tmdb.js";

// Fileira com setas clicáveis (aparecem ao passar o mouse; no celular basta arrastar)
export function Row({ title, children, withText = false }) {
  const ref = useRef(null);
  const [can, setCan] = useState({ l: false, r: false });

  const check = () => {
    const el = ref.current;
    if (!el) return;
    const l = el.scrollLeft > 4;
    const r = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setCan((c) => (c.l === l && c.r === r ? c : { l, r }));
  };
  useEffect(() => {
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const go = (dir) => ref.current.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className={`row-wrap ${withText ? "with-text" : ""}`}>
        {can.l && <button className="row-arrow left" onClick={() => go(-1)} aria-label="Anterior">‹</button>}
        <div className="row-track" ref={ref} onScroll={check}>{children}</div>
        {can.r && <button className="row-arrow right" onClick={() => go(1)} aria-label="Próximos">›</button>}
      </div>
    </section>
  );
}

export function Poster({ item, genres }) {
  const g = (item.genre_ids || []).slice(0, 2).map((id) => genres[id]).filter(Boolean).join(", ");
  return (
    <button className="card poster">
      <img loading="lazy" src={img(item.poster_path)} alt={titleOf(item)} />
      <span className="poster-meta">{[yearOf(item), g].filter(Boolean).join(" • ")}</span>
    </button>
  );
}

export function ContinueCard({ item }) {
  return (
    <div className="card-wrap">
      <button className="card thumb">
        <img loading="lazy" src={img(item.backdrop, "w780")} alt={item.name} />
        <i className="progress" style={{ width: `${Math.round(item.progress * 100)}%` }} />
      </button>
      <p className="c-left">Restam {item.left}min</p>
      <p className="c-title">{item.name}</p>
      <p className="c-ep">{item.ep}</p>
    </div>
  );
}
