import { useEffect, useState } from "react";
import { useProfiles } from "../profiles.jsx";
import { hasKey, tmdb } from "../tmdb.js";
import TopNav from "../components/TopNav.jsx";
import Hero from "../components/Hero.jsx";
import Promo from "../components/Promo.jsx";
import { ContinueCard, Poster, Row } from "../components/Row.jsx";
import "../home.css";
import "../rows.css";

const BRANDS = ["Para Você", "Disney+", "Hulu", "ESPN"];
const withPoster = (l = []) => l.filter((x) => x.poster_path);

export default function Home() {
  const { active, getData, setData } = useProfiles();
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const [brand, setBrand] = useState(BRANDS[0]);

  useEffect(() => {
    if (!hasKey) return;
    let off = false;
    (async () => {
      try {
        const q = { sort_by: "popularity.desc" };
        const [pop, trend, horror, anim, gm, gt, air, top, kw] = await Promise.all([
          tmdb("/tv/popular"), tmdb("/trending/all/week"),
          tmdb("/discover/movie", { ...q, with_genres: 27 }),
          tmdb("/discover/movie", { ...q, with_genres: 16 }),
          tmdb("/genre/movie/list"), tmdb("/genre/tv/list"),
          tmdb("/tv/on_the_air"), tmdb("/tv/top_rated"),
          tmdb("/search/keyword", { query: "workplace" }).catch(() => ({ results: [] })),
        ]);
        const genres = Object.fromEntries([...gm.genres, ...gt.genres].map((g) => [g.id, g.name]));

        // Dados separados por perfil. Continue Assistindo e Minha Lista começam com
        // dados de demonstração; depois o player e o botão "+" vão gravar os reais.
        const data = getData(active.id, {});
        if (!data.continue) {
          const prog = [0.7, 0.1, 0.4, 0.05, 0.55, 0.25], left = [4, 30, 27, 12, 8, 40];
          data.continue = air.results.filter((x) => x.backdrop_path).slice(0, 6).map((x, n) => ({
            id: x.id, name: x.name, backdrop: x.backdrop_path, progress: prog[n], left: left[n], ep: `T1:E${n + 2}`,
          }));
        }
        if (!data.list) {
          data.list = withPoster(top.results).slice(0, 12).map(({ id, name, poster_path, genre_ids, first_air_date }) =>
            ({ id, name, poster_path, genre_ids, first_air_date }));
        }
        setData(active.id, data);

        // "Comédias no Trabalho" e "Porque você assistiu a …"
        const kid = kw.results?.[0]?.id;
        const base = data.continue[0];
        const [work, rec] = await Promise.all([
          tmdb("/discover/tv", { ...q, with_genres: 35, ...(kid ? { with_keywords: kid } : {}) }).catch(() => ({ results: [] })),
          base ? tmdb(`/tv/${base.id}/recommendations`).catch(() => ({ results: [] })) : { results: [] },
        ]);
        const withBackdrop = air.results.filter((x) => x.backdrop_path);

        if (!off) setD({
          hero: pop.results.filter((x) => x.backdrop_path).slice(0, 6),
          rec: withPoster(trend.results), horror: withPoster(horror.results), anim: withPoster(anim.results),
          work: withPoster(work.results), because: withPoster(rec.results), becauseName: base?.name,
          promo: withBackdrop[6] || withBackdrop[0], genres, cont: data.continue, list: data.list,
        });
      } catch (e) { if (!off) setErr(e.message); }
    })();
    return () => { off = true; };
  }, [active.id]);

  const posters = (items) => items.map((i) => <Poster key={i.id} item={i} genres={d.genres} />);

  return (
    <div className="home-page">
      <TopNav />
      <div className="brand-wrap">
        <div className="brands" role="tablist">
          {BRANDS.map((b) => (
            <button key={b} role="tab" aria-selected={b === brand}
              className={b === brand ? "on" : ""} onClick={() => setBrand(b)}>{b}</button>
          ))}
        </div>
      </div>

      {!hasKey && (
        <div className="notice">
          <h2>Falta a chave do TMDB</h2>
          <p>Crie um arquivo <code>.env</code> na raiz do projeto com <code>VITE_TMDB_KEY=sua_chave</code> e reinicie o <code>npm run dev</code>.
            Na Vercel, adicione a mesma variável em Settings → Environment Variables e faça um novo deploy.</p>
        </div>
      )}
      {err && <div className="notice"><h2>Não foi possível carregar o catálogo</h2><p>{err}. Confira se a chave do TMDB está certa.</p></div>}
      {hasKey && !d && !err && <p className="loading">Carregando…</p>}

      {d && (
        <>
          <Hero items={d.hero} />
          <Row title="Recomendado para Você">{posters(d.rec)}</Row>
          {d.cont.length > 0 && (
            <Row title="Continue Assistindo" withText>
              {d.cont.map((i) => <ContinueCard key={i.id} item={i} />)}
            </Row>
          )}
          {d.work.length > 0 && <Row title="Comédias no Trabalho">{posters(d.work)}</Row>}
          {d.because.length > 0 && <Row title={`Porque você assistiu a ${d.becauseName}`}>{posters(d.because)}</Row>}
          {d.promo && <Promo item={d.promo} />}
          {d.list.length > 0 && <Row title="Minha Lista">{posters(d.list)}</Row>}
          <Row title="Terror">{posters(d.horror)}</Row>
          <Row title="Animação">{posters(d.anim)}</Row>
        </>
      )}
    </div>
  );
}
