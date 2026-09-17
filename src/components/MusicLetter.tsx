import { useEffect, useRef, useState } from "react";
import { ExternalLink, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import cartaMusical from "@/assets/carta-musical.png.asset.json";
import audio505 from "@/assets/505-arctic-monkeys.mp3.asset.json";
import audioChachacha from "@/assets/chachacha.mp3.asset.json";
import audioLove from "@/assets/my-one-and-only-love.mp3.asset.json";

const TRACKS = [
  { title: "505", artist: "Arctic Monkeys", src: audio505.url, spotify: "https://open.spotify.com/track/58ge6dfP91o9oXMzq3XkIS" },
  { title: "Último baile", artist: "Chachacha", src: audioChachacha.url },
  { title: "My One and Only Love", artist: "Para Key", src: audioLove.url },
];

function AudioMessage({ track, onState }: { track: (typeof TRACKS)[number]; onState: (playing: boolean) => void }) {
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
    <div className="audio-mensaje">
      <audio ref={audioRef} src={track.src} preload="metadata" onPause={stopped} onEnded={stopped} onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />
      <Button type="button" size="icon" className="audio-play" onClick={toggle} aria-label={playing ? `Pausar ${track.title}` : `Reproducir ${track.title}`}>
        {playing ? <Pause /> : <Play />}
      </Button>
      <div className="audio-info">
        <strong>{track.title}</strong><span>{track.artist}</span>
        <div className="frecuencias" aria-hidden>{Array.from({ length: 28 }).map((_, i) => <span key={i} ref={(node) => { barsRef.current[i] = node; }} />)}</div>
        <input aria-label={`Progreso de ${track.title}`} type="range" min="0" max={duration || 1} value={time} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} />
      </div>
      {track.spotify && <Button asChild variant="ghost" size="icon"><a href={track.spotify} target="_blank" rel="noreferrer" aria-label="Abrir 505 en Spotify"><ExternalLink /></a></Button>}
    </div>
  );
}

export function MusicLetter({ onPlayback }: { onPlayback: (playing: boolean) => void }) {
  return (
    <section className="etapa etapa-musical">
      <p className="kicker">escucha mientras lees</p>
      <h2>My Last Love</h2>
      <div className="carta-musical-wrap">
        <img src={cartaMusical.url} alt="Carta My Last Love para Key" />
        <div className="audios-flotantes">
          {TRACKS.map((track) => <AudioMessage key={track.title} track={track} onState={onPlayback} />)}
        </div>
      </div>
    </section>
  );
}