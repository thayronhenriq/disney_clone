import { useEffect, useState } from "react";
import { useProfiles } from "../profiles.jsx";
import { hasKey, tmdb } from "../tmdb.js";
import TopNav from "../components/TopNav.jsx";
import Hero from "../components/Hero.jsx";
import { ContinueCard, Poster, Row } from "../components/Row.jsx";
import "../home.css";

const BRANDS = ["Para Você", "Disney+", "Hulu", "ESPN"];
const withPoster = (l) => l.filter((x) => x.poster_path);

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
        const [pop, trend, horror, anim, gm, gt, air] = await Promise.all([
          tmdb("/tv/popular"), tmdb("/trending/all/week"),
          tmdb("/discover/movie", { ...q, with_genres: 27 }),
          tmdb("/discover/movie", { ...q, with_genres: 16 }),
          tmdb("/genre/movie/list"), tmdb("/genre/tv/list"), tmdb("/tv/on_the_air"),
        ]);
        const genres = Object.fromEntries([...gm.genres, ...gt.genres].map((g) => [g.id, g.name]));

        // "Continue assistindo" é separado por perfil. Por enquanto começa com dados de demonstração;
        // quando o player existir, ele vai gravar o progresso real aqui.
        const data = getData(active.id, {});
        if (!data.continue) {
          const prog = [0.7, 0.1, 0.4, 0.05, 0.55, 0.25], left = [4, 30, 27, 12, 8, 40];
          data.continue = air.results.filter((x) => x.backdrop_path).slice(0, 6).map((x, n) => ({
            id: x.id, name: x.name, backdrop: x.backdrop_path, progress: prog[n], left: left[n], ep: `T1:E${n + 2}`,
          }));
          setData(active.id, data);
        }
        if (!off) setD({
          hero: pop.results.filter((x) => x.backdrop_path).slice(0, 6),
          rec: withPoster(trend.results), horror: withPoster(horror.results),
          anim: withPoster(anim.results), genres, cont: data.continue,
        });
      } catch (e) { if (!off) setErr(e.message); }
    })();
    return () => { off = true; };
  }, [active.id]);

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
          <Row title="Recomendado para Você">
            {d.rec.map((i) => <Poster key={i.id} item={i} genres={d.genres} />)}
          </Row>
          {d.cont.length > 0 && (
            <Row title="Continue Assistindo">
              {d.cont.map((i) => <ContinueCard key={i.id} item={i} />)}
            </Row>
          )}
          <Row title="Terror">
            {d.horror.map((i) => <Poster key={i.id} item={i} genres={d.genres} />)}
          </Row>
          <Row title="Animação">
            {d.anim.map((i) => <Poster key={i.id} item={i} genres={d.genres} />)}
          </Row>
        </>
      )}
    </div>
  );
}
