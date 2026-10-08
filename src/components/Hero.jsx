import { useRef, useState } from "react";
import { img, titleOf, typeOf, yearOf } from "../tmdb.js";

export default function Hero({ items }) {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const step = () => ref.current.children[0].offsetWidth + 20;
  const go = (dir) => ref.current.scrollBy({ left: dir * step(), behavior: "smooth" });

  return (
    <section className="hero" aria-label="Destaques">
      <div className="hero-track" ref={ref} onScroll={() => setI(Math.round(ref.current.scrollLeft / step()))}>
        {items.map((it) => (
          <article key={it.id} className="hero-slide"
            style={{ backgroundImage: `url(${img(it.backdrop_path, "w1280")})` }}>
            <div className="hero-copy">
              <span className="badge">Em alta</span>
              <h2>{titleOf(it)}</h2>
              <p>{it.overview}</p>
              <small>{yearOf(it)} • {typeOf(it) === "tv" ? "Série" : "Filme"}</small>
            </div>
          </article>
        ))}
      </div>
      {i > 0 && <button className="hero-arrow prev" onClick={() => go(-1)} aria-label="Anterior">‹</button>}
      {i < items.length - 1 && <button className="hero-arrow next" onClick={() => go(1)} aria-label="Próximo">›</button>}
      <div className="dots">
        {items.map((_, n) => <span key={n} className={n === i ? "on" : ""} />)}
      </div>
    </section>
  );
}
