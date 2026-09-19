import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import cartaMusical from "@/assets/carta-musical.png.asset.json";
import audio505 from "@/assets/505-arctic-monkeys.mp3.asset.json";
import audioChachacha from "@/assets/chachacha.mp3.asset.json";
import audioLove from "@/assets/my-one-and-only-love.mp3.asset.json";

const TRACKS = [
  { title: "505", src: audio505.url, className: "pin-505" },
  { title: "Último baile", src: audioChachacha.url, className: "pin-baile" },
  { title: "My One and Only Love", src: audioLove.url, className: "pin-love" },
];

export function MusicLetter({ onPlayback }: { onPlayback: (playing: boolean) => void }) {
  const refs = useRef<Array<HTMLAudioElement | null>>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => () => onPlayback(false), [onPlayback]);

  const toggle = async (index: number) => {
    const selected = refs.current[index];
    if (!selected) return;
    if (active === index && !selected.paused) {
      selected.pause();
      setActive(null);
      onPlayback(false);
      return;
    }
    refs.current.forEach((audio, audioIndex) => {
      if (audio && audioIndex !== index) audio.pause();
    });
    try {
      await selected.play();
      setActive(index);
      onPlayback(true);
    } catch {
      setActive(null);
      onPlayback(false);
    }
  };

  return (
    <section className="etapa etapa-musical">
      <div className="carta-musical-wrap">
        <img src={cartaMusical.url} alt="Carta My Last Love para Key" />
        {TRACKS.map((track, index) => (
          <div key={track.title} className={`audio-pin ${track.className} ${active === index ? "sonando" : ""}`}>
            <audio
              ref={(node) => { refs.current[index] = node; }}
              src={track.src}
              preload="metadata"
              onEnded={() => { setActive(null); onPlayback(false); }}
            />
            <Button
              type="button"
              size="icon"
              onClick={() => void toggle(index)}
              aria-label={active === index ? `Pausar ${track.title}` : `Reproducir ${track.title}`}
            >
              {active === index ? <Pause /> : <Play />}
            </Button>
            <span className="mini-frecuencias" aria-hidden>
              {Array.from({ length: 9 }).map((_, bar) => <i key={bar} style={{ animationDelay: `${bar * 70}ms` }} />)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}