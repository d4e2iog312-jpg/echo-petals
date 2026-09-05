import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FlowerRain, pedirPermisoSacudida } from "@/components/FlowerRain";
import { LyricsBar } from "@/components/LyricsBar";
import { Letter } from "@/components/Letter";
import fondo from "@/assets/girasoles.asset.json";
import cancion from "@/assets/girasol.mp3.asset.json";
import florAsset from "@/assets/flor.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Día de las Flores Amarillas 🌻 21 de septiembre" },
      {
        name: "description",
        content:
          "Un lugar hecho para ti: flores amarillas que caen, una carta que se abre y una canción para el 21 de septiembre.",
      },
      { property: "og:title", content: "Día de las Flores Amarillas 🌻" },
      {
        property: "og:description",
        content:
          "Flores amarillas cayendo, una carta y una canción. Para ti, este 21 de septiembre.",
      },
    ],
  }),
  component: Pagina,
});

const CARTA = [
  "Feliz día de las flores amarillas :3",
  "Quiero darte las gracias por estar ahí, por cada rato bonito y por seguir siendo parte de mis días.",
  "Hoy quería desearte un día lindo, porque te lo mereces. Ojalá esta flor te saque aunque sea una sonrisita.",
  "Me gusta que podamos seguir conociéndonos poco a poco, sin prisa. No sé qué pasará después, pero me gusta estar aquí para ti.",
];

const ETAPAS = 5;

function Pagina() {
  const [etapa, setEtapa] = useState(0);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Intento de reproducción automática al abrir; si el navegador la bloquea,
  // arranca con el primer toque en "siguiente".
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setAudioEl(a);
    a.volume = 0.85;
    a.play().catch(() => {});
  }, []);

  const avanzar = async () => {
    const a = audioRef.current;
    if (a && a.paused) {
      a.volume = 0.85;
      a.play().catch(() => {});
    }
    if (etapa === 0) await pedirPermisoSacudida();
    setEtapa((e) => Math.min(e + 1, ETAPAS - 1));
  };

  return (
    <div className="escena">
      <div className="fondo" style={{ backgroundImage: `url(${fondo.url})` }} />
      <div className="fondo-velo" />

      <audio ref={audioRef} src={cancion.url} loop preload="auto" playsInline />

      <FlowerRain active={etapa >= 1} />

      <main className="lienzo">
        {etapa === 0 && (
          <section className="etapa etapa-portada">
            <p className="kicker">21 de septiembre</p>
            <h1>
              Feliz día de las
              <span className="titulo-amarillo">flores amarillas</span>
              <span className="titulo-carita">:3</span>
            </h1>
            <img className="flor-portada" src={florAsset.url} alt="Flor amarilla en pixel art" />
            <p className="sub">
              Hice este lugar para ti. Sube el volumen, tómate tu tiempo y ve avanzando.
            </p>
          </section>
        )}

        {etapa === 1 && (
          <section className="etapa">
            <h2>Están cayendo flores para ti</h2>
            <p className="sub">
              Tócalas: se parten en dos, se marchitan y te dejan algo dicho.
            </p>
            <p className="susurro">
              y si agitas el teléfono… caen muchas más 🌼
            </p>
          </section>
        )}

        {etapa === 2 && (
          <section className="etapa">
            <h2>Antes de la carta</h2>
            <p className="sub">
              No te voy a apurar con nada. Solo quería que tuvieras un día bonito, y que
              supieras que estoy aquí.
            </p>
            <p className="susurro">sigue tocando flores si quieres 🌻</p>
          </section>
        )}

        {etapa === 3 && (
          <section className="etapa">
            <h2>Te escribí algo</h2>
            <Letter texto={CARTA} />
          </section>
        )}

        {etapa === 4 && (
          <section className="etapa etapa-final">
            <h2>
              te amo <span className="titulo-carita">🌻</span>
            </h2>
            <p className="sub">
              Gracias por llegar hasta el final. Que tu día de las flores amarillas sea
              como tú: bonito.
            </p>
            <img className="flor-portada flor-final" src={florAsset.url} alt="" />
          </section>
        )}

        {etapa < ETAPAS - 1 && (
          <button type="button" className="btn-siguiente" onClick={avanzar}>
            siguiente <span className="flecha">--&gt;</span>
          </button>
        )}

        <div className="pasos" aria-hidden>
          {Array.from({ length: ETAPAS }).map((_, i) => (
            <span key={i} className={i <= etapa ? "paso on" : "paso"} />
          ))}
        </div>
      </main>

      <LyricsBar audio={audioEl} />
    </div>
  );
}
