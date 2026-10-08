import { img, titleOf, typeOf, yearOf } from "../tmdb.js";

// Banner largo, de destaque único, entre as fileiras
export default function Promo({ item }) {
  return (
    <section className="promo" style={{ backgroundImage: `url(${img(item.backdrop_path, "w1280")})` }}>
      <div className="promo-copy">
        <h2>{titleOf(item)}</h2>
        <p>{item.overview}</p>
        <small>{yearOf(item)} • {typeOf(item) === "movie" ? "Filme" : "Série"}</small>
        <button className="btn-details">DETALHES</button>
      </div>
    </section>
  );
}
