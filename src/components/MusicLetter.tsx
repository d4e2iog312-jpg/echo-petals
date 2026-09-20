import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import cartaMusical from "@/assets/carta-musical.png.asset.json";
import audio505 from "@/assets/505-arctic-monkeys.mp3.asset.json";
import audioChachacha from "@/assets/chachacha.mp3.asset.json";
import audioLove from "@/assets/my-one-and-only-love.mp3.asset.json";
import { assetUrl } from "@/lib/asset-url";

const TRACKS = [
  { title: "505", artist: "Arctic Monkeys", src: assetUrl(audio505) },
  { title: "Último baile", artist: "Chachacha", src: assetUrl(audioChachacha) },
  { title: "My One and Only Love", artist: "Para Key", src: assetUrl(audioLove) },
];

function AudioMessage({ track, index, active, onActivate, onState }: { track: (typeof TRACKS)[number]; index: number; active: boolean; onActivate: (index: number) => void; onState: (playing: boolean) => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current);
    contextRef.current?.close().catch(() => {});
  }, []);

  useEffect(() => {
    if (!active && audioRef.current && !audioRef.current.paused) audioRef.current.pause();
  }, [active]);

  const animate = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    barsRef.current.forEach((bar, index) => {
      if (!bar) return;
      const sample = data[Math.min(data.length - 1, index * 3)] ?? 0;
      bar.style.transform = `scaleY(${Math.max(0.16, sample / 180)})`;
    });
    frameRef.current = requestAnimationFrame(animate);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (!contextRef.current) {
        const context = new AudioContext();
        const source = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);
        analyser.connect(context.destination);
        contextRef.current = context;
        analyserRef.current = analyser;
      }
      await contextRef.current?.resume();
      onActivate(index);
      await audio.play();
      setPlaying(true);
      onState(true);
      animate();
    } else {
      audio.pause();
    }
  };

  const stopped = () => {
    setPlaying(false);
    onState(false);
    cancelAnimationFrame(frameRef.current);
  };

  return (
    <div className={`audio-mensaje audio-pos-${index + 1}`}>
      <audio ref={audioRef} src={track.src} preload="metadata" onPause={stopped} onEnded={stopped} onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />
      <Button type="button" size="icon" className="audio-play" onClick={toggle} aria-label={playing ? `Pausar ${track.title}` : `Reproducir ${track.title}`}>
        {playing ? <Pause /> : <Play />}
      </Button>
      <div className="audio-info">
        <div className="frecuencias" aria-hidden>{Array.from({ length: 28 }).map((_, i) => <span key={i} ref={(node) => { barsRef.current[i] = node; }} />)}</div>
        <input aria-label={`Progreso de ${track.title}`} type="range" min="0" max={duration || 1} value={time} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} />
      </div>
    </div>
  );
}

export function MusicLetter({ onPlayback }: { onPlayback: (playing: boolean) => void }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="etapa etapa-musical">
      <div className="carta-musical-wrap">
        <img src={cartaMusical.url} alt="Carta My Last Love para Key" />
        <div className="audios-flotantes">
          {TRACKS.map((track, index) => <AudioMessage key={track.title} track={track} index={index} active={active === index} onActivate={setActive} onState={onPlayback} />)}
        </div>
      </div>
    </section>
  );
}
