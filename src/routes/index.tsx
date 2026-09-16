import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FlowerRain, pedirPermisoSacudida } from "@/components/FlowerRain";
import { LyricsBar } from "@/components/LyricsBar";
import { Letter } from "@/components/Letter";
import fondo from "@/assets/girasoles.asset.json";
import cancion from "@/assets/girasol.mp3.asset.json";
import personaje from "@/assets/personaje-ramo.png";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pagina,
});

const ETAPAS = 3;

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

  const repetir = () => {
    if (audioRef.current) audioRef.current.currentTime = 0;
    setEtapa(0);
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
            <img
              className="personaje-portada"
              src={personaje}
              alt="Personaje sosteniendo un ramo de flores amarillas"
            />
          </section>
        )}

        {etapa === 1 && (
          <section className="etapa">
            <h2>Te escribí algo</h2>
            <Letter />
          </section>
        )}

        {etapa === 2 && (
          <section className="etapa etapa-final">
            <h2>Feliz día, Key</h2>
            <p className="mensaje-final">
              Te amo aunque tú ya no me ames. Siempre estarás en mi corazón, y esto hace que
              se disfrute el amor; de eso trata el amor. Te amo, adiós.
            </p>
            <button type="button" className="btn-siguiente" onClick={repetir}>
              repetir <span className="flecha">--&gt;</span>
            </button>
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
        <footer className="creditos">uknown creador: uknown</footer>
      </main>

      <LyricsBar audio={audioEl} />
    </div>
  );
}
