import { img, titleOf, yearOf } from "../tmdb.js";

export function Row({ title, children }) {
  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-track">{children}</div>
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
