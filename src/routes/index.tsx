import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FlowerRain, pedirPermisoSacudida } from "@/components/FlowerRain";
import { LyricsBar } from "@/components/LyricsBar";
import { Letter } from "@/components/Letter";
import { ScratchLetter } from "@/components/ScratchLetter";
import { MusicLetter } from "@/components/MusicLetter";
import { Button } from "@/components/ui/button";
import fondo from "@/assets/girasoles.asset.json";
import cancion from "@/assets/girasol.mp3.asset.json";
import personaje from "@/assets/personaje-ramo.png";
import finalYoshiki from "@/assets/final-yoshiki-claro.png.asset.json";

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

const ETAPAS = 5;

function Pagina() {
  const [etapa, setEtapa] = useState(0);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [rascaLista, setRascaLista] = useState(false);
  const [fondoSonando, setFondoSonando] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Intento de reproducción automática al abrir; si el navegador la bloquea,
  // arranca con el primer toque en "siguiente".
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setAudioEl(a);
    a.volume = 0.85;
    a.play().then(() => setFondoSonando(true)).catch(() => {});
  }, []);

  const avanzar = async () => {
    const a = audioRef.current;
    if (a && a.paused) {
      a.volume = 0.85;
      a.play().then(() => setFondoSonando(true)).catch(() => {});
    }
    if (etapa === 0) await pedirPermisoSacudida();
    setEtapa((e) => Math.min(e + 1, ETAPAS - 1));
  };

  const repetir = () => {
    if (audioRef.current) audioRef.current.currentTime = 0;
    setRascaLista(false);
    setEtapa(0);
  };

  const controlarAudioEspecial = (playing: boolean) => {
    const background = audioRef.current;
    if (!background) return;
    if (playing) {
      background.pause();
      setFondoSonando(false);
    } else background.play().then(() => setFondoSonando(true)).catch(() => {});
  };

  return (
    <div className="escena">
      <div className="fondo" style={{ backgroundImage: `url(${fondo.url})` }} />
      <div className="fondo-velo" />
      {etapa === 4 && <div className="fondo-final" style={{ backgroundImage: `url(${finalYoshiki.url})` }} />}

      <audio ref={audioRef} src={cancion.url} loop preload="auto" playsInline />

      <FlowerRain active={etapa >= 1} delicate />

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

        {etapa === 1 && <Letter onClose={() => undefined} />}

        {etapa === 2 && (
          <ScratchLetter onComplete={() => setRascaLista(true)} />
        )}

        {etapa === 3 && (
          <MusicLetter onPlayback={controlarAudioEspecial} />
        )}

        {etapa === 4 && (
          <section className="etapa etapa-final">
            <h2>Feliz día, Key</h2>
            <p className="mensaje-final">
              Te amo aunque tú ya no me ames. Siempre estarás en mi corazón, y esto hace que
              se disfrute el amor; de eso trata el amor. Aunque ya te perdí del todo, siempre te
              voy a amar. Prometí que tú serías mi última novia; si no eres tú, no es nadie. Te
              extraño, aunque parece que ya estás siendo feliz con otro chico. Solo quería decirte
              que me dolió hacer este sitio, pero te amo jsjsjs xd. Te amo, adiós.
            </p>
            <Button type="button" className="btn-siguiente" onClick={repetir}>
              repetir <span className="flecha">--&gt;</span>
            </Button>
          </section>
        )}

        {etapa < ETAPAS - 1 && (etapa !== 2 || rascaLista) && (
          <Button type="button" className="btn-siguiente" onClick={avanzar}>
            siguiente <span className="flecha">--&gt;</span>
          </Button>
        )}

        <div className="pasos" aria-hidden>
          {Array.from({ length: ETAPAS }).map((_, i) => (
            <span key={i} className={i <= etapa ? "paso on" : "paso"} />
          ))}
        </div>
        <footer className="creditos">creador:over_lord.7</footer>
      </main>

      <LyricsBar audio={audioEl} />
    </div>
  );
}
